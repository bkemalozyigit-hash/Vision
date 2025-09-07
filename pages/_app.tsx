import type { AppProps } from "next/app";
import "../styles.css";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Vision Art Collection</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}tsx
import type { AppProps } from "next/app";
import "../styles.css";
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
