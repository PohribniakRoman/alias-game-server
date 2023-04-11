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
  joinTeam(socket: Socket,{gameId,team}:any){
    if(DB.games.hasOwnProperty(gameId)){
      DB.games[gameId].leaveTeam(socket.id);
      DB.games[gameId].joinTeam(socket.id,team);
      this.updateData(gameId);
    }
  }
  
  @SubscribeMessage("CREATE_GAME")
  createRoom(socket: Socket,{gameId,teams}:any){
      DB.createGame(gameId,new Game(teams))
  }

  @SubscribeMessage("IS_GAME_STARTED")
  isStarted(socket:Socket,{gameId}:Record<string,string>){
    if(DB.games.hasOwnProperty(gameId)){
      this.server.to(gameId).emit("GAME_STATE",{isStarted:DB.games[gameId].isGameStarted})
    }
  }
  @SubscribeMessage("START_GAME")
  startGame(socket:Socket,{gameId}:Record<string,string>){
    if(DB.games.hasOwnProperty(gameId)){
      DB.games[gameId].startGame(this.server,gameId);
      }
    this.isStarted(socket,{gameId})
  }

  @SubscribeMessage("ADD_CHECKED")
  addCheck(socket:Socket,{gameId,words}){
    if(DB.games.hasOwnProperty(gameId)) {
      DB.games[gameId].loadChecked(words);
      this.server.to(gameId).emit("SEND_CHECKED",{words})
    }
  }
  @SubscribeMessage("GET_MOVE")
  getMove(socket:Socket,{gameId}){
    if(DB.games.hasOwnProperty(gameId)) {
      DB.games[gameId].getMove(this.server);
    }
  }

  @SubscribeMessage("GET_WORDS")
  sendWords(socket:Socket,{gameId}){
    if(DB.games.hasOwnProperty(gameId)) {
      this.server.to(gameId).emit("SEND_CHECKED",{words:DB.games[gameId].checked})
    }
  }
  @SubscribeMessage("GET_ALL")
  sendAllWords(socket:Socket,{gameId}){
    if(DB.games.hasOwnProperty(gameId)) {
      this.server.to(gameId).emit("SEND_ALL",{words:DB.games[gameId].allWords})
    }
  }

  @SubscribeMessage("ADD_ALL")
  addAll(socket:Socket,{gameId,words}){
    if(DB.games.hasOwnProperty(gameId)) {
      DB.games[gameId].loadAll(words);
      this.server.to(gameId).emit("SEND_ALL",{words})
    }
  }
  @SubscribeMessage("MOVE_END")
  endMove(socket:Socket,{gameId}){
    if(DB.games.hasOwnProperty(gameId)) {
      DB.games[gameId].endMove(this.server);
      this.updateData(gameId);
    }
  }

  @SubscribeMessage("IS_ASKING")
  isAsking(socket:Socket,{gameId}){
    if(DB.games.hasOwnProperty(gameId)) {
      if(DB.games[gameId].isPlayerAsking(socket.id)){
        this.server.to(socket.id).emit("START_ASK");
      }      
    }
  }

  @SubscribeMessage("LEAVE")
  leaveRoom(socket:Socket,{gameId}:any){
    if(DB.games.hasOwnProperty(gameId)) {
      socket.leave(gameId);
      DB.games[gameId].leave(socket.id);
      this.updateData(gameId);
      if (DB.games[gameId].participants.length === 0) {
        DB.deleteGame(gameId);
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
  startTimer(socket:Socket,{gameId}){
    if(DB.games.hasOwnProperty(gameId)) {
      DB.games[gameId].setTimer(this.server,gameId);
      DB.games[gameId].startMove(this.server,gameId);
      this.server.to(gameId).emit("TIMER_DATA",{time:DB.games[gameId].timer});
    }
  }

  @SubscribeMessage("END_TIMER")
  endTimer(socket:Socket,{gameId}){
    if(DB.games.hasOwnProperty(gameId)) {
      DB.games[gameId].endMove(this.server);
      console.log("MOVE ENDED");
      this.server.to(gameId).emit("TIMER_END");
    }
  }

  @SubscribeMessage("GET_LOBBIES")
  shareLobbies(){
    this.server.emit("SHARE_LOBBIES",{games:DB.games})
  }
}