%lang starknet

@contract_interface
namespace Iamm:
    func get_token_a(pool_id : felt) -> (token_a : felt):
    end

    func get_token_b(pool_id : felt) -> (token_b : felt):
    end

    func get_balance_token(pool_id : felt, token : felt) -> (balance : felt):
    end

    func get_price(pool_id : felt, token : felt) -> (balance : felt):
    end

    func get_number_of_pools() -> (number_of_pools : felt):
    end

    func create_pool(token_a : felt, token_b : felt):
    end

    func swap(pool_id : felt, token_amount : felt, token_address : felt) -> (amount : felt):
    end

    func provide_liquidity(pool_id : felt, token_a_amount : felt, token_b_amount : felt):
    end

    func get_pair(pool_id : felt, token_a : felt) -> (token_b : felt):
    end
end
