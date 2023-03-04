
import BaseScene from "../game/BaseScene";
import TeleportAnimation from "../animations/TeleportAnimation";
import {ElementDefn} from "../types";

const SCALE_FACTOR = 2;  // always smaller so we draw it large and always shrink - this retains some quality

class Plant extends Element{
    
    //_img:Phaser.GameObjects.Image;

    constructor(data:ElementDefn, scene: BaseScene) {
        super();
        //TODO - perhaps  this._img = scene.lookupById(...)?
        /*
        this._img = scene.getFactory().image(this.getProp("x"), this.getProp("y"), "__DEFAULT");
        this._img.angle = this.getProp("angle");
        this._img.scaleX = this.getProp("scaleX") / SCALE_FACTOR;
        this._img.scaleY = this.getProp("scaleY") / SCALE_FACTOR;
        this._teleportX = this._teleportX.bind(this);
        this._teleportY = this._teleportY.bind(this);
        this._addTextureLoader();
        this.listenToPropChange(["angle", "scaleX", "scaleY"])
            .listenToPropChange(["x"], this._teleportX)
            .listenToPropChange(["y"], this._teleportY);

        this._textureLoader.getPreloader().then((key:string)=>{
            // we have to defer because that's how base64 textures work in Phaser.
            _.defer(()=>{
                if(this._img && this._img.texture && this._img.texture.key === "__DEFAULT"){
                    // make sure that it hasn't already loaded a 'proper' texture!
                    this._img.setTexture(key);
                }
            });
        });
        this._redraw();
        this._onCreated(); */
    }
    _teleportX(newVal:number){
        const animation = new TeleportAnimation();
        //animation.play(this.scene, this, newVal, this.getProp("y"));
    }
    _teleportY(newVal:number){
        const animation = new TeleportAnimation();
        //animation.play(this.scene, this, this.getProp("x"), newVal);
    }
    _getTextureLoader(){
        //return new ImageTextureLoader(this.scene, this);
    }
    getGameObject(){
        //return this._img;
    }
    _redraw(){
        /* this._textureLoader.getData().then((data:any)=>{
            const newDescription = data.description;
            if(this._description === newDescription){
                // do nothing
            }
            else{
                this._description = newDescription;
                this._textureLoader.off("loaded").on("loaded", (key:string)=>{
                    const update = ()=>{
                        this._img.setTexture(key);
                        this._boundsChanged();
                        this._textureChanged();
                    };
                    if(data.isBase64Image){
                        _.defer(update);
                    }
                    else{
                        update();
                    }

                });
                this._textureLoader.load();
            }
        }); */
    }
    remove() {
        super.remove();
        //this._img.destroy();
    }
    grow(i:number){
        //this.trigger(GROW, this, i);
    }
    explode(){
        //new Animation().tween(this.scene, this.getGameObject(), {x:0, y:0});
    }
}

export default Plant;
