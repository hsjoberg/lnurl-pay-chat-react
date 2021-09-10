export const config: IConfig = {
  api: "192.168.1.1:8080/api"
}

export interface IConfig {
  // API uri, without protocol (i.e http/https)
  api: string;
}
