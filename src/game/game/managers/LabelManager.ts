import Label from "../../components/Label";
import Phaser from "phaser";
import {updateInteractiveBounds} from "../../utils/Utils";
import BaseScene from "../BaseScene";

type LabelInfo = {
    text:string,
    label:Label,
    detected: boolean,
    over:boolean
};

class LabelManager{

    private _scene: BaseScene;
    private labelInfo: LabelInfo[] = [];

    constructor(scene: BaseScene){
        this._scene = scene;
        this.labelInfo = [];
    }

    updateUsing(img:Phaser.GameObjects.Image, player: Phaser.GameObjects.Sprite){
        /*const info: Info = img.getData("info");
        if(info.detect.type === "overlap"){
            const overlap = this._scene.getPhysics().overlap(img, player);
            if(overlap){
                this.setDetected(img, true);
            }
            else{
                this.setDetected(img, false);
            }
        }
        else if(info.detect.type === "distance"){
            const dist = Phaser.Math.Distance.Between(img.x, img.y, player.x, player.y);
            this.setDetected(img, dist <= info.detect.radius);
        }*/
    }
    /**
     * Stop listening for hover on this element - this happens when the element is destroyed, so it is safe to remove all listeners like this
     * @param gameObj
     */
    remove(gameObj:any){
        if(gameObj){
            gameObj
                .off('pointerover')
                .off('pointerout');
        }
        this.labelInfo = _.reject(this.labelInfo, (entry:LabelInfo)=>{
            
        });
    }

    private getForGameObject(gameObj: any):any{
        //return this.labelInfo.find(entry=>entry.gameObj === gameObj);
    }

    setDetected(gameObj:any, isDetected:boolean){
        const entry = this.getForGameObject(gameObj);
        if(entry){
            entry.detected = isDetected;
        }
    }

    setOver(gameObj:any, isOver:boolean){
        const entry = this.getForGameObject(gameObj);
        if(entry){
            entry.over = isOver;
        }
    }

    public updateBounds(gameObj:any){
        updateInteractiveBounds(gameObj, this._scene.scale.displayScale);
    }

    /**
     * Listen for hover on this element
     * @param {any} gameObj
     * @param label
     */
    public add(gameObj:any, label:string){
        // @ts-ignore
        const bounds = gameObj.getBounds();
        const scale = this._scene.scale.displayScale;
        const w = bounds.width/scale.x;
        const h = bounds.height/scale.y;
        const entry = this.getForGameObject(gameObj);
        if(!entry){
            this.labelInfo.push({
                //gameObj: gameObj,
                text:label,
                label:this._scene.add.label(gameObj.x, gameObj.y, label) as Label,
                detected: false,
                over: false
            });
        }

        gameObj
            .setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains)
            .off('pointerover')
            .on('pointerover', () => {
                this.setOver(gameObj, true);
            })
            .off('pointerout')
            .on('pointerout', () => {
                this.setOver(gameObj, false);
            });
        this.updateBounds(gameObj);
    }

    update(){
        this.labelInfo.forEach(entry=>{
            entry.label.visible = true;
            entry.label.setContents(entry.text);
            const textBounds = entry.label.getContainerBounds();
            //entry.label.x = entry.gameObj.x - textBounds.global.width/2;
            //entry.label.y = entry.gameObj.y - (textBounds.global.height + 2*Label.PADDING);
        });
    }
}

export default LabelManager;

