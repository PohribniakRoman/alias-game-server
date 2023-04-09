export class Storage{
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