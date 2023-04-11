import { OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket } from 'socket.io';
export declare class GameGateway implements OnGatewayDisconnect {
    server: any;
    handleDisconnect(socket: Socket): void;
    enterRoom(socket: Socket, data: any): void;
    joinTeam(socket: Socket, { gameId, team }: any): void;
    createRoom(socket: Socket, { gameId, teams }: any): void;
    isStarted(socket: Socket, { gameId }: Record<string, string>): void;
    startGame(socket: Socket, { gameId }: Record<string, string>): void;
    addCheck(socket: Socket, { gameId, words }: {
        gameId: any;
        words: any;
    }): void;
    getMove(socket: Socket, { gameId }: {
        gameId: any;
    }): void;
    sendWords(socket: Socket, { gameId }: {
        gameId: any;
    }): void;
    sendAllWords(socket: Socket, { gameId }: {
        gameId: any;
    }): void;
    addAll(socket: Socket, { gameId, words }: {
        gameId: any;
        words: any;
    }): void;
    endMove(socket: Socket, { gameId }: {
        gameId: any;
    }): void;
    isAsking(socket: Socket, { gameId }: {
        gameId: any;
    }): void;
    leaveRoom(socket: Socket, { gameId }: any): void;
    updateData(gameId: any): void;
    getTimer(socket: Socket, data: any): void;
    startTimer(socket: Socket, { gameId }: {
        gameId: any;
    }): void;
    endTimer(socket: Socket, { gameId }: {
        gameId: any;
    }): void;
    shareLobbies(): void;
}
