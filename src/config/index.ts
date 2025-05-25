interface Config {
  PORT: number;
  PEER_PORT: number;
  CORS_OPTIONS: {
    origin: string;
  };
  SOCKET_PATH: string;
  PEER_PATH: string;
}

const config: Config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 8000,
  PEER_PORT: process.env.PEER_PORT ? parseInt(process.env.PEER_PORT) : 9000,
  CORS_OPTIONS: {
    origin: "*",
  },
  SOCKET_PATH: "/socket.io",
  PEER_PATH: "/"
};

export default config; 