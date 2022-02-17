export const config: IConfig = {
  api: "192.168.1.111:8087/api",
  lightningAddress: "chat@domain.com",
}

export interface IConfig {
  // API uri, without protocol (i.e http/https)
  api: string;
  // Lightning Address (i.e chat@domain.com) that goes to the LNURL-pay endpoint
  lightningAddress: string | null;
}
