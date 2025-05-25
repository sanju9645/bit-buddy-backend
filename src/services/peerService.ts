import { PeerServer } from "peer";

import config from "../config";

class PeerService {
  private peerServer: any; // PeerServer type is not available in @types/peer

  constructor() {
    this.peerServer = PeerServer({ port: config.PEER_PORT, path: "/" });
  }

  public getServer(): any {
    return this.peerServer;
  }
}

export default PeerService;