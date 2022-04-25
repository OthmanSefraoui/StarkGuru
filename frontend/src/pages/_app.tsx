import type { AppProps } from 'next/app'
import { InjectedConnector, StarknetProvider } from '@starknet-react/core'
import { ChakraProvider, Box } from '@chakra-ui/react'
import Header from 'Components/header'


function MyApp({ Component, pageProps }: AppProps) {
  const connectors = [new InjectedConnector()]

  return (
    <StarknetProvider autoConnect connectors={connectors}>
      <ChakraProvider>
        <Header />
        <Box as="main" pt={{ base: 16, md: 32 }} pb={{ base: 24, md: 16 }}>
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </StarknetProvider>
  )
}

export default MyApp
