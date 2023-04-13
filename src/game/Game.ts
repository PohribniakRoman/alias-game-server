export class Game {
  participants: Array<any>;
  teams: Array<any>;
  timer: number;
  isGameStarted: boolean;
  game: Record<any, any>;
  move:number;
  checked:Array<any>;
  allWords:Array<any>;
  constructor(teams) {
    this.participants = [];
    this.teams = teams;
    this.isGameStarted = false;
  };

  setTimer(server, roomId) {
    this.timer = 60;
    const intervalID = setInterval(() => {
      if (this.timer === 0) {
        clearInterval(intervalID);
        server.to(roomId).emit("TIMER_END");
      } else {
        this.timer-=0.5;
      }
    }, 1000)
  }
  getTimer() {
    return this.timer;
  }
  updateGame(socket, participant?) {
    if (this.isGameStarted) {
      for (let key in this.game) {
        this.game[key].participants = this.game[key].participants.map(user => {
          if (participant) {
            if (user.id === participant.id) {
              !user.sockets.includes(socket) && user.sockets.push(socket)
            }
          } else {
            user.sockets.includes(socket) && (user.sockets = user.sockets.filter(storedSocket => storedSocket !== socket));
          }
          return user;
        })
      }
    }
  }
  endMove(server){
    this.game[this.currentTeam()].point+=this.checked.filter(word =>word.guessed === true).length;
    this.allWords = [{}];
    this.checked = [{}];
    this.game[this.currentTeam()].participants = this.game[this.currentTeam()].participants.map(user=>{user.myMove = !user.myMove;return user}) 
      this.game[this.currentTeam()].participants.forEach(user=>{
      user.sockets.forEach(socket=>{
          server.to(socket).emit("SEND_END_MOVE")
      })
    })
    this.move+=1;
    this.getMove(server)
  }
  getMove(server){
    this.game[this.currentTeam()].participants.forEach(user=>{
      user.sockets.forEach(socket=>{
          server.to(socket).emit("SEND_MOVE")
      })
    })
  }
  startMove(server, roomId){
    this.setTimer(server, roomId)
    this.game[this.currentTeam()].participants.forEach(user=>{
      user.sockets.forEach(socket=>{
        if(user.myMove){
          server.to(socket).emit("START_ASK")
        }else{
          server.to(socket).emit("START_GUESS")
        }
      })
    })
  }
  
  isPlayerAsking(socket){
    const player = this.game[this.currentTeam()].participants.filter(user=>user.myMove === true)[0];
    if(player.sockets.includes(socket)){
      return true;
    }
    return false;
  }
  currentTeam(){
    return this.teams[(this.move-1) % this.teams.length].name; 
  }
  loadAll(all){
    this.allWords = all;
  }

  loadChecked(checked){
    this.checked = checked;
  }
  
  startGame() {
    this.move = 1;
    this.isGameStarted = true;
    this.game = {};
    this.participants.forEach(user => {
      if (this.game.hasOwnProperty(user.team)) {
        this.game[user.team].participants.push({ ...user.participant, sockets: user.sockets, myMove: false })
      } else {
        this.game[user.team] = { participants: [{ ...user.participant, sockets: user.sockets, myMove: true }],point:0}
      }
    })
  }
  
  join(participant, socket) {
    let isUserAlredyIn = false;
    this.participants?.forEach(user => {
      if (user.participant.username === participant.username) {
        user.sockets.push(socket);
        isUserAlredyIn = true;
      }
    })
    if (!isUserAlredyIn) {
      this.participants.push({ participant, sockets: [socket] })
    }
    this.updateGame(socket, participant);
  }

  joinTeam(socket, team) {
    this.participants.forEach(participant => {
      if (participant.sockets.includes(socket)) {
        participant.team = team;
      }
    })
  }

  leaveTeam(socket) {
    this.participants.forEach(participant => {
      if (participant.sockets.includes(socket)) {
        if (participant.team) delete participant.team;
      }
    })
  }
  isFull() {
    if (this.participants.length >= this.teams.length * 2) {
      return true
    }
    return false
  }
  leave(socket) {
    this.participants.forEach(user => {
      user.sockets = user.sockets.filter(connectedSocket => connectedSocket !== socket);
      if (user.sockets.length === 0) {
        this.participants = this.participants.filter(connectedUser => connectedUser.participant.username !== user.participant.username);
      }
    })
    this.updateGame(socket);
  }
}