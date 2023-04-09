import { SubscribeMessage, WebSocketGateway,WebSocketServer, OnGatewayDisconnect} from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Game } from "./Game";
import { Storage } from "./Storage";

const DB = new Storage();

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server;
  handleDisconnect(socket:Socket){
    for(let key in DB.games){
      this.leaveRoom(socket,{gameId:key})
      if(DB.games.hasOwnProperty(key)){
        DB.games[key].leave(socket.id)
        if(DB.games[key].participants.length === 0){
          DB.deleteGame(key);
          this.updateData(key);
        }
      }
    }
    this.shareLobbies();
  }
  @SubscribeMessage("ENTER")
  enterRoom(socket: Socket,data:any){
    if(DB.games.hasOwnProperty(data.gameId)){
      if(!DB.games[data.gameId].isFull()){
      DB.games[data.gameId].join(data.user,socket.id);
      socket.join(data.gameId);
      this.shareLobbies();
      this.updateData(data.gameId);
      }
    }
  }

  @SubscribeMessage("JOIN_TEAM")
  joinTeam(socket: Socket,data:any){
    if(DB.games.hasOwnProperty(data.gameId)){
      DB.games[data.gameId].leaveTeam(socket.id);
      DB.games[data.gameId].joinTeam(socket.id,data.team);
      this.updateData(data.gameId);
    }
  }
  
  @SubscribeMessage("CREATE_GAME")
  createRoom(socket: Socket,data:any){
      DB.createGame(data.gameId,new Game(data.teams))
  }

  @SubscribeMessage("IS_GAME_STARTED")
  isStarted(socket:Socket,data:Record<string,string>){
    if(DB.games.hasOwnProperty(data.gameId)){
      this.server.to(data.gameId).emit("GAME_STATE",{isStarted:DB.games[data.gameId].isGameStarted})
    }
  }
  @SubscribeMessage("START_GAME")
  startGame(socket:Socket,data:Record<string,string>){
    if(DB.games.hasOwnProperty(data.gameId)){
      DB.games[data.gameId].startGame();
      }
    this.isStarted(socket,data)
  }

  @SubscribeMessage("LEAVE")
  leaveRoom(socket:Socket,data:any){
    if(DB.games.hasOwnProperty(data.gameId)) {
      socket.leave(data.gameId);
      DB.games[data.gameId].leave(socket.id);
      this.updateData(data.gameId);
      if (DB.games[data.gameId].participants.length === 0) {
        DB.deleteGame(data.gameId);
      }
      this.shareLobbies();
    }
  }

  updateData(gameId){
    this.server.to(gameId).emit("UPDATE_DATA",{game:DB.games[gameId]})
  }
  @SubscribeMessage("GET_TIMER")
    getTimer(socket:Socket,data){
    if(DB.games.hasOwnProperty(data.gameId)) {
      this.server.to(data.gameId).emit("TIMER_DATA",{time:DB.games[data.gameId].timer});      
    }
  }
  @SubscribeMessage("START_TIMER")
  startTimer(socket:Socket,data){
    if(DB.games.hasOwnProperty(data.gameId)) {
      DB.games[data.gameId].setTimer(this.server,data.gameId);
      this.server.to(data.gameId).emit("TIMER_DATA",{time:DB.games[data.gameId].timer});
    }
  }

  @SubscribeMessage("GET_LOBBIES")
  shareLobbies(){
    this.server.emit("SHARE_LOBBIES",{games:DB.games})
  }
}