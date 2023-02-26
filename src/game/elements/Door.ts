
import Element from "../../../pip/elements/Element";
import ImageTextureLoader from "../../../pip/textures/ImageTextureLoader";
import BaseScene from "../game/BaseScene";
import {ElementDefn} from "../types";

const SCALE_FACTOR = 2;  // always smaller so we draw it large and always shrink - this retains some quality

class Door extends Element{
    _img:Phaser.GameObjects.Image;

    constructor(data:ElementDefn, scene: BaseScene) {
        super(data, scene);
        this._img = scene.getFactory().image(this.getProp("x"), this.getProp("y"), "__DEFAULT");
        this._img.scaleX = this.getProp("scaleX") / SCALE_FACTOR;
        this._img.scaleY = this.getProp("scaleY") / SCALE_FACTOR;
        this._addTextureLoader();

        this._textureLoader.getPreloader().then((key:string)=>{
            // we have to defer because that's how base64 textures work in Phaser.
            _.defer(()=>{
                if(this._img && this._img.texture && this._img.texture.key === "__DEFAULT"){
                    // make sure that it hasn't already loaded a 'proper' texture!
                    //this._img.setTexture(key);
                }
            });
        });
        this._redraw();
        this._onCreated();
    }
    _getTextureLoader(){
        return new ImageTextureLoader(this.scene, this);
    }
    getGameObject(){
        return this._img;
    }
    _redraw(){
        this._textureLoader.getData().then((data:any)=>{
            console.log(data);
            const newDescription = data.description;
            if(this._description === newDescription){
                // do nothing
            }
            else{
                this._description = newDescription;
                this._textureLoader.off("loaded").on("loaded", (key:string)=>{

                    console.log("load", key);

                    const update = ()=>{

                        console.log("set texture", key);

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
                console.log("load!");
                this._textureLoader.load();
            }
        });
    }
    remove() {
        super.remove();
        this._img.destroy();
        this._img = null;
    }
}

Door.publicPropertyNames = Element.publicPropertyNames;
Door.propertyNames = [...Door.publicPropertyNames, "image"];
Door.methodNames = [...Element.methodNames];
Door.inspectablePropertyNames = [...Element.inspectablePropertyNames, "image"];

export default Door;
