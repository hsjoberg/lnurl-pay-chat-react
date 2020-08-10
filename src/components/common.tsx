import styled from "@emotion/native";
import { Theme } from "../style/theme";

export const Container = styled.View`
  flex: 1;
  margin: auto;
  height: 100%;
  background-color: ${(props) => (props.theme as Theme).common.background};
`;

export const Content = styled.View`
  flex: 1;
  align-self: center;
`;

export const ChatContainer = styled.ScrollView`
  flex: 1;
  background-color: ${(props) => (props.theme as Theme).common.background};
` as any; // ref prop def seems to not exist

export const ChatBox = styled.View`
  margin: 18px;
`;

export const ChatBoxAuthor = styled.Text`
  font-family: "IBMPlexSans-Regular";
  color: ${(props) => (props.theme as Theme).common.text};
`;

export const ChatBoxText = styled.Text`
  font-family: "IBMPlexSans-Regular";
  margin-top: 2.5px;
  font-size: calc(15px + 0.45vw);
  color: ${(props) => (props.theme as Theme).common.text};
`;
