import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./message";
import { Game } from "./Game";


export class GameManager{
    private games: Game[];
    private pendingUser : WebSocket | null;  ///list of pending user waiting to be connected
    private users : WebSocket[];    //list of current active users
    constructor(){
        this.games = [];   //global games array currently going on.
        this.pendingUser = null; 
        this.users = [];
    }
    addUser(socket : WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket : WebSocket){
        this.users =this.users.filter(user => user !== socket);
    }

    private addHandler(socket : WebSocket){
        socket.on("message",(data)=>{
            const messsage = JSON.parse(data.toString());

            if(messsage.type === INIT_GAME){
                if(this.pendingUser){     //if any pending user then start game game with other player who joins
                    const game = new Game(this.pendingUser ,socket);
                    this.games.push(game);
                    this.pendingUser = null; // now new user coming will becoming pending user.
                }
                else{
                    this.pendingUser = socket ; ///waiting for the other player to join
                }
            }
            if(messsage.type === MOVE){  //ongoing game moves 
                const game = this.games.find(game => game.player1 ===socket || game.player2 === socket);
                if(game){
                    game.makeMove(socket , messsage.payload.move); //trying to make move
                }
            }
        })
    }


}