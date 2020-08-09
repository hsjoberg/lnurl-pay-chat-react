import {
  createStore,
  createTypedHooks,
  Thunk,
  thunk,
  action,
  Action,
} from "easy-peasy";
import { API, IsHttps } from "../constants";

export interface IApiMessagesResponse {
  messages: string[];
}

export interface IStoreModel {
  init: Thunk<IStoreModel>;

  setupWebsocket: Thunk<IStoreModel>;

  fetchMessages: Thunk<IStoreModel>;
  setMessages: Action<IStoreModel, string[]>;

  messages: string[];
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

  setupWebsocket: thunk(async (actions, _, { getState }) => {
    const socketUrl = `${IsHttps ? "wss" : "ws"}://${API}/receive-messages`;
    const ws = new WebSocket(socketUrl);
    ws.onmessage = (event) => {
      const messages = getState().messages.slice(0);
      messages.push(event.data);
      actions.setMessages(messages);
    };
  }),

  setMessages: action((state, payload) => {
    state.messages = payload;
  }),

  messages: [],
};
export const store = createStore(storeModel);

const typedHooks = createTypedHooks<IStoreModel>();

export const useStoreState = typedHooks.useStoreState;
export const useStoreActions = typedHooks.useStoreActions;
