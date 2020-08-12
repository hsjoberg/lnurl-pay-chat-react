import React from "react";
import { Text } from "react-native";
import styled from "@emotion/native";
import QRCode from "react-native-qrcode-svg";

import { API_URL_SEND_TEXT_BECH32 } from "../utils/constants";
import { Theme, themeDark } from "../style/theme";
import { useStoreState } from "../state";

const HeaderContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
`;

const HeaderTextContainer = styled.View`
  margin-top: 5px;
  padding: 10px;
`;

const QrContainer = styled.View`
  justify-content: center;
  margin-left: 27px;
  margin-right: 27px;
`;

const Description = styled.Text`
  margin-top: 5px;
  font-size: calc(0.27vw + 14px);
  color: ${(props) => (props.theme as Theme).common.text};
  text-align: center;
`;

const WebSocketStatusText = styled.Text`
  display: flex;
  position: absolute;
  left: 10px;
  align-items: center;
  flex-direction: row;
  color: ${(props) => (props.theme as Theme).common.text};
  font-size: 10px;
  user-select: none;
`;

const WebSocketConnectedCircle = styled.Text<{ connected: boolean }>`
  height: 7px;
  width: 7px;
  background-color: ${(props) => (props.connected ? "green" : "red")};
  color: green;
  border-radius: 20px;
  display: flex;
  margin-right: 9px;
`;

export default function HeaderComponent() {
  const websocketConnected = useStoreState((store) => store.websocketConnected);
  const isSmallDevice = useStoreState((store) => store.isSmallDevice);

  return (
    <HeaderContainer>
      <WebSocketStatusText>
        <WebSocketConnectedCircle connected={websocketConnected} />
        <Text>
          WebSocket {websocketConnected ? "Connected" : "Disconnected"}
        </Text>
      </WebSocketStatusText>
      <HeaderTextContainer>
        <div className="header">
          <Text style={{ alignSelf: "center" }}>
            <Text>{"lnurl-pay chat"}</Text>
          </Text>
        </div>
        {!isSmallDevice && (
          <Description>Scan QR-code to write a chat message</Description>
        )}
      </HeaderTextContainer>
      {!isSmallDevice && (
        <QrContainer>
          <a href={`lightning:${API_URL_SEND_TEXT_BECH32.toUpperCase()}`}>
            <QRCode
              quietZone={10}
              backgroundColor={themeDark.colors.white}
              value={API_URL_SEND_TEXT_BECH32}
              size={250}
            />
          </a>
        </QrContainer>
      )}
    </HeaderContainer>
  );
}
