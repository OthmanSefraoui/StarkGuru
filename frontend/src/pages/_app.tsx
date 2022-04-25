import type { AppProps } from 'next/app';
import { InjectedConnector, StarknetProvider } from '@starknet-react/core';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Header from 'Components/header';
import { Provider } from 'starknet';

function MyApp({ Component, pageProps }: AppProps) {
  const connectors = [new InjectedConnector()];
  const starkWarsProvider: Provider = new Provider({
    baseUrl: 'https://hackathon-3.starknet.io',
  });

  return (
    <StarknetProvider
      autoConnect
      connectors={connectors}
      defaultProvider={starkWarsProvider}
    >
      <ChakraProvider>
        <Header />
        <Box as="main" pt={{ base: 16, md: 32 }} pb={{ base: 24, md: 16 }}>
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </StarknetProvider>
  );
}

export default MyApp;
