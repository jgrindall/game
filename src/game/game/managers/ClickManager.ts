
import Phaser from "phaser";
import {Info, PhaserEventData} from "../../types";
import {GameObject} from "../../../../pip/elements/types";
import Element from "../../../../pip/elements/Element";


import {updateInteractiveBounds} from "../../utils/Utils";
import dialogModule from "../../store/DialogModule";
class ClickManager{

    private _scene: Phaser.Scene;
    constructor(scene: Phaser.Scene){
        this._scene = scene;
    }
    /**
     * Stop listening for hover on this element - this happens when the element is destroyed so it is safe to remove all listeners
     * @param gameObj
     */
    public remove(gameObj:GameObject){
        gameObj
            .off('pointerdown')
            .off('pointerup');
    }

    public updateBounds(gameObj:GameObject) {
        updateInteractiveBounds(gameObj, this._scene.scale.displayScale);
    }

    public show(info:Info){
        dialogModule.setInfo(info);
    }

    /**
     *
     * @param element
     */
    public addElement(element: Element){
        const gameObj = element.getGameObject();
        const info:Info = {
            position: {
                x:gameObj.x,
                y:gameObj.y
            },
            description:element.getInfo(),
            type:""
        };
        this.add(gameObj, info);
    }

    /**
     * Listen for click on this element
     * @param {GameObject} gameObj
     * @param info
     */
    public add(gameObj:GameObject, info:Info){
        // @ts-ignore - this is valid
        const bounds = gameObj.getBounds();

        const scale = this._scene.scale.displayScale;
        const w = bounds.width / scale.x;
        const h = bounds.height / scale.y;
        gameObj
            .setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', (pointer:Phaser.Input.Pointer , x:number , y:number , event:PhaserEventData)=>{
                event.stopPropagation();
            })
            .on('pointerup', (pointer:Phaser.Input.Pointer , x:number , y:number , event:PhaserEventData)=>{
                event.stopPropagation();
                this.show(info);
            });
        this.updateBounds(gameObj);
    }
}

export default ClickManager;

