import { Tag, Avatar, Text, TagLabel, NumberInput, NumberInputField, HStack, Stack, Spacer } from '@chakra-ui/react'
import TokenABalance from 'Components/tokenABalance';
import TokenBBalance from 'Components/tokenBBalance';
import { useState } from "react";
import React, { useMemo } from 'react';
import { useStarknet, useStarknetCall } from '@starknet-react/core';
import { uint256ToBN } from 'starknet/dist/utils/uint256';
import { useAMMContract, useTokenAContract } from '~/hooks/contracts';

const SwapTokens = () => {

    const [valueA, setValueA] = React.useState('');

    const { account } = useStarknet();
    const { contract } = useAMMContract();
    const tokenAAddress = useTokenAContract().contract?.address;

    console.log(tokenAAddress);

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_price',
        args: [1, tokenAAddress],
    });

    const content = useMemo(() => {
        if (loading || !data?.length) {
            return <div>Loading price</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        const price = data[0] / 1000000000000000000;
        return price;
    }, [data, loading, error]);

    return (
        <Stack>
            <Text>You sell</Text>
            <HStack>
                <NumberInput defaultValue={0.0} size="lg" width={400}>
                    <NumberInputField onChange={(e) => setValueA(e.currentTarget.value)}/>
                </NumberInput>
                <Tag size='lg' colorScheme='teal' borderRadius='full'>
                    <Avatar
                        src='/usdc.png'
                        size='xs'
                        name='usdc'
                        ml={-1}
                        mr={2}
                    />
                    <TagLabel>USDC</TagLabel>
                </Tag>
            </HStack>
            <HStack>
                <Spacer />
                <TokenABalance />
            </HStack>
            <Text>You buy</Text>
            <HStack>
                <Text size='xl' width={400}>{valueA * content}</Text>
                
                <Tag size='lg' colorScheme='teal' borderRadius='full'>
                    <Avatar
                        src='/ether.png'
                        size='xs'
                        name='Ether'
                        ml={-1}
                        mr={2}
                    />
                    <TagLabel>ETH</TagLabel>
                </Tag>
            </HStack>
            <HStack>
                <Spacer />
                <TokenBBalance />
            </HStack>
        </Stack>
    )
}

export default SwapTokens;