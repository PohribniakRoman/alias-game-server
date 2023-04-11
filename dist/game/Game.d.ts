export declare class Game {
    participants: Array<any>;
    teams: Array<any>;
    timer: number;
    isGameStarted: boolean;
    game: Record<any, any>;
    move: number;
    checked: Array<any>;
    allWords: Array<any>;
    constructor(teams: any);
    setTimer(server: any, roomId: any): void;
    getTimer(): number;
    updateGame(socket: any, participant?: any): void;
    endMove(server: any): void;
    getMove(server: any): void;
    startMove(server: any, roomId: any): void;
    isPlayerAsking(socket: any): boolean;
    currentTeam(): any;
    loadAll(all: any): void;
    loadChecked(checked: any): void;
    startGame(): void;
    join(participant: any, socket: any): void;
    joinTeam(socket: any, team: any): void;
    leaveTeam(socket: any): void;
    isFull(): boolean;
    leave(socket: any): void;
}
