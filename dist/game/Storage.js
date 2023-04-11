"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
class Storage {
    constructor() {
        this.games = {};
    }
    deleteGame(id) {
        delete this.games[id];
    }
    createGame(id, game) {
        this.games[id] = game;
    }
}
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map