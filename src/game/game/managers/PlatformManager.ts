import Phaser from "phaser";

enum Directions {
    UP = "up",
    DOWN = "down"
}

//TODO - only working for one at the moment
let dir = Directions.UP;

type PlatformData  = {
    _top:number,
    _bottom:number,
    _speed:number,
    _direction: Directions
}

class PlatformManager{

    private _scene: Phaser.Scene;
    private _platforms:Element[] = [];
    private _enabled: boolean = true;


    constructor(scene: Phaser.Scene){
        this._scene = scene;
    }

    remove(gameObj:any){

    }

    update(){
        this._platforms.forEach(platform=>{
           /*  const gameObj = platform.getGameObject();
            const data = gameObj.data.getAll() as PlatformData;
            const body:Phaser.Physics.Arcade.Body = (gameObj.body as Phaser.Physics.Arcade.Body);
            if(dir === Directions.UP && gameObj.y < data._top){
                dir = Directions.DOWN;
            }
            else if(dir === Directions.DOWN && gameObj.y > data._bottom){
                dir = Directions.UP;
            }
            body.setVelocityY(this._enabled ? (dir === Directions.UP ? -data._speed : data._speed) : 0); */
        });
    }

    setEnabled(enabled: boolean): this{
        this._enabled = enabled;
        return this;
    }

    add(element:Element){
        /* const gameObj = element.getGameObject();
        const data = gameObj.data.getAll() as PlatformData;
        //TODO - merge this data in??
        const body:Phaser.Physics.Arcade.Body = (gameObj.body as Phaser.Physics.Arcade.Body);
        body.allowGravity = false;
        body.setImmovable(true);
        body.setBounce(0, 0);
        body.setVelocityY(data._direction === Directions.UP ? -data._speed : data._speed);
        body.checkCollision.down = false;
        body.checkCollision.left = false;
        body.checkCollision.right = false;
        body.checkCollision.up = true;
        this._platforms.push(element); */
    }
}

export default PlatformManager;

