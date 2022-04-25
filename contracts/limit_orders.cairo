%lang starknet







struct order : 
    member order_id: felt
    member pool_id: felt
    member price: felt
    member amount: felt
    member order_type: felt
    member executed: felt
end