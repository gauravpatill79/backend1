"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const message_1 = require("./message");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = []; //global games array currently going on.
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const messsage = JSON.parse(data.toString());
            if (messsage.type === message_1.INIT_GAME) {
                if (this.pendingUser) { //if any pending user then start game game with other player who joins
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null; // now new user coming will becoming pending user.
                }
                else {
                    this.pendingUser = socket; ///waiting for the other player to join
                }
            }
            if (messsage.type === message_1.MOVE) { //ongoing game moves 
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, messsage.payload.move); //trying to make move
                }
            }
        });
    }
}
exports.GameManager = GameManager;
