import {GAMESTATE} from "./game.js";

export default class InputHandler {
  constructor(game){
    this.inputStates = {}
    document.addEventListener("keydown", event => {
      event.preventDefault();
      switch(event.keyCode){
        case 37:
          this.inputStates["left"] = true;
          break;
        case 38:
          this.inputStates["up"] = true;
          break;
        case 39:
          this.inputStates["right"] = true;
          break;
        case 40:
          this.inputStates["down"] = true;
          break;
        case 27:
          game.togglePause();
          break;
        case 13:
          if(game.gamestate == GAMESTATE.INTRO){
            game.goToMenu();
          } else if(game.gamestate == GAMESTATE.MENU){
            game.start();
          }else if(game.gamestate == GAMESTATE.GAMEOVER
            || game.gamestate == GAMESTATE.WIN){
            game.restart();
          }
          break;
        case 32:
          this.inputStates["space"] = true;
          break;
      }
      this.inputStates[event.keyCode] = true;
    });
    document.addEventListener("keyup", event => {
      event.preventDefault();
      switch(event.keyCode){
        case 37:
          this.inputStates["left"] = false;
          break;
        case 38:
          this.inputStates["up"] = false;
          break;
        case 39:
          this.inputStates["right"] = false;
          break;
        case 40:
          this.inputStates["down"] = false;
          break;
        case 32:
          this.inputStates["space"] = false;
          break;
      }
    });
  }
};
