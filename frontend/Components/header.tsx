import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Tag,
  TagLabel,
  Spacer,
  Avatar,
  Heading,
} from '@chakra-ui/react';

const Header = () => {
  return (
    <Box
      bg={'neutral.1100'}
      display={{ base: 'none', md: 'block' }}
      position="fixed"
      w="100%"
      zIndex={99}
      borderBottomWidth="1px"
      borderColor={'neutral.300'}
      shadow="0 0 10px 0 rgba(0,0,0, 0.035);"
    >
      <VStack align="start" spacing={0}>
        <HStack justify="space-between" w="100%" h={16}>
          <Heading size={'md'} paddingLeft={8}>
            ENARC by StarkWars
          </Heading>
          <Spacer />
          <HStack ml={-4} spacing={2} paddingRight={8}>
            <Spacer />
            <Tag size={'lg'} key={'lg'} variant="outline" colorScheme="white">
              <TagLabel>StarkNet</TagLabel>
            </Tag>
            <Avatar src="/StarkNet-Icon.png" size="sm" />
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Header;
