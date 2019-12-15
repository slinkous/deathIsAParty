import InputHandler from "/js/input.js";
import Player from "/js/player.js";
import Sprite from "/js/sprite.js"
import TileMap from "/js/tile.js"
import Grave from "/js/grave.js"

export const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  WIN: 4,
  INTRO:5,
}

export class Game {
  constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.INTRO;
    this.music = document.querySelector("#gameMusic");
    this.background = document.querySelector("#background")
    this.gravestone = document.querySelector('#gravestonebg')
    this.music.loop = true;
    this. input = new InputHandler(this);
    this.player = new Player(this, 256, 256, 32, 32, 3)
    let ghostImg = document.querySelector("#ghost")
    this.player.createSprite(ghostImg, 2, 4, 32, 32)


    this.gameTime = 0;
    this.skyProgress = 0;
    this.timeSinceProgress = 0
    this.totalGraves = 10
    this.graves = []
    while(this.graves.length < this.totalGraves){
      let x = Math.floor(Math.random()*16)*32
      let y = 256 + Math.floor(Math.random()*8)*32
      this.graves.push(new Grave(x, y));
    }
    this.gravesVisited = 0
  }

  start(){
    if(this.gamestate !== GAMESTATE.MENU) return;
    this.gameObjects = [this.player];
    this.gamestate = GAMESTATE.RUNNING;

    this.music.play()
  }
  update(deltaTime){
    if(
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER
    ) return;
    this.gameTime += deltaTime;
    this.timeSinceProgress += deltaTime;
    this.player.move(this.input.inputStates)
    if(this.gameTime > 60000) this.end()
    if(this.timeSinceProgress > 3000){
      this.timeSinceProgress = 0;
      this.skyProgress += 1;
    }
    for(var i=0; i<this.graves.length; i++){
      if(this.input.inputStates.space && this.graves[i].collision(this.player)){
        this.graves[i].visit()
      }
    }
    if(Grave.countVisits() == this.graves.length){
      this.win();
    }
  }
  draw(ctx, colorScheme, font){
    let sunset = [2,1,0,0,1,2]
    ctx.save();
    let gradient = ctx.createLinearGradient(0, 0, 0, this.gameHeight/2)
    gradient.addColorStop(0, colorScheme[sunset[(this.skyProgress + 1) % sunset.length]])
    gradient.addColorStop(1, colorScheme[sunset[this.skyProgress % sunset.length]])

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    ctx.fillStyle = colorScheme[7];
    ctx.font = "32px " + font;
    ctx.textAlign = "left";
    ctx.fillText("Graves visited: "+ Grave.countVisits(), 0, 32)
    ctx.drawImage(this.background, 0,0, this.gameWidth, this.gameHeight)
    for(var i=0; i<this.graves.length; i++){
      this.graves[i].draw(ctx);
    }
    this.player.draw(ctx)
    ctx.restore();

    if(this.gamestate === GAMESTATE.INTRO){
      ctx.drawImage(this.gravestone, 0,0, this.gameWidth, this.gameHeight)

      ctx.font = "36 " + font;
      ctx.fillStyle = colorScheme[0];
      ctx.textAlign = "center";
      ctx.fillText("Death is not the end...", this.gameWidth/2, this.gameHeight/2);
    }

    if(this.gamestate === GAMESTATE.PAUSED){
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "3em " + font;
      ctx.fillStyle = colorScheme[4];
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth/2, this.gameHeight/2);
    }
    if(this.gamestate === GAMESTATE.MENU){
      let gradient = ctx.createLinearGradient(0, 0, 0, this.gameHeight)
      gradient.addColorStop(0, colorScheme[0])
      gradient.addColorStop(0.2, colorScheme[1])
      gradient.addColorStop(0.4, colorScheme[3])
      gradient.addColorStop(0.5, colorScheme[4])
      gradient.addColorStop(1, colorScheme[5])

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

      ctx.font = "3em " + font;
      ctx.fillStyle = colorScheme[6];
      ctx.textAlign = "center";
      ctx.fillText("Menu", this.gameWidth/2, this.gameHeight/2);
    }
    if(this.gamestate === GAMESTATE.GAMEOVER){
      ctx.fillStyle = colorScheme[6];
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

      ctx.font = "32px " + font;
      ctx.fillStyle = colorScheme[4];
      ctx.textAlign = "center";
      ctx.fillText("You ran out of time. . .", this.gameWidth/2, this.gameHeight/2);
    }
    if(this.gamestate === GAMESTATE.WIN){
      ctx.fillStyle = colorScheme[1];
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

      ctx.font = "32px " + font;
      ctx.fillStyle = colorScheme[5];
      ctx.textAlign = "center";
      ctx.fillText("You woke up" , this.gameWidth/2, this.gameHeight/2);
      ctx.fillText("all " + this.graves.length +" ghosts!" , this.gameWidth/2, this.gameHeight/2 + 32);
    }
  }
  togglePause(){
    if(this.gamestate == GAMESTATE.PAUSED){
      this.gamestate = GAMESTATE.RUNNING;
      this.music.play()
    } else {
      this.gamestate = GAMESTATE.PAUSED;
      this.music.pause()
    }
  }
  end(){
    if(this.gamestate == GAMESTATE.RUNNING){
      this.gamestate = GAMESTATE.GAMEOVER
      this.music.pause()
    }
  }
  win(){
    if(this.gamestate == GAMESTATE.RUNNING){
      this.gamestate = GAMESTATE.WIN
      this.music.pause()
    }
  }
  restart(){
    this.gameTime = 0;
    this.skyProgress = 0;
    this.timeSinceProgress = 0
    this.totalGraves += 5;
    this.graves = []
    while(this.graves.length < this.totalGraves){
      let x = Math.floor(Math.random()*16)*32
      let y = 256 + Math.floor(Math.random()*8)*32
      this.graves.push(new Grave(x, y));
    }
    Grave.resetVisits();
    this.gamestate = GAMESTATE.MENU;
  }
}
