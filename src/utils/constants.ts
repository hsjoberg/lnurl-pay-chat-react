import bech32 from "bech32";
import { stringToUint8Array } from "./utils";
import { config } from "../config";

export const API = config.api;
export const API_URL_SEND_TEXT = `${API}/send-text`;
export const API_URL_SEND_TEXT_BECH32 = bech32.encode(
  "lnurl",
  bech32.toWords(
    stringToUint8Array(window.location.protocol + "//" + API_URL_SEND_TEXT)
  ),
  1024
);
export const IsHttps = window.location.protocol === "https:";
export const isMobile = (width: number) => width < 600;
