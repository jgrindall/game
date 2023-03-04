
import BaseScene from "../game/BaseScene";
import {ElementDefn} from "../types";

const SCALE_FACTOR = 2;  // always smaller so we draw it large and always shrink - this retains some quality

class Door extends Element{
    //_img:Phaser.GameObjects.Image;

    constructor(data:ElementDefn, scene: BaseScene) {
        super();
        //this._img = scene.getFactory().image(this.getProp("x"), this.getProp("y"), "__DEFAULT");
        //this._img.scaleX = this.getProp("scaleX") / SCALE_FACTOR;
        //this._img.scaleY = this.getProp("scaleY") / SCALE_FACTOR;
        //this._addTextureLoader();

    }
    _getTextureLoader(){
        //return new ImageTextureLoader(this.scene, this);
    }
    getGameObject(){
        //return this._img;
    }
    _redraw(){
       
    }
    remove() {
        super.remove();
        //this._img.destroy();
        //this._img = undefined;
    }
}

/* Door.publicPropertyNames = Element.publicPropertyNames;
Door.propertyNames = [...Door.publicPropertyNames, "image"];
Door.methodNames = [...Element.methodNames];
Door.inspectablePropertyNames = [...Element.inspectablePropertyNames, "image"]; */

export default Door;
