import Phaser from "phaser";
import OutlinePipeline from "../pipelines/OutlinePipeline";

export type Highlightable = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

class HighlightPlugin extends Phaser.Plugins.ScenePlugin {

    protected scene:Phaser.Scene;
    private _toUpdate:Highlightable;

    constructor(scene:Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, "HighlightPlugin");
        this.scene = scene;
        if (!scene.sys.settings.isBooted)
            this.scene.sys.events.once("boot", this.boot, this);
    }

    public boot() {
        this.scene.sys.events.on("shutdown", this.shutdown, this);
        this.scene.sys.events.once("destroy", this.destroy, this);
    }

    shutdown() {

    }

    destroy() {
        this.shutdown();
        if(this.scene){
            if(this.scene.sys){
                this.scene.sys.events.off("boot", this.boot, this);
            }
            this.scene = undefined;
        }
    }

    showHighlight(img:Highlightable, w:number, h:number){
        img.setPipeline(OutlinePipeline.KEY);
        img.pipeline.set1f('uTextureWidth', w);
        img.pipeline.set1f('uTextureHeight', h);
        //img.pipeline.set1f('time', 0);
        //img.pipeline.set2fv('resolution', [1024, 768]);
        this._toUpdate = img;
    }

    hideHighlight(img:Highlightable) {
        img.resetPipeline();
        this._toUpdate = null;
    }
}

export default HighlightPlugin;

