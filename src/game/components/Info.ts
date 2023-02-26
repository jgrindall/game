import Phaser from 'phaser';

class Info extends Phaser.GameObjects.Container {

	private _text:Phaser.GameObjects.BitmapText;
	private _bg:Phaser.GameObjects.Graphics;
	private _contents:string;
	public static PADDING:number = 16;

	constructor(scene: Phaser.Scene, x: number, y: number, text: string){
		super(scene, x, y);
		this._contents = text;
		this._text = scene.add
			.bitmapText(0, 0, "shortStackBlack", text)
			.setMaxWidth(400)
			.setScale(0.4);

		this._bg = scene.add
			.graphics({
				x: 0,
				y: 0,
				fillStyle: {
					color: 0x222222,
					alpha: 0.5
				}
			});

		this
			.add(this._bg)
			.add(this._text);

		this.redraw();
	}

	public getContainerBounds():Phaser.Types.GameObjects.BitmapText.BitmapTextSize{
		return this._text.getTextBounds();
	}

	private redraw(){
		const bounds = this._text.getTextBounds();
		this._text.setText(this._contents);
		this._bg
			.clear()
			.fillRoundedRect(-Info.PADDING, -Info.PADDING, bounds.global.width + 2*Info.PADDING, bounds.global.height + 2*Info.PADDING, Info.PADDING);
	}

	public setContents(value: string){
		this._contents = value;
		this.redraw();
	}
}

export default Info;
