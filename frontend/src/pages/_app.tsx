import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import { InjectedConnector, StarknetProvider } from '@starknet-react/core'
import { ChakraProvider } from '@chakra-ui/react'


function MyApp({ Component, pageProps }: AppProps) {
  const connectors = [new InjectedConnector()]

  return (
    <StarknetProvider autoConnect connectors={connectors}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </StarknetProvider>
  )
}

export default MyApp
