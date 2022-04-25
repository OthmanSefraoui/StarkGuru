%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import (assert_not_zero, assert_in_range, assert_le, unsigned_div_rem)

from starkware.starknet.common.syscalls import (get_contract_address, get_caller_address)
from starkware.cairo.common.uint256 import (
    Uint256, uint256_add, uint256_sub, uint256_le, uint256_lt, uint256_check, uint256_eq
)

from contracts.token.IERC20 import IERC20

struct pool_core :
    member token_a: felt
    member token_b: felt
end

@storage_var
func pools_storage(pool_id: felt) -> (pool: pool_core):
end

@storage_var
func tokens_balances(pool_id: felt, token_address: felt) -> (balance: felt):
end

@storage_var
func get_pool_storage(token_a: felt, token_b: felt) -> (pool_id: felt):
end

@storage_var
func pools_length_storage() -> (length: felt):
end

######### Getters
@view
func get_token_a{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(pool_id: felt) -> (token_a: felt):
    let (pool_core_instance) = pools_storage.read(pool_id)
    let token_a = pool_core_instance.token_a 
    return (token_a)
end

@view
func get_token_b{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(pool_id: felt) -> (token_b: felt):
    let (pool_core_instance) = pools_storage.read(pool_id)
    let token_b = pool_core_instance.token_b 
    return (token_b)
end

@view
func get_balance_token{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(pool_id: felt, token: felt) -> (balance: felt):
    let (balance) = tokens_balances.read(pool_id, token)
    return (balance)
end

@view
func get_price{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(pool_id: felt, token: felt) -> (balance: felt):
    let (token_a_balance) = tokens_balances.read(pool_id, token)
    let (pool_core_instance) = pools_storage.read(pool_id)    
    if token == pool_core_instance.token_a:
        tempvar token_b = pool_core_instance.token_b
    else:
        tempvar token_b = pool_core_instance.token_a
    end
    let (token_b_balance) = tokens_balances.read(pool_id, token_b)
    let (b, _) = unsigned_div_rem(token_b_balance * 1000000000000000000 , token_a_balance + 1)
    return(b)
end

@view
func get_number_of_pools{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (number_of_pools: felt):
    let (number_of_pools) = pools_length_storage.read()
    return(number_of_pools)
end

######### Constructor

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}():
    return ()
end

######### External functions

@external
func create_pool{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(token_a: felt, token_b: felt):
    let(existant_pool_id) = get_pool_storage.read(token_a, token_b)
    assert existant_pool_id = 0
    let (pools_length) = pools_length_storage.read()
    let pool_id = pools_length + 1
    pools_length_storage.write(pool_id)
    get_pool_storage.write(token_a, token_b, pool_id)
    get_pool_storage.write(token_b, token_a, pool_id)
    let pool_core_instance = pool_core(token_a= token_a, token_b= token_b)
    pools_storage.write(pool_id, pool_core_instance)
    return()
end

@external
func swap{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(pool_id: felt, token_amount: felt, token_address: felt):
    let (sender_address) = get_caller_address()
    let (user_balance_256) = IERC20.balanceOf(contract_address = token_address, account= sender_address)
    let user_balance = user_balance_256.low
    assert_le(token_amount, user_balance)
    let (token_a_balance) = tokens_balances.read(pool_id, token_address)
    let (pool_core_instance) = pools_storage.read(pool_id)    
    if token_address == pool_core_instance.token_a:
        tempvar token_b = pool_core_instance.token_b
    else:
        tempvar token_b = pool_core_instance.token_a
    end
    let (token_b_balance) = tokens_balances.read(pool_id, token_b)
    let (b, _) = unsigned_div_rem(token_b_balance * token_amount, token_a_balance + token_amount)
    let (contract_address) = get_contract_address()
    IERC20.transferFrom(contract_address = token_address, sender = sender_address, recipient = contract_address, amount = Uint256(token_amount,0))
    IERC20.transfer(contract_address = token_b, recipient = sender_address, amount = Uint256(b,0))
    let (old_balance_a) = tokens_balances.read(pool_id, token_address)
    let (old_balance_b) = tokens_balances.read(pool_id, token_b)
    tokens_balances.write(pool_id, token_address, token_amount + old_balance_a)
    tokens_balances.write(pool_id, token_b, b + old_balance_b)
    return()
end

@external
func provide_liquidity{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(pool_id: felt, token_a_amount: felt, token_b_amount: felt):
   let (sender_address) = get_caller_address()
   let (pool_core_instance) = pools_storage.read(pool_id)
   let (contract_address) = get_contract_address()
   let token_a = pool_core_instance.token_a
   let token_b = pool_core_instance.token_b
   let (old_balance_a) = tokens_balances.read(pool_id, token_a)
   let (old_balance_b) = tokens_balances.read(pool_id, token_b)
   IERC20.transferFrom(contract_address = token_a, sender = sender_address, recipient = contract_address, amount = Uint256(token_a_amount,0))
   IERC20.transferFrom(contract_address = token_b, sender = sender_address, recipient = contract_address, amount = Uint256(token_b_amount,0))
   tokens_balances.write(pool_id, token_a, token_a_amount + old_balance_a)
   tokens_balances.write(pool_id, token_b, token_b_amount + old_balance_b)
   return()
end