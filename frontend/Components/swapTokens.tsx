import React from "react";
import { Tag, Avatar, Text, TagLabel, NumberInput, NumberInputField, HStack, Select, Stack, Spacer, StackDivider } from '@chakra-ui/react'


const SwapTokens = () => {
    return (
        <Stack>
            <Text>You sell</Text>
            <HStack>
                <NumberInput defaultValue={0.0} size="lg" width={400}>
                    <NumberInputField />
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
            <Text>You sell</Text>
            <HStack>
                <NumberInput defaultValue={0.0} size="lg" width={400}>
                    <NumberInputField />
                </NumberInput>
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
        </Stack>
    )
}

export default SwapTokens;