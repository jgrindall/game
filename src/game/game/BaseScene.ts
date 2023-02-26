import Phaser from 'phaser';
import Plant from "../elements/Plant";
import GrowAnimation from "../animations/GrowAnimation";
import Ladder from "../elements/Ladder";
import LabelManager from "./managers/LabelManager";
import {ElementDefn, IScene, SectionStatus} from "../types";
import progressModule from "../store/ProgressModule";
import ClickManager from "./managers/ClickManager";
import Platform from "../elements/Platform";
import PlatformManager from "./managers/PlatformManager";

const lerp = (a:number, b:number, t:number) => t*b + (1 - t)*a;

abstract class BaseScene extends Phaser.Scene implements IScene {

	protected _foregroundGroup?:Phaser.GameObjects.Group = undefined;
	protected _elements:Element[][];
	protected _labelManager: LabelManager;
	protected _clickManager: ClickManager;
	protected _platformManager: PlatformManager;
	protected player?: Phaser.GameObjects.Sprite = undefined;

	//TODO - add to group
	protected _ladders:Phaser.GameObjects.GameObject[] = [];
	protected _platforms:Phaser.GameObjects.GameObject[] = [];

	protected _enabled:boolean = true;

	constructor(config:any) {
		super({
			...config
		});
		this._elements = [];
		this._labelManager = new LabelManager(this);
		this._clickManager = new ClickManager(this);
		this._platformManager = new PlatformManager(this);
	}

	protected async targetObject(target:Phaser.GameObjects.Image):Promise<void>{
		const camera = this.getCamera();
		const bounds = camera.getBounds()
		const x = Math.round(Phaser.Math.Clamp(target.x - camera.width/2, 0, bounds.right));
		const y = Math.round(Phaser.Math.Clamp(target.y - camera.height/2, 0, bounds.bottom));
		return this.setCameraScroll({x, y});
	}

	public startFollow():Promise<void> {
		console.log("start Follow");
		const camera = this.getCamera();
		return this.targetObject(this.player!)
			.then(()=>{
				camera.startFollow(this.player!, true, 0.05, 0.05);
			});
	}

	public async setCameraScroll(props: {x:number, y:number}):Promise<void>{
		console.log("setCameraScroll", props);
		const camera = this.getCamera();
		const startX = camera.scrollX;
		const startY = camera.scrollY;
		const tweenObj = {
			val: 0
		};
		return new Promise(resolve=>{
			this.tweens.add({
				targets:tweenObj,
				val: 1,
				duration: 1000,
				ease:Phaser.Math.Easing.Quadratic.InOut,
				onUpdate: (tween)=>{
					const p = tween.progress;
					camera.setScroll(
						Math.round(lerp(startX, props.x, p)),
						Math.round(lerp(startY, props.y, p))
					);
					if(p === 1){
						resolve();
					}
				}
			});
		});
	}

	protected getCamera():Phaser.Cameras.Scene2D.Camera{
		return this.cameras.main;
	}

	public setEnabled(enabled:boolean){
		this._enabled = enabled;
	}

	public isEnabled(){
		return this._enabled;
	}

	public setup(){}

	protected onResize(){
		this.scale.displaySize.setAspectRatio( 1024/768 );
		this.scale.refresh();
	}

	public getFactory() : Phaser.GameObjects.GameObjectFactory{
		return this.add;
	}

	protected getElements():Element[][] {
		return this._elements;
	}

	protected getSectionProgess():SectionStatus{
		return progressModule.currentSectionStatus;
	}

	protected getCurrentSectionIndex():number{
		return progressModule.currentSectionIndex;
	}

	protected addElement(ClassRef: typeof Element, data:any):void {
		
	}

	public getPhysics(){
		return this.physics;
	}

	protected getLoader(): Phaser.Loader.LoaderPlugin{
		return this.load;
	}

	protected addElements(){

	}

	public reset(){
		
	}

	public removeElement(data:ElementDefn) {
		
	}
	protected getGroup(): Phaser.GameObjects.Group{
		if(!this._foregroundGroup){
			this._foregroundGroup = this.getFactory().group({
				createCallback: ()=>{

				},
				removeCallback:()=>{

				}
			});
		}
		return this._foregroundGroup;
	}

	/**
	 * Utility method
	 * @param {string} key - texture key
	 */
	public safeDestroyTexture(key:string) {
		if (this.textures.getTextureKeys().includes(key)) {
			this.textures.remove(key);
		}
	}
}

export default BaseScene;