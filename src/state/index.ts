import {
  createStore,
  createTypedHooks,
  Thunk,
  thunk,
  action,
  Action,
} from "easy-peasy";
import { API, IsHttps, isMobile } from "../utils/constants";
import { sleep } from "../utils/utils";
import { Dimensions } from "react-native";

export interface IApiMessagesResponse {
  messages: string[];
}

export interface IStoreModel {
  init: Thunk<IStoreModel>;

  fetchMessages: Thunk<IStoreModel>;
  setupWebsocket: Thunk<IStoreModel, { timeout: number } | void>;
  setupDimensionChange: Thunk<IStoreModel>;

  setMessages: Action<IStoreModel, string[]>;
  setWebsocketConnected: Action<IStoreModel, boolean>;
  setIsSmallDevice: Action<IStoreModel, boolean>;
  setNumUsers: Action<IStoreModel, number>;

  messages: string[];
  numUsers: number;
  websocketConnected: boolean;
  isSmallDevice: boolean;
}

const storeModel: IStoreModel = {
  init: thunk(async (actions) => {
    console.log("Initialize app");

    await actions.fetchMessages();
    await actions.setupWebsocket();
    actions.setupDimensionChange();
  }),

  fetchMessages: thunk(async (actions) => {
    try {
      const protocol = window.location.protocol;
      const result = await fetch(`${protocol}//${API}/messages`);
      if (!result.ok) {
        throw new Error("Unable to retrieve chat messages");
      }

      const json: IApiMessagesResponse = await result.json();
      actions.setMessages(json.messages);
    } catch (e) {
      console.error(e);
    }
  }),

  setupWebsocket: thunk(async (actions, payload, { getState }) => {
    try {
      if (payload && payload.timeout) {
        console.log(
          `setupWebsocket: sleeping for ${payload.timeout} ms for trying to connect`
        );
        await sleep(payload.timeout);
      }
      const socketUrl = `${IsHttps ? "wss" : "ws"}://${API}/ws`;
      const ws = new WebSocket(socketUrl);
      ws.onopen = () => {
        actions.setWebsocketConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const result = JSON.parse(event.data);

          if (result.type === "MESSAGE") {
            const messages = getState().messages.slice(0);
            messages.push(result.data);
            actions.setMessages(messages);
          } else if (result.type === "NUM_USERS") {
            actions.setNumUsers(result.data);
          }
        } catch (e) {
          console.error("Error: " + e.message);
          console.error("Unknown response from ws: " + event);
        }
      };

      ws.onclose = () => {
        console.log("setupWebsocket: Socket was closed");
        actions.setupWebsocket({
          timeout: payload && payload.timeout ? payload.timeout * 2 : 1000,
        });
      };
    } catch (e) {
      console.log("setupWebsocket: Unable to open connection");
      console.log(e);
      actions.setupWebsocket({
        timeout: payload && payload.timeout ? payload.timeout * 2 : 1000,
      });
    }
  }),

  setupDimensionChange: thunk((actions) => {
    Dimensions.addEventListener("change", ({ window }) => {
      actions.setIsSmallDevice(isMobile(window.width));
    });
  }),

  setMessages: action((state, payload) => {
    state.messages = payload;
  }),

  setIsSmallDevice: action((state, payload) => {
    state.isSmallDevice = payload;
  }),

  setNumUsers: action((state, payload) => {
    state.numUsers = payload;
  }),

  setWebsocketConnected: action((state, payload) => {
    state.websocketConnected = payload;
  }),

  messages: [],
  numUsers: 0,
  websocketConnected: false,
  isSmallDevice: isMobile(Dimensions.get("window").width),
};
export const store = createStore(storeModel);

const typedHooks = createTypedHooks<IStoreModel>();

export const useStoreState = typedHooks.useStoreState;
export const useStoreActions = typedHooks.useStoreActions;
