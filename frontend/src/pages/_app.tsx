import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { InjectedConnector, StarknetProvider } from '@starknet-react/core';
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
      <NextHead>
        <title>StarkNet ❤️ React</title>
      </NextHead>
      <Component {...pageProps} />
    </StarknetProvider>
  );
}

export default MyApp;
