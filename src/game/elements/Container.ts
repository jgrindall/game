
import BaseScene from "../game/BaseScene";
import TeleportAnimation from "../animations/TeleportAnimation";
import Phaser from "phaser";
import {Highlightable} from "../plugins/HighlightPlugin";
import {ElementDefn, CoordinateMapping} from "../types";

class Container extends Element{
    //_container:Phaser.GameObjects.Container;
    _img:Phaser.GameObjects.Image;
    _label:Phaser.GameObjects.Text;
    _light:Phaser.GameObjects.PointLight;
    //_coordinates: CoordinateMapping;

    constructor(data:ElementDefn, scene: BaseScene) {
        super();
        //this._coordinates = data.props.coordinates;

        this._img = scene.getFactory().image(0, 0, "__DEFAULT");
        this._label = scene.getFactory().text(0, 0, "3");

        this._light = scene.getFactory().pointlight(0, 0, 0xee3333, 50, 0.1);

        /* this._container = scene.getFactory().container(this.pythonToWorldCoordinate(this.getProp("x"), "x"), this.pythonToWorldCoordinate(this.getProp("y"), "y"), [
            this._light,
            this._img,
            this._label
        ]);
 */
    

        this._teleportX = this._teleportX.bind(this);
        this._teleportY = this._teleportY.bind(this);
        this._updateLight = this._updateLight.bind(this);
        this._updateValue = this._updateValue.bind(this);

       /*  this.listenToPropChange(["angle", "scaleX", "scaleY"])
            .listenToPropChange(["x"], this._teleportX)
            .listenToPropChange(["y"], this._teleportY)
            .listenToPropChange(["on"], this._updateLight)
            .listenToPropChange(["value"], this._updateValue);
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

    /**
     * eg. block.x = 6 -> phaser game object.x = 1780
     * @param val
     * @param dir
     */
    pythonToWorldCoordinate(val:number, dir:"x" | "y"):number{
        //const offset = dir === "x" ? this._coordinates.offsetX : this._coordinates.offsetY;
        //return (offset + val) * this._coordinates.gridSize;
        return 0
    }
    _getTextureLoader(){
        //return new ImageTextureLoader(this.scene, this);
    }
    getHighlightable(): Highlightable{
        return this._img;
    }
    setHighlight(show:boolean){
        /* if(show){
            this.scene.highlightPlugin.showHighlight(this.getHighlightable(), 50, 50);
        }
        else{
            this.scene.highlightPlugin.hideHighlight(this.getHighlightable());
        } */
    }
    _updateValue(val:number){
        this._label.setText("" + val);
    }
    _updateLight(val:boolean){
        if(val){
            this._light.color.setTo(250, 50, 50);
        }
        else{
            this._light.color.setTo(20, 20, 20);
        }
    }
    _teleportX(newVal:number){
        this.setHighlight(true);
        setTimeout(()=>{
            this.setHighlight(false);
        }, 10000);
        const animation = new TeleportAnimation();
        //animation.play(this.scene, this, this.pythonToWorldCoordinate(newVal, "x"), this.pythonToWorldCoordinate(this.getProp("y"), "y"));
    }
    _teleportY(newVal:number){
        const animation = new TeleportAnimation();
        //animation.play(this.scene, this, this.pythonToWorldCoordinate(this.getProp("x"), "x"), this.pythonToWorldCoordinate(newVal, "y"));
    }
    getGameObject(){
        //return this._container;
    }
    _redraw(){
        
    }
    remove() {
        super.remove();
        this._img.destroy();
        //this._container.destroy();
    }
}
export default Container;
