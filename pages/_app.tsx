import type { AppProps as NextAppProps } from "next/app"; // <-- alias
import "../styles.css";
import Head from "next/head";

export default function App({ Component, pageProps }: NextAppProps) {
  return (
    <>
      <Head>
        <title>Vision Art Collection</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
