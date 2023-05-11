import "../styles/globals.css";
import "../styles/main.styles.css";
import { ConfigProvider } from "antd";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider
    // theme={{
    //   token: {
    //     colorPrimary: "#00b96b",
    //   },
    // }}
    >
      <Head>
        // {/* <link rel='shortcut icon' href='/logo-icon.svg' /> */}
        <title>
          Accredited Boarding House Management and Student Monitoring System for
          University Student Services
        </title>
        <meta
          name="description"
          content="This system develop for Landlords, students and OSS admin to ensure and automate booking, student monitoring and boarding house management"
        />
      </Head>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
