import React, { useEffect, useRef } from "react";
import { Text, ScrollView, View } from "react-native";
import { Global, ThemeProvider } from "@emotion/react";
import styled from "@emotion/native";

import Header from "./components/Header";
import { useStoreActions, useStoreState } from "./state";
import globalCss from "./utils/global-css-emotion";
import { themeDark, Theme, themeLight } from "./style/theme";
import QRCode from "react-native-qrcode-svg";

const Container = styled.View`
  flex: 1;
  margin: auto;
  height: 100%;
  background-color: ${(props) => (props.theme as Theme).common.background};
`;

const Content = styled.View`
  flex: 1;
  align-self: center;
`;

const ChatContainer = styled.ScrollView`
  flex: 1;
  background-color: ${(props) => (props.theme as Theme).common.background};
` as any; // ref prop def seems to not exist

const ChatBox = styled.View`
  margin: 20px;
`;

const ChatBoxAuthor = styled.Text`
  font-family: "IBMPlexSans-Regular";
  color: ${(props) => (props.theme as Theme).common.text};
`;

const ChatBoxText = styled.Text`
  font-family: "IBMPlexSans-Regular";
  margin-top: 2.5px;
  font-size: 21px;
  color: ${(props) => (props.theme as Theme).common.text};
`;

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

  return (
    <ThemeProvider theme={themeDark}>
      <Container>
        <Content>
          <Global styles={globalCss} />
          <Header />
          <ChatContainer
            ref={chatBox}
            onContentSizeChange={() =>
              chatBox.current?.scrollToEnd({ animated: false })
            }
          >
            <View
              style={
                {
                  position: "sticky",
                  top: 0,
                  left: 0,
                  height: "10px",
                  right: 0,
                  background:
                    "linear-gradient(to bottom, rgba(21, 19, 20, 1) 0%, rgba(21, 19, 20, 0) 100%)",
                  zIndex: 100,
                } as any
              }
            ></View>
            {messages.map((message, i) => {
              return (
                <ChatBox key={i}>
                  <ChatBoxAuthor>Anonymous:</ChatBoxAuthor>
                  <ChatBoxText>{message}</ChatBoxText>
                </ChatBox>
              );
            })}
          </ChatContainer>
        </Content>
      </Container>
    </ThemeProvider>
  );
}

export default App;
