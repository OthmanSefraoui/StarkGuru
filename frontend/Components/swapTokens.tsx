import React from "react";
import { Container, Heading, Text, Button, NumberInput, NumberInputField, HStack, Select, Stack } from '@chakra-ui/react'


const SwapTokens = () => {
    return (
        <Stack>
            <Text>You sell</Text>
            <HStack>
                <NumberInput defaultValue={0.0} >
                    <NumberInputField />
                </NumberInput>
                <Select placeholder='Select currency' width={200}>
                    <option value='option1'>ETH</option>
                    <option value='option2'>DAI</option>
                    <option value='option3'>USDC</option>
                </Select>
            </HStack>
            <Text>You sell</Text>
            <HStack>
                <NumberInput defaultValue={0.0}>
                    <NumberInputField />
                </NumberInput>
                <Select placeholder='Select currency' width={200}>
                    <option value='option1'>ETH</option>
                    <option value='option2'>DAI</option>
                    <option value='option3'>USDC</option>
                </Select>
            </HStack>
        </Stack>
    )
}

export default SwapTokens;