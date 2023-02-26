import Phaser from "phaser";
import StateMachine from "./StateMachine";
import {StateNames, AnimNames, UpdateOptions, IState, AState} from "./PlayerState";

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

class IdleState extends AState{
	onUpdate(options:UpdateOptions){
		const up = this.cursors.up.isDown;
		const left = this.cursors.left.isDown;
		const right = this.cursors.right.isDown;
		const floor = this.body.onFloor();
		if(left || right){
			this.gotoState(StateNames.WALK);
		}
		else if(up && floor && !options.platform){
			this.gotoState(StateNames.JUMP);
		}
	}
	onEnter(){
		this.playAnim(AnimNames.IDLING);
		this.body.setVelocityX(0);
	}
}

class WalkState extends AState {
	onUpdate(options:UpdateOptions){
		const speedX = 200;
		const up = this.cursors.up.isDown;
		const left = this.cursors.left.isDown;
		const right = this.cursors.right.isDown;
		const floor = this.body.onFloor();
		const startJump = floor && up;
		let velX = 0;
		this.playAnim(AnimNames.WALKING);
		if (left || right) {
			velX = left ? -speedX : speedX;
			this.body.setVelocityX(velX);
			this.gameObj.setFlipX(velX < 0);
			if(options.ladder){
				this.stateMachine.setState(StateNames.CLIMB);
			}
			else if(startJump){
				this.stateMachine.setState(StateNames.JUMP);
			}
		}
		else if(options.ladder){
			this.stateMachine.setState(StateNames.CLIMB);
		}
		else if(startJump){
			this.stateMachine.setState(StateNames.JUMP);
		}
		else{
			this.stateMachine.setState(StateNames.IDLE);
		}
	}
}

const climbSpeed = 100;

class ClimbState extends AState {
	onUpdate(options:UpdateOptions){
		const up = this.cursors.up.isDown;
		const down = this.cursors.down.isDown;
		const left = this.cursors.left.isDown;
		const right = this.cursors.right.isDown;
		const floor = this.body.onFloor();
		let velY, velX = 0;
		const speedY = climbSpeed;
		const speedX = climbSpeed;
		if(options.ladder){
			if(up || down){
				if(up && down){
					velY = 0;
				}
				else if(up) {
					velY = -speedY;
				}
				else if(down) {
					velY = speedY;
				}
				this.playAnim(AnimNames.CLIMBING);
			}
			else {
				velY = 0;
				console.log(floor);
				this.playAnim(floor ? AnimNames.IDLE_BEGIN_CLIMB : AnimNames.CLIMBING_STATIONARY);
			}
			velX = left ? -speedX : (right ? speedX : 0);
			this.body.setVelocityX(velX);
			this.body.setVelocityY(velY);
		}
		else{
			this.stateMachine.setState("idle");
		}
	}
	onEnter(){
		this.body.setAllowGravity(false);
	}
	onExit(){
		this.body.setAllowGravity(true);
	}
}

const jumpSpeedX = 130;
const jumpSpeedY = -370;
class JumpState extends AState {
	onUpdate(options:UpdateOptions){
		const floor = this.body.onFloor();
		const left = this.cursors.left.isDown;
		const right = this.cursors.right.isDown;
		let velX;
		if(options.ladder){
			this.stateMachine.setState(StateNames.CLIMB);
			this.body.setVelocity(0,0);
		}
		else if (!floor && (left || right)) {
			velX = left ? -jumpSpeedX : jumpSpeedX;
			this.body.setVelocityX(velX);
			this.gameObj.setFlipX(velX < 0);
		}
		else if(floor){
			this.stateMachine.setState(StateNames.IDLE);
		}
	}
	onEnter(){
		this.body.setVelocityY(jumpSpeedY);
		this.playAnim(AnimNames.JUMPING);
	}
	onExit(){
		this.body.setAllowGravity(true);
	}
}

class PlayerController{
	private gameObj: Phaser.GameObjects.Sprite;
	private body: Phaser.Physics.Arcade.Body;
	private stateMachine:StateMachine;
	private ladder:boolean;
	private platform: any;
	private _enabled: boolean = true;
	private _states: Record<StateNames, IState>;

	constructor(gameObj:Phaser.GameObjects.Sprite, cursors:CursorKeys) {
		this.gameObj = gameObj;
		this.body = (gameObj.body as Phaser.Physics.Arcade.Body);

		const states = [
			StateNames.IDLE,
			StateNames.WALK,
			StateNames.CLIMB,
			StateNames.JUMP
		];
		this.stateMachine = new StateMachine(this, "player");

		this._states = {
			[StateNames.IDLE]: new IdleState(this.stateMachine, gameObj, cursors),
			[StateNames.WALK]: new WalkState(this.stateMachine, gameObj, cursors),
			[StateNames.CLIMB]: new ClimbState(this.stateMachine, gameObj, cursors),
			[StateNames.JUMP]: new JumpState(this.stateMachine, gameObj, cursors)
		};

		states.forEach(stateName=>{
			const state = this._states[stateName];
			const onEnter = state.onEnter.bind(state);
			const onExit =  state.onExit.bind(state);
			this.stateMachine.addState(stateName, {
				onUpdate: ()=>{
					state.onUpdate({
						ladder: this.ladder,
						platform: this.platform
					})
				},
				onEnter,
				onExit
			})
		});
		this.load(this.gameObj.anims);
		this.stateMachine.setState(StateNames.IDLE);
	}
	load(anims:Phaser.Animations.AnimationState) {
		anims.create({
			key: AnimNames.WALKING,
			frames: anims.generateFrameNames('player', {
				prefix: 'robo_player_',
				start: 2,
				end: 3,
			}),
			frameRate: 10,
			repeat: -1
		});
		anims.create({
			key: AnimNames.IDLING,
			frames: [
				{
					key: 'player', frame: 'robo_player_0'
				}
				],
			frameRate: 10
		});
		anims.create({
			key: AnimNames.JUMPING,
			frames: [
				{
					key: 'player', frame: 'robo_player_1'
				}],
			frameRate: 10
		});
		anims.create({
			key: AnimNames.CLIMBING,
			frames: anims.generateFrameNames('player', {
				prefix: 'robo_player_',
				start: 4,
				end: 5,
			}),
			frameRate: 10
		});
		anims.create({
			key: AnimNames.CLIMBING_STATIONARY,
			frames: [
				{
					key: 'player', frame: 'robo_player_4'
				}
			],
			frameRate: 10
		});
		anims.create({
			key: AnimNames.IDLE_BEGIN_CLIMB,
			frames: [
				{
					key: 'player', frame: 'robo_player_7'
				}
			],
			frameRate: 10
		});
	}
	setPlatform(p:boolean): this{
		this.platform = p;
		return this;
	}
	setLadder(ladder:boolean): this{
		this.ladder = ladder;
		return this;
	}
	setEnabled(enabled: boolean): this{
		this._enabled = enabled;
		if(!enabled){
			this.stateMachine.setState(StateNames.IDLE);
		}
		return this;
	}

	update(){
		if(this._enabled){
			this.stateMachine.update();
		}
	}
}

export default PlayerController;