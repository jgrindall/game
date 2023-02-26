import Phaser from 'phaser';
import SceneTextureManager from "../../../pip/canvas/SceneTextureManager";
import Element from "../../../pip/elements/Element";
import Plant from "../elements/Plant";
import {
	GROW,
	BOUNDS_CHANGED,
	ELEMENT_REMOVED,
	TEXTURE_CHANGED,
	VELOCITY_CHANGED
} from "../../../pip/canvas/Events";
import GrowAnimation from "../animations/GrowAnimation";
import Ladder from "../elements/Ladder";
import PhysicsManager from "../../../pip/canvas/playmode/PhysicsManager";
import LabelManager from "./managers/LabelManager";
import SceneProxy from "../../../pip/canvas/SceneProxy";
import {ElementDefn, IScene, SectionStatus} from "../types";
import progressModule from "../store/ProgressModule";
import ClickManager from "./managers/ClickManager";
import Platform from "../elements/Platform";
import PlatformManager from "./managers/PlatformManager";

const lerp = (a:number, b:number, t:number) => t*b + (1 - t)*a;

abstract class BaseScene extends Phaser.Scene implements IScene {

	protected _textureManager:SceneTextureManager;
	protected _foregroundGroup:Phaser.GameObjects.Group;
	protected _elements:Element[][];
	protected _physicsManager:PhysicsManager;
	protected _labelManager: LabelManager;
	protected _clickManager: ClickManager;
	protected _platformManager: PlatformManager;
	protected _sceneProxy:SceneProxy;
	protected player: Phaser.GameObjects.Sprite;

	//TODO - add to group
	protected _ladders:Phaser.GameObjects.GameObject[] = [];
	protected _platforms:Phaser.GameObjects.GameObject[] = [];

	protected _enabled:boolean = true;

	constructor(config:any) {
		super({
			...config
		});
		this._textureManager = new SceneTextureManager(this);

		this._elements = [];
		this._sceneProxy = new SceneProxy(this);
		this._physicsManager = new PhysicsManager(this);
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
		return this.targetObject(this.player)
			.then(()=>{
				camera.startFollow(this.player, true, 0.05, 0.05);
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
	protected getTextureManager(){
		return this._textureManager;
	}

	public getFactory() : Phaser.GameObjects.GameObjectFactory{
		return this.add;
	}

	protected getElements():Element[][] {
		return this._elements;
	}
	protected getElementByName(name:string): Element{
		for(let elements of this._elements){
			for (let element of elements){
				if(element.getName() === name){
					return element;
				}
			}
		}
		return null;
	}

	protected getSectionProgess():SectionStatus{
		return progressModule.currentSectionStatus;
	}

	protected getCurrentSectionIndex():number{
		return progressModule.currentSectionIndex;
	}

	protected addElement(ClassRef: typeof Element, data:any):Element {
		const element = new ClassRef(data, this);

		if(element instanceof Plant){
			this._physicsManager.addPhysicsBody(element);
			this.getPhysics().add.collider(this.player, element.getGameObject());
			element
				.on(BOUNDS_CHANGED, ()=>{
					this._physicsManager.updatePhysicsBody(element);
				})
				.on(TEXTURE_CHANGED, ()=>{
					this._physicsManager.updatePhysicsBody(element);
					this._labelManager.updateBounds(element.getGameObject());
					this._clickManager.updateBounds(element.getGameObject());
				})
				.on(GROW, (target:Element, num:number)=>{
					const animation = new GrowAnimation();
					const elements:Element[] = animation.grow(this, target, num, this._sceneProxy);

					// add them
					const sectionIndex = this.getCurrentSectionIndex();
					this._elements[sectionIndex] = [
						...this._elements[sectionIndex],
						...elements
					];

					window.Sk.animation = animation;
				});
		}
		else if(element instanceof Platform){
			element
				.on(BOUNDS_CHANGED, ()=>{
					this._physicsManager.updatePhysicsBody(element);
				});
			this._platforms.push(element.getGameObject());
			this._physicsManager.updatePhysicsBody(element);
			this._platformManager.add(element);
			this.physics.add.collider(this.player, element.getGameObject());
		}
		else if (element instanceof Ladder){
			this._ladders.push(element.getGameObject());
			element
				.on(BOUNDS_CHANGED, ()=>{
					this._physicsManager.updatePhysicsBody(element);
				})
		}

		else if(element instanceof Plant){
			this._physicsManager.updatePhysicsBody(element);
		}

		element.on(VELOCITY_CHANGED, (element:any) =>{
			this._physicsManager.updateVelocity(element);
		});
		const label = element.getLabel();
		if(label) {
			this._labelManager.add(element.getGameObject(), label);
		}
		this._clickManager.addElement(element);
		return element;
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
		const sectionIndex = this.getCurrentSectionIndex();
		this._elements[sectionIndex].forEach(element=>{
			this.removeElement(element.getData());
		});
		this._elements[sectionIndex] = [];

		this.addElements();
	}

	public removeElement(data:ElementDefn) {
		const element = this.getElementByName(data.props.name);
		// the order matters here - we remove event listeners first using this event.
		this.events.emit(ELEMENT_REMOVED, element);
		this._labelManager.remove(element.getGameObject());
		this._clickManager.remove(element.getGameObject());
		// now remove the actual element
		element.remove();
		return element;
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