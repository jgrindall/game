import Phaser from "phaser";
import {Info, PhaserEventData} from "../../types";
import {useDialogStore} from "../../store/DialogModule";

class ClickManager{

    private _scene: Phaser.Scene;
    constructor(scene: Phaser.Scene){
        this._scene = scene;
    }
    /**
     * Stop listening for hover on this element - this happens when the element is destroyed so it is safe to remove all listeners
     * @param gameObj
     */
    public remove(gameObj:any){
        gameObj
            .off('pointerdown')
            .off('pointerup');
    }

    public updateBounds(gameObj:any) {
        //updateInteractiveBounds(gameObj, this._scene.scale.displayScale);
    }

    public show(info:Info){
        useDialogStore().setInfo(info);
    }

    /**
     *
     * @param element
     */
    public addElement(element: Element){
        const gameObj = null;
        const info:Info = {
            position: {
                x:0,
                y:0
            },
            description:[""],
            type:""
        };
        this.add(gameObj, info);
    }

    /**
     * Listen for click on this element
     * @param {GameObject} gameObj
     * @param info
     */
    public add(gameObj:any, info:Info){
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

