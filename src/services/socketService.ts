import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

import config from "../config";
import { Client, RegisterPeerData, ConnectPeerData } from "../types";

class SocketService {
  private io: Server;
  private clients: { [key: string]: Client };

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
      path: config.SOCKET_PATH,
    });
    this.clients = {};
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("Client connected: ", socket.id);
      this.clients[socket.id] = { id: socket.id };

      socket.on("registerPeer", (data: RegisterPeerData) => {
        this.handlePeerRegistration(socket, data);
      });

      socket.on("connectPeer", (data: ConnectPeerData) => {
        this.handlePeerConnection(socket, data);
      });

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });

      // Send initial client list
      this.io.emit("clients", this.clients);
    });
  }

  private handlePeerRegistration(socket: Socket, data: RegisterPeerData): void {
    console.log(data);
    if (this.clients[socket.id]) {
      this.clients[socket.id].peerId = data.id;
      this.clients[socket.id].peerName = data.name;
      this.clients[socket.id].ip_addr = data.ip;
      console.log("peer connected ", data.id);
      this.io.emit("clients", this.clients);
    }
  }

  private handlePeerConnection(socket: Socket, { clientId, from, name }: ConnectPeerData): void {
    if (this.clients[clientId]) {
      this.io.to(clientId).emit("connectionRequest", { from, name });
    }
  }

  private handleDisconnect(socket: Socket): void {
    console.log("Client disconnected: ", socket.id);
    delete this.clients[socket.id];
    this.io.emit("clients", this.clients);
  }
}

export default SocketService; 