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
    this.participants = this.participants.filter(user=>user.socket !== socket)
  }
}

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server;
  handleDisconnect(socket:Socket){
    for(let key in DB.games){
      DB.games[key].leave(socket.id)
      if(DB.games[key].participants.length === 0){
        DB.deleteGame(key);
      }
    }
    this.shareLobbies();

  }
  @SubscribeMessage("ENTER")
  enterRoom(socket: Socket,data:any){
    if(DB.games.hasOwnProperty(data.gameId)){
      DB.games[data.gameId].join(data.user,socket.id);
      socket.join(data.gameId);
      this.shareLobbies();
      this.shareGame(data.gameId);
      return null;
    }
    this.createRoom(socket,data);
  }

  createRoom(socket: Socket,data:any){
      DB.createGame(data.gameId,new Game(data.user,socket.id))
      this.enterRoom(socket,data);
  }

  @SubscribeMessage("LEAVE")
  leaveRoom(socket:Socket,data:any){
    socket.leave(data.gameId);
    DB.games[data.gameId].leave(socket.id);
    this.shareGame(data.gameId);
    if(DB.games[data.gameId].participants.length === 0){
      DB.deleteGame(data.gameId);
    }
    this.shareLobbies();
  }
  updateData(socket:Socket,data){
    this.server.to(data.gameId).emit("UPDATE_DATA",{game:DB.games[data.gameId]})
  }
  @SubscribeMessage("GET_LOBBIES")
  shareLobbies(){
    this.server.emit("SHARE_LOBBIES",{games:DB.games})
  }
  shareGame(gameId:any){
    this.server.emit("GAME_DATA",{game:DB.games[gameId]})
  }
}