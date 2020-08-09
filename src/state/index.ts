import {
  createStore,
  createTypedHooks,
  Thunk,
  thunk,
  action,
  Action,
} from "easy-peasy";
import { API, IsHttps } from "../utils/constants";
import { sleep } from "../utils/utils";

export interface IApiMessagesResponse {
  messages: string[];
}

export interface IStoreModel {
  init: Thunk<IStoreModel>;

  setupWebsocket: Thunk<IStoreModel, { timeout: number } | void>;

  fetchMessages: Thunk<IStoreModel>;
  setMessages: Action<IStoreModel, string[]>;
  setWebsocketConnected: Action<IStoreModel, boolean>;

  messages: string[];
  websocketConnected: boolean;
}

const storeModel: IStoreModel = {
  init: thunk(async (actions) => {
    console.log("Initialize app");

    await actions.fetchMessages();
    await actions.setupWebsocket();
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
      const socketUrl = `${IsHttps ? "wss" : "ws"}://${API}/receive-messages`;
      const ws = new WebSocket(socketUrl);
      actions.setWebsocketConnected(true);
      ws.onmessage = (event) => {
        const messages = getState().messages.slice(0);
        messages.push(event.data);
        actions.setMessages(messages);
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

  setMessages: action((state, payload) => {
    state.messages = payload;
  }),

  setWebsocketConnected: action((state, payload) => {
    state.websocketConnected = payload;
  }),

  messages: [],
  websocketConnected: false,
};
export const store = createStore(storeModel);

const typedHooks = createTypedHooks<IStoreModel>();

export const useStoreState = typedHooks.useStoreState;
export const useStoreActions = typedHooks.useStoreActions;
