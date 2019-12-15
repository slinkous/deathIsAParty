let grave = document.querySelector("#grave")

export default class Grave{
  constructor(x, y){
    this.x = x,
    this.y = y,
    this.visited = false;
  }
  draw(ctx){
    ctx.drawImage(grave, this.x, this.y, 32, 32)
  }
  collision(object){
    if(object.x + 32 < this.x) return false;
    if(object.x > this.x + 32) return false;
    if(object.y + 32 < this.y) return false;
    if(object.y > this.y + 32) return false;
    return true;
  }
  visit(){

    if(this.visited) return;
    this.visited = true;
    Grave.addVisit();
  }
  static addVisit(){
    if(!this.visited){
      this.visited = 0;
    }
    this.visited += 1;
  }
  static countVisits(){
    return this.visited;
  }
  static resetVisits(){
    this.visited = 0;
  }
}
