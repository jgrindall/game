import Phaser from 'phaser';

class Challenge extends Phaser.GameObjects.Container {

	private _text:Phaser.GameObjects.BitmapText;
	public static PADDING = 16;

	constructor(scene: Phaser.Scene, x: number, y: number, text: string){
		super(scene, x, y);
		this._text = scene.add
			.bitmapText(x, y, "shortStackBlack", text)
			.setMaxWidth(400)
			.setScale(2);

		this._text.setScrollFactor(0,0);

		const t2 = scene.add.text(x, y, text, {
			fontFamily: 'Georgia',
			fontSize:"80px"
		});

		t2.setScrollFactor(0,0);

		const anim = (obj: Phaser.GameObjects.GameObject)=>{
			const timeline = scene.tweens.createTimeline();

			timeline.add({
				targets: obj,
				x: 60,
				ease: 'Power1',
				duration: 1000
			});

			timeline.add({
				targets: obj,
				alpha: 0.5,
				ease: 'Power1',
				duration: 1000
			});

			timeline.add({
				targets: obj,
				y: 60,
				ease: 'Power1',
				duration: 1000
			});

			timeline.play();
		};

		anim(t2);
		anim(this._text);

	}
}

export default Challenge;
