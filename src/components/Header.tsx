import React from "react";
import { Text } from "react-native";
import styled from "@emotion/native";
import QRCode from "react-native-qrcode-svg";

import { API_URL_SEND_TEXT_BECH32 } from "../utils/constants";
import { Theme, themeDark } from "../style/theme";
import { useStoreState } from "../state";
import HyperLink from "react-native-hyperlink";
import { config } from "../config";

const HeaderContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
`;

const HeaderTextContainer = styled.View`
  padding-top: 10px;
  margin: 10px;
`;

const QrContainer = styled.View`
  justify-content: center;
  margin-left: 27px;
  margin-right: 27px;
`;

const Description = styled.Text`
  margin-top: 5px;
  font-size: calc(0.28vw + 12px);
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
  const numUsers = useStoreState((store) => store.numUsers);

  return (
    <HeaderContainer>
      <WebSocketStatusText>
        <WebSocketConnectedCircle connected={websocketConnected} />
        <Text>
          WebSocket {websocketConnected ? "Connected" : "Disconnected"}
          {websocketConnected &&
            ` - ${numUsers} user${numUsers !== 1 ? "s" : ""} online`}
        </Text>
      </WebSocketStatusText>
      <HeaderTextContainer>
        <div className="header">
          <Text style={{ alignSelf: "center" }}>
            <Text>{"lnurl-pay chat"}</Text>
          </Text>
        </div>
        {!isSmallDevice && (
          <>
            <Description>
              This chat is a testing playground for{" "}
              <HyperLink linkText="LUD-12" linkDefault linkStyle={{ color: "rgb(77, 121, 241)"}}>
                https://github.com/fiatjaf/lnurl-rfc/blob/luds/12.md
              </HyperLink>,{" "}
              <HyperLink linkText="LUD-18" linkDefault linkStyle={{ color: "rgb(77, 121, 241)"}}>
                https://github.com/fiatjaf/lnurl-rfc/blob/luds/18.md
              </HyperLink> and{" "}
              <HyperLink linkText="Lightning Address" linkDefault linkStyle={{ color: "rgb(77, 121, 241)"}}>
                https://lightningaddress.com
              </HyperLink>
            </Description>
            <Description>
              Scan QR-code to write a chat message
              {config.lightningAddress && <> or pay to ⚡️ {config.lightningAddress}</>}
            </Description>
          </>
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
