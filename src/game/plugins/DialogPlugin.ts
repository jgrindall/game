import Phaser from "phaser";
import TypeWriter from "../components/TypeWriter";
import {Info} from "../types";

class DialogPlugin extends Phaser.Plugins.ScenePlugin {

    private _currentDialog?:TypeWriter = undefined;
    protected scene:Phaser.Scene;

    constructor(scene:Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, "DialogPlugin");
        this.scene = scene;
        if (!scene.sys.settings.isBooted)
            this.scene.sys.events.once("boot", this.boot, this);
    }

    public boot() {
        this.scene!.sys.events.on("shutdown", this.shutdown, this);
        this.scene!.sys.events.once("destroy", this.destroy, this);
    }

    update(time:number, delta:number) {

    }

    shutdown() {
        if(this._currentDialog){
            this._currentDialog.destroy();
            this._currentDialog.off("click");
            this._currentDialog = undefined;
        }
    }

    destroy() {
        this.shutdown();
        if(this.scene){
            if(this.scene.sys){
                this.scene.sys.events.off("update", this.update, this);
                this.scene.sys.events.off("boot", this.boot, this);
            }
            this.scene = null;
        }
    }

    hide(){
        //TODO - reuse it, do not destroy it
        if(this._currentDialog){
            this._currentDialog.destroy();
            this._currentDialog.off("click");
            this._currentDialog = undefined;
        }
    }

    show(info:Info, onComplete?: ()=>void) {
        if(this._currentDialog){
            this.hide();
        }
        this._currentDialog = this.scene.add.typewriter(400, 620, info.description);
        this._currentDialog.addListener("click", ()=>{
            if(this._currentDialog!.isFinished()){
                // all done
                if(onComplete){
                    onComplete();
                }
            }
            else{
                // go to the next part of the info
                this._currentDialog!.update();
            }
        });
    }
}

export default DialogPlugin;


