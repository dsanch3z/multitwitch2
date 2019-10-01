import React from "react";
import Head from "next/head";
import Nav from "../components/nav";

export default function({ children }: { children: any }) {
  return (
    <>
      <Head>
        <meta http-equiv="content-type" content="text/html" />
        <meta name="language" content="english" />
        <meta
          name="description"
          content="Watch all your favorite Twitch streamers at the same time."
        />
        <meta
          name="keywords"
          content="Software Engineer,Product Manager,Project Manager,Data Scientist,Computer Scientist"
        ></meta>
        >
        <link
          rel="shortcut icon"
          href="/static/favicon.ico"
          type="image/x-icon"
        />
      </Head>
      <Nav />
      <main>{children}</main>
      <style global jsx>{`
        #__next {
          display: flex;
          height: 100%;
          flex-grow: 1;
          flex-direction: column;
        }
      `}</style>
      <style jsx>{`
        main {
          display: flex;
          flex-grow: 1;
          flex-direction: column;
        }
      `}</style>
    </>
  );
}
