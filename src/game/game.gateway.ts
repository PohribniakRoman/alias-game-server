import { SubscribeMessage, WebSocketGateway,WebSocketServer, OnGatewayDisconnect} from "@nestjs/websockets";
import { Socket } from 'socket.io';

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
  teams:Array<any>;
  isGameStarted:boolean;
  constructor(teams){
    this.participants =[];
    this.teams = teams;
    this.isGameStarted = false;
  };

   join(participant,socket){
      let isUserAlredyIn = false;
      this.participants?.forEach(user=>{
        if(user.participant.username === participant.username){
          user.sockets.push(socket);
          isUserAlredyIn = true;
        }
      })
     if(!isUserAlredyIn){
        this.participants.push({ participant, sockets:[socket]})
     }
  }

  joinTeam(socket,team){
     this.participants.forEach(participant=>{
       if(participant.sockets.includes(socket)){
         participant.team = team;
       }
     })
  }

  leaveTeam(socket){
    this.participants.forEach(participant=>{
      if(participant.sockets.includes(socket)){
        if(participant.team) delete participant.team;
      }
    })
  }
  isFull(){
     if(this.participants.length >= this.teams.length*2){
      return true
     }
     return false
  }
  leave(socket){
    this.participants.forEach(user=>{
      user.sockets = user.sockets.filter(connectedSocket=>connectedSocket !== socket);
      if (user.sockets.length === 0){
        this.participants = this.participants.filter(connectedUser=>connectedUser.participant.username !== user.participant.username);
      }
    })
  }
}

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server;
  handleDisconnect(socket:Socket){
    for(let key in DB.games){
      this.leaveRoom(socket,{gameId:key})
      DB.games[key].leave(socket.id)
      if(DB.games[key].participants.length === 0){
        DB.deleteGame(key);
        this.updateData(key);
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
      DB.games[data.gameId].isGameStarted = true;
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
  
  @SubscribeMessage("GET_LOBBIES")
  shareLobbies(){
    this.server.emit("SHARE_LOBBIES",{games:DB.games})
  }

}