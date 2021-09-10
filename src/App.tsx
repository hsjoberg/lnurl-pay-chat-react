import React, { useEffect, useRef } from "react";
import { ScrollView, View, Button, Linking, Platform } from "react-native";
import { Global, ThemeProvider } from "@emotion/react";

import Header from "./components/Header";
import { useStoreActions, useStoreState } from "./state";
import globalCss from "./utils/global-css-emotion";
import { themeDark } from "./style/theme";
import {
  Container,
  Content,
  ChatContainer,
  ChatBox,
  ChatBoxAuthor,
  ChatBoxText,
} from "./components/common";
import { API_URL_SEND_TEXT_BECH32 } from "./utils/constants";
import { extractDescription } from "./utils/name-desc";
import Hyperlink from "react-native-hyperlink";

function App() {
  const init = useStoreActions((store) => store.init);
  const messages = useStoreState((store) => store.messages);
  const isSmallDevice = useStoreState((store) => store.isSmallDevice);

  const chatBox = useRef<ScrollView>();

  useEffect(() => {
    async function initialize() {
      await init();
    }
    initialize();
  }, []);

  const scrollToEnd = () => {
    chatBox.current?.scrollToEnd({ animated: false });
  };

  const sendMessage = () => {
    Linking.openURL(
      `lightning:${API_URL_SEND_TEXT_BECH32}` +
        "?" +
        Math.floor(Math.random() * 10000)
    );
  };

  const openUrl = (url: string, _text: string) => {
    if (Platform.OS == "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <ThemeProvider theme={themeDark}>
      <Container>
        <Content
          style={{
            width: isSmallDevice ? "100%" : undefined,
          }}
        >
          <Global styles={globalCss} />
          <Header />
          <ChatContainer ref={chatBox} onContentSizeChange={scrollToEnd}>
            <View style={scrollFade}></View>
            {messages.map((message, i) => {
              const { name, description } = extractDescription(message);

              return (
                <ChatBox key={i}>
                  <ChatBoxAuthor>
                    {name ?? "Anonymous"}:
                  </ChatBoxAuthor>
                  <ChatBoxText>
                    <Hyperlink onPress={openUrl} linkStyle={{ color: "rgb(26, 26, 221)"}}>{description}</Hyperlink>
                  </ChatBoxText>
                </ChatBox>
              );
            })}
            {isSmallDevice && (
              <View style={{ flexDirection: "row-reverse", marginRight: 10 }}>
                <Button color="gray" title="Chat" onPress={sendMessage} />
              </View>
            )}
            <View style={{ marginTop: 20 }}></View>
          </ChatContainer>
        </Content>
      </Container>
    </ThemeProvider>
  );
}

const scrollFade = {
  position: "sticky" as any,
  top: 0,
  left: 0,
  height: "15px",
  right: 0,
  background:
    "linear-gradient(to bottom, rgba(21, 19, 20, 1) 0%, rgba(21, 19, 20, 0) 100%)",
  zIndex: 100,
};

export default App;
