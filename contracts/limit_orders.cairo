%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import (
    assert_not_zero,
    assert_in_range,
    assert_le,
    unsigned_div_rem,
)

from starkware.starknet.common.syscalls import get_contract_address, get_caller_address
from starkware.cairo.common.uint256 import (
    Uint256,
    uint256_add,
    uint256_sub,
    uint256_le,
    uint256_lt,
    uint256_check,
    uint256_eq,
)

from contracts.token.IERC20 import IERC20
from contracts.Iamm import Iamm

struct order_core:
    member order_id : felt
    member pool_id : felt
    member price : felt
    member amount : felt
    member token : felt
    member order_status : felt
    member order_owner : felt
end

@storage_var
func orders_storage(order_id : felt) -> (order : order_core):
end

@event
func order_created(order_id : felt, pool_id : felt, price : felt, amount : felt, token : felt):
end

@storage_var
func orders_length_storage() -> (orders_length : felt):
end

@storage_var
func amm_contract_address() -> (amm_contract : felt):
end

@storage_var
func orders_indexed_storage(price_entry : felt, index : felt) -> (order_id : felt):
end

@storage_var
func last_index_executed_storage(price_entry : felt) -> (last_index_executed : felt):
end

@storage_var
func last_index_storage(price_entry : felt) -> (last_index : felt):
end

# ######## Getters

@view
func get_order{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    order_id : felt
) -> (order : order_core):
    let (order_core_instance) = orders_storage.read(order_id)
    return (order_core_instance)
end

@view
func get_number_of_orders{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
    get_number_of_orders : felt
):
    let (number_of_orders) = orders_length_storage.read()
    return (number_of_orders)
end

# ######## Constructor

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    amm_contract : felt
):
    amm_contract_address.write(amm_contract)
    return ()
end

# ######## External functions

@external
func create_order{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    pool_id : felt, price : felt, amount : felt, token : felt
):
    let (sender_address) = get_caller_address()
    let (contract_address) = get_contract_address()
    let (user_balance_256) = IERC20.balanceOf(contract_address=token, account=sender_address)
    let user_balance = user_balance_256.low
    let (orders_length) = orders_length_storage.read()
    let order_id = orders_length + 1
    assert_le(amount, user_balance)
    IERC20.transferFrom(
        contract_address=token,
        sender=sender_address,
        recipient=contract_address,
        amount=Uint256(amount, 0),
    )
    let order_core_instance = order_core(
        order_id=order_id,
        pool_id=pool_id,
        price=price,
        amount=amount,
        token=token,
        order_status=0,
        order_owner=sender_address,
    )
    orders_storage.write(order_id, order_core_instance)
    orders_length_storage.write(order_id)
    let (price_rounded, _) = unsigned_div_rem(price * 10, 1000000000000000000)
    let (last_index) = last_index_storage.read(price_rounded)
    let new_index = last_index + 1
    orders_indexed_storage.write(price_rounded, new_index, order_id)
    last_index_storage.write(price_rounded, new_index)
    order_created.emit(order_id, pool_id, price, amount, token)
    return ()
end

@external
func execute_order{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    order_id : felt
):
    let (sender_address) = get_caller_address()
    assert_not_zero(order_id)
    let (order_core_instance) = orders_storage.read(order_id)
    let order_status = order_core_instance.order_status
    assert order_status = 0
    let (amm_contract) = amm_contract_address.read()
    let token = order_core_instance.token
    let pool_id = order_core_instance.pool_id
    let price = order_core_instance.price
    let amount = order_core_instance.amount
    let order_owner = order_core_instance.order_owner
    let (price_rounded, _) = unsigned_div_rem(price * 10, 1000000000000000000)
    let (last_index_executed) = last_index_executed_storage.read(price_rounded)
    let (expected_order_id) = orders_indexed_storage.read(price_rounded, last_index_executed + 1)
    assert order_id = expected_order_id
    let (current_price) = Iamm.get_price(
        contract_address=amm_contract, pool_id=pool_id, token=token
    )
    let (slippage_cost, _) = unsigned_div_rem(price * 1000000000000000000, 100000000000000000000)
    let upper_bound = price + slippage_cost
    let lower_bound = price - slippage_cost
    assert_in_range(current_price, lower_bound, upper_bound)
    IERC20.approve(contract_address=token, spender=amm_contract, amount=Uint256(amount, 0))
    let (amount_token_received) = Iamm.swap(
        contract_address=amm_contract, pool_id=pool_id, token_amount=amount, token_address=token
    )
    let (token_received) = Iamm.get_pair(
        contract_address=amm_contract, pool_id=pool_id, token_a=token
    )
    let (executor_bonus, _) = unsigned_div_rem(amount_token_received, 1000)
    IERC20.transfer(
        contract_address=token_received,
        recipient=order_owner,
        amount=Uint256(amount_token_received - executor_bonus, 0),
    )
    IERC20.transfer(
        contract_address=token_received, recipient=sender_address, amount=Uint256(executor_bonus, 0)
    )
    let order_core_instance_executed = order_core(
        order_id=order_id,
        pool_id=pool_id,
        price=price,
        amount=amount,
        token=token,
        order_status=1,
        order_owner=order_owner,
    )
    orders_storage.write(order_id, order_core_instance_executed)
    last_index_executed_storage.write(price_rounded, last_index_executed + 1)
    return ()
end

@external
func cancel_order{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    order_id : felt
):
    let (sender_address) = get_caller_address()
    let (order_core_instance) = orders_storage.read(order_id)
    let order_owner = order_core_instance.order_owner
    assert sender_address = order_owner
    let order_status = order_core_instance.order_status
    assert order_status = 0
    let amount = order_core_instance.amount
    let token = order_core_instance.token
    IERC20.transfer(contract_address=token, recipient=sender_address, amount=Uint256(amount, 0))
    let pool_id = order_core_instance.pool_id
    let price = order_core_instance.price
    let order_core_instance_canceled = order_core(
        order_id=order_id,
        pool_id=pool_id,
        price=price,
        amount=amount,
        token=token,
        order_status=2,
        order_owner=order_owner,
    )
    return ()
end
