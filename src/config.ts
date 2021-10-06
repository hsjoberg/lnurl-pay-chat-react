export const config: IConfig = {
  api: "192.168.1.111:8087/api"
}

export interface IConfig {
  // API uri, without protocol (i.e http/https)
  api: string;
}
