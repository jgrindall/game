import Phaser from "phaser";
import StateMachine from "./StateMachine";

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export enum StateNames{
	IDLE = "idle",
	JUMP = "jump",
	CLIMB = "climb",
	WALK = "walk"
}

export enum AnimNames{
	IDLING = "idle",
	JUMPING = "jump",
	CLIMBING = "climb",
	IDLE_BEGIN_CLIMB = "beginclimb",
	CLIMBING_STATIONARY = "climb_stationary",
	WALKING = "walk"
}

export type UpdateOptions = {
	ladder?: boolean,
	platform?: boolean
};

export interface IState {
	onUpdate(options?: UpdateOptions):void;
	onEnter():void;
	onExit():void;
}

export abstract class AState implements IState{
	protected body:Phaser.Physics.Arcade.Body;

	constructor(protected stateMachine:StateMachine, protected gameObj:Phaser.GameObjects.Sprite, protected cursors:CursorKeys) {
		this.body = (gameObj.body as Phaser.Physics.Arcade.Body);
	}
	playAnim(name:string){
		console.log("play", name);
		this.gameObj.play(name, true);
	}
	gotoState(name:string){
		this.stateMachine.setState(name);
	}
	onEnter(){

	}
	onExit(){

	}
	onUpdate(options:UpdateOptions){

	}
}


