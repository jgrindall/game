//TODO - modal should be handled by the dialog manager


import Phaser from 'phaser';
import {PhaserEventData} from "../types";

class TypeWriter extends Phaser.GameObjects.Container {

	private _bitmapText:Phaser.GameObjects.BitmapText;
	//private _bg:Phaser.GameObjects.RenderTexture;
	private _numChars = 0;
	private _contents:string[];
	private _index =  0;
	private _timer?: Phaser.Time.TimerEvent;

	public static PADDING = 24;
	private static SPEED = 15;

	constructor(scene: Phaser.Scene, x: number, y: number, contents: string[], options?: any){
		super(scene, x, y);
		this._contents = contents;
		this._index = 0;
		this._bitmapText = scene.add
			.bitmapText(0, 0, "shortStackBlack", "")
			.setMaxWidth(400)
			.setScale(0.333)
			.setAlpha(0);

		/* this._bg = scene.add.nineslice(
			-10,
			-10,   // this is the starting x/y location
			100,
			100,   // the width and height of your object
			'box2', // a key to an already loaded image
			20,         // the width and height to offset for a corner slice
			20          // (optional) pixels to offset when computing the safe usage area
		)
			.setOrigin(0, 0);

		this
			.add(this._bg)
			.add(this._bitmapText); */

		this.setScrollFactor(0,0);

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 400, 100), Phaser.Geom.Rectangle.Contains)
			.on('pointerdown', (pointer:Phaser.Input.Pointer , x:number , y:number , event:PhaserEventData)=>{
				event.stopPropagation();
			})
			.on('pointerup', (pointer:Phaser.Input.Pointer , x:number , y:number , event:PhaserEventData)=>{
				event.stopPropagation();
				this.onClick();
			});

		this.update();
	}

	private onClick(){
		this._index++;
		this.stopTimer();
		this.emit("click");
	}

	public setText(text: string){
		console.log(text);
		this._bitmapText
			.setAlpha(0)
			.setText(text);

		const bounds = this._bitmapText.getTextBounds();

		//this._bg.resize(Math.max(150, bounds.global.width + 30), Math.max(bounds.global.height + 30, 50) );

		this._bitmapText
			.setAlpha(1)
			.setText("");

		this.beginTyping();
	}

	public update(){
		this.setText(this.getCurrentText());
	}

	private stopTimer(){
		if(this._timer) {
			this._timer.destroy();
		}
	}

	destroy(fromScene?: boolean): void {
		this
			.removeInteractive()
			.off('pointerdown')
			.off('pointerup');
		this.stopTimer();
		super.destroy(fromScene);
	}

	config(avatar:string, text:string){
		//TODO
	}

	public isFinished(){
		return this._index >= this._contents.length;
	}

	private getCurrentText(): string{
		return this._contents[this._index];
	}

	private beginTyping(){
		const text = this.getCurrentText();
		const length = text.length;
		this._numChars = 0;
		this._timer = this.scene.time.addEvent({
			callback: () => {
				this._bitmapText.text = text.substr(0, this._numChars);
				this._numChars++;
			},
			repeat: length - 1,
			delay: TypeWriter.SPEED
		});
	}
}

export default TypeWriter;
