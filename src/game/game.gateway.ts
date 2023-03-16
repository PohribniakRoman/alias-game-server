import { MessageBody,SubscribeMessage, WebSocketGateway,WebSocketServer, OnGatewayDisconnect} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server;

  handleDisconnect(socket:Socket){
  }
  @SubscribeMessage("ENTER_ROOM")
  enterRoom(socket: Socket,data:any){
    console.log("ASdasdadas");
  }
}