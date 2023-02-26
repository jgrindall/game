import Phaser from 'phaser';

const OFFSET = 20;

class Label extends Phaser.GameObjects.Container {

	private _text: Phaser.GameObjects.BitmapText;
	private _bg: Phaser.GameObjects.RenderTexture;
	private _contents:string;
	public static PADDING:number = 16;

	constructor(scene: Phaser.Scene, x: number, y: number, text: string){
		super(scene, x, y);
		this._contents = text;

		this._text = scene.add
			.bitmapText(0, 0, "shortStackBlack", text)
			.setMaxWidth(400)
			.setScale(1.0);


		var style = { font: "25px Arial", fill: "#222222", align: "center" };

		const _text2 = scene.add.text(30, 70, "Hello", style);


		this._bg = scene.add.nineslice(
			-10,
			-10,   // this is the starting x/y location
			50,
			50,   // the width and height of your object
			'box2', // a key to an already loaded image
			OFFSET,         // the width and height to offset for a corner slice
			10          // (optional) pixels to offset when computing the safe usage area
		)
			.setOrigin(0, 0)
			.setAlpha(0.75);

		this
			.add(this._bg)
			.add(_text2)
			.add(this._text);


		setInterval(()=>{
			const s:Phaser.Math.Vector2 = scene.game.scale.displayScale;
			s.x = s.y = 1;
			this._text.setScale(1/s.x, 1/s.y);
			_text2.setScale(1/s.x, 1/s.y);
		}, 500);

		this.redraw();
	}

	public getContainerBounds():Phaser.Types.GameObjects.BitmapText.BitmapTextSize{
		return this._text.getTextBounds();
	}

	private redraw(){
		const bounds = this._text.getTextBounds();
		this._text.setText(this._contents);
		this._bg.resize(Math.max(bounds.global.width + 30, 2*OFFSET), Math.max(bounds.global.height + 30, 2*OFFSET))
	}

	public setContents(value: string){
		this._contents = value;
		this.redraw();
	}
}

export default Label;
