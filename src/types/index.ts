export interface Client {
  id: string;
  peerId?: string;
  peerName?: string;
  ip_addr?: string;
}

export interface RegisterPeerData {
  id: string;
  name: string;
  ip: string;
}

export interface ConnectPeerData {
  clientId: string;
  from: string;
  name: string;
}

export interface ConnectionRequest {
  from: string;
  name: string;
} 