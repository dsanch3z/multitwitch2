import React, { useState } from "react";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { Empty, Select, Tabs } from "antd";
import Layout from "../components/layout";

const { TabPane } = Tabs;

interface HomeProps {
  channels: string[];
}

const Home: NextPage<HomeProps> = props => {
  const router = useRouter();
  const [channels, setChannels] = useState<string[]>(props.channels);
  const channelGrid =
    channels.length === 2 ? [[channels[0]], [channels[1]]] : chunk(channels, 2);
  const handleChange = (tags: string[]) => {
    setChannels(tags);
    router.push(`/?channels=${tags.join(",")}`);
  };

  return (
    <>
      <Head>
        <title key="title">Multitwitch {channels.join(",")}</title>
      </Head>
      <Layout>
        <Select
          mode="tags"
          placeholder="Add Twitch usernames"
          defaultValue={channels as any}
          tokenSeparators={[","]}
          onChange={handleChange}
          autoFocus
        ></Select>
        <div className="row">
          <section className="column content">
            {channelGrid.map((row, i) => {
              return (
                <div key={i} className="row">
                  {row.length === 0 ? (
                    <div className="empty">
                      <Empty description="Add Twitch channels to see the stream(s)." />
                    </div>
                  ) : (
                    row.map(channel => {
                      return (
                        <iframe
                          key={`channel:${channel}`}
                          id={`channel:${channel}`}
                          src={`https://player.twitch.tv/?channel=${channel}`}
                          height="100%"
                          width="100%"
                          frameBorder={0}
                          allowFullScreen
                        ></iframe>
                      );
                    })
                  )}
                </div>
              );
            })}
          </section>
          <aside className="chat">
            {channels.length === 0 ? (
              <div className="empty">
                <Empty description="Add Twitch channels to see the chat" />
              </div>
            ) : (
              <Tabs
                style={{ height: "100%" }}
                tabPosition={"top"}
                defaultActiveKey={channels[0]}
              >
                {channels.map(channel => (
                  <TabPane key={channel} tab={channel}>
                    <iframe
                      id={`chat:${channel}`}
                      src={`https://www.twitch.tv/embed/${channel}/chat?darkpopout`}
                      height="100%"
                      width="100%"
                      frameBorder={0}
                    ></iframe>
                  </TabPane>
                ))}
              </Tabs>
            )}
          </aside>
        </div>
        <style global jsx>{`
          .ant-tabs-content {
            height: 90%;
          }
        `}</style>

        <style jsx>{`
          .row {
            display: flex;
            flex-grow: 1;
            flex-direction: row;
          }

          .column {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
          }

          .chat {
            display: flex;
            width: 400px;
            max-width: 400px;
            flex-direction: column;
          }

          .empty {
            display: flex;
            flex-grow: 1;
            align-items: center;
            justify-content: space-around;
          }
        `}</style>
      </Layout>
    </>
  );
};

Home.getInitialProps = async ({ query }: NextPageContext) => {
  const channels = query.channels as string;
  return { channels: channels ? channels.split(",") : [] };
};

function chunk(arr: string[], chunkSize: number) {
  return arr.reduce<string[][]>(
    (curr, next) => {
      const last = curr.length - 1;
      const inner = curr[last];
      if (inner.length < chunkSize) {
        inner.push(next);
      } else {
        curr.push([]);
        const last = curr.length - 1;
        curr[last].push(next);
      }
      return curr;
    },
    [[]]
  );
}

export default Home;
