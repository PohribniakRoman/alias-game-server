import { MessageBody,SubscribeMessage, WebSocketGateway,WebSocketServer, OnGatewayDisconnect} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

class Storage{
  games:object;
  constructor() {
    this.games = {};
  }
  deleteGame(id){
    delete this.games[id];
  }
  createGame(id,game){
    this.games[id]=game;
  }
}
const DB = new Storage();
class Game {
  participants:Array<any>;
  messages:object;
  constructor(participant,socket){
    this.participants = [{participant,socket:socket}];
    this.messages = [];
  };
   join(participant,socket){
    this.participants = this.participants.filter(user => user.participant.name != participant.name)
    this.participants.push({ participant, socket:socket})
  }
  leave(socket){
    this.participants = this.participants.filter(participant=>participant.socket !== socket)
  }
}

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server;

  handleDisconnect(socket:Socket){
  }
  @SubscribeMessage("ENTER")
  enterRoom(socket: Socket,data:any){
    if(DB.games.hasOwnProperty(data.gameId)){
      DB.games[data.gameId].join(data.user,socket.id);
      return null;
    }
    this.createRoom(socket,data);
  }

  createRoom(socket: Socket,data:any){
      DB.createGame(data.gameId,new Game(data.user,socket.id))
      this.enterRoom(socket,data);
  }
}