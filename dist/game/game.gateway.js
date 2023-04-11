"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const Game_1 = require("./Game");
const Storage_1 = require("./Storage");
const DB = new Storage_1.Storage();
let GameGateway = class GameGateway {
    handleDisconnect(socket) {
        for (let key in DB.games) {
            this.leaveRoom(socket, { gameId: key });
            if (DB.games.hasOwnProperty(key)) {
                DB.games[key].leave(socket.id);
                if (DB.games[key].participants.length === 0) {
                    DB.deleteGame(key);
                    this.updateData(key);
                }
            }
        }
        this.shareLobbies();
    }
    enterRoom(socket, data) {
        if (DB.games.hasOwnProperty(data.gameId)) {
            if (!DB.games[data.gameId].isFull()) {
                DB.games[data.gameId].join(data.user, socket.id);
                socket.join(data.gameId);
                this.shareLobbies();
                this.updateData(data.gameId);
            }
        }
    }
    joinTeam(socket, { gameId, team }) {
        if (DB.games.hasOwnProperty(gameId)) {
            DB.games[gameId].leaveTeam(socket.id);
            DB.games[gameId].joinTeam(socket.id, team);
            this.updateData(gameId);
        }
    }
    createRoom(socket, { gameId, teams }) {
        DB.createGame(gameId, new Game_1.Game(teams));
    }
    isStarted(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            this.server.to(gameId).emit("GAME_STATE", { isStarted: DB.games[gameId].isGameStarted });
        }
    }
    startGame(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            DB.games[gameId].startGame(this.server, gameId);
        }
        this.isStarted(socket, { gameId });
    }
    addCheck(socket, { gameId, words }) {
        if (DB.games.hasOwnProperty(gameId)) {
            DB.games[gameId].loadChecked(words);
            this.server.to(gameId).emit("SEND_CHECKED", { words });
        }
    }
    getMove(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            DB.games[gameId].getMove(this.server);
        }
    }
    sendWords(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            this.server.to(gameId).emit("SEND_CHECKED", { words: DB.games[gameId].checked });
        }
    }
    sendAllWords(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            this.server.to(gameId).emit("SEND_ALL", { words: DB.games[gameId].allWords });
        }
    }
    addAll(socket, { gameId, words }) {
        if (DB.games.hasOwnProperty(gameId)) {
            DB.games[gameId].loadAll(words);
            this.server.to(gameId).emit("SEND_ALL", { words });
        }
    }
    endMove(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            DB.games[gameId].endMove(this.server);
            this.updateData(gameId);
        }
    }
    isAsking(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            if (DB.games[gameId].isPlayerAsking(socket.id)) {
                this.server.to(socket.id).emit("START_ASK");
            }
        }
    }
    leaveRoom(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            socket.leave(gameId);
            DB.games[gameId].leave(socket.id);
            this.updateData(gameId);
            if (DB.games[gameId].participants.length === 0) {
                DB.deleteGame(gameId);
            }
            this.shareLobbies();
        }
    }
    updateData(gameId) {
        this.server.to(gameId).emit("UPDATE_DATA", { game: DB.games[gameId] });
    }
    getTimer(socket, data) {
        if (DB.games.hasOwnProperty(data.gameId)) {
            this.server.to(data.gameId).emit("TIMER_DATA", { time: DB.games[data.gameId].timer });
        }
    }
    startTimer(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            DB.games[gameId].setTimer(this.server, gameId);
            DB.games[gameId].startMove(this.server, gameId);
            this.server.to(gameId).emit("TIMER_DATA", { time: DB.games[gameId].timer });
        }
    }
    endTimer(socket, { gameId }) {
        if (DB.games.hasOwnProperty(gameId)) {
            DB.games[gameId].endMove(this.server);
            console.log("MOVE ENDED");
            this.server.to(gameId).emit("TIMER_END");
        }
    }
    shareLobbies() {
        this.server.emit("SHARE_LOBBIES", { games: DB.games });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("ENTER"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "enterRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("JOIN_TEAM"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "joinTeam", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("CREATE_GAME"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "createRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("IS_GAME_STARTED"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "isStarted", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("START_GAME"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "startGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("ADD_CHECKED"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "addCheck", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("GET_MOVE"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("GET_WORDS"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "sendWords", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("GET_ALL"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "sendAllWords", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("ADD_ALL"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "addAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("MOVE_END"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "endMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("IS_ASKING"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "isAsking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("LEAVE"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "leaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("GET_TIMER"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "getTimer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("START_TIMER"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "startTimer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("END_TIMER"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "endTimer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("GET_LOBBIES"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "shareLobbies", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)()
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map