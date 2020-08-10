import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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

function App() {
  const init = useStoreActions((store) => store.init);
  const messages = useStoreState((store) => store.messages);

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

  return (
    <ThemeProvider theme={themeDark}>
      <Container>
        <Content>
          <Global styles={globalCss} />
          <Header />
          <ChatContainer ref={chatBox} onContentSizeChange={scrollToEnd}>
            <View style={scrollFade}></View>
            {messages.map((message, i) => {
              return (
                <ChatBox key={i}>
                  <ChatBoxAuthor>Anonymous:</ChatBoxAuthor>
                  <ChatBoxText>{message}</ChatBoxText>
                </ChatBox>
              );
            })}
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
