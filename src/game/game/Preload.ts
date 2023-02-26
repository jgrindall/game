import Phaser from "phaser";
import BaseScene from "./BaseScene";
import TypeWriter from "../components/TypeWriter";
import Label from "../components/Label";
import Info from "../components/Info";
import Challenge from "../components/Challenge";
import OutlinePipeline from "../pipelines/OutlinePipeline";
import GlowPipeline from "../pipelines/GlowPipeline";
import BadTVPipeline from "../pipelines/BadTVPipeline";
import FirePipeline from "../pipelines/FirePipeline";
import Fire2Pipeline from "../pipelines/Fire2Pipeline";
import DistortPipeline from "../pipelines/DistortPipeline";
import WormholePipeline from "../pipelines/WormholePipeline";

const PIPELINES = [
	OutlinePipeline,
	GlowPipeline,
	BadTVPipeline,
	FirePipeline,
	Fire2Pipeline,
	DistortPipeline,
	WormholePipeline
];

class Preload extends BaseScene {

	constructor(config:any) {
		super({
			...config,
			key:"Preload"
		});

		Phaser.GameObjects.GameObjectFactory.register('typewriter', function (x:number, y:number, contents:string[], options?: any):TypeWriter {
			let text = new TypeWriter(this.scene, x, y, contents, options);
			return this.displayList.add(text);
		});

		Phaser.GameObjects.GameObjectFactory.register('label', function (x:number, y:number, contents:string):Label {
			let text = new Label(this.scene, x, y, contents);
			return this.displayList.add(text);
		});

		Phaser.GameObjects.GameObjectFactory.register('info', function (x:number, y:number, contents:string):Info {
			let info = new Info(this.scene, x, y, contents);
			return this.displayList.add(info);
		});

		Phaser.GameObjects.GameObjectFactory.register('challenge', function (x:number, y:number, contents:string):Info {
			let challenge = new Challenge(this.scene, x, y, contents);
			return this.displayList.add(challenge);
		});
	}
	preload (){
		const loader = this.getLoader();
		const path = "/images/pythonator/assets/";
		loader
			.bitmapFont('shortStack', path + 'shortStack.png', path + 'shortStack.xml')
			.bitmapFont('shortStackBlack', path + 'shortStackBlack.png', path + 'shortStackBlack.xml')
			.image('background', path + 'images/background.png')
			.image('background2', path + 'images/bg.png')
			.image('avatar', path + 'avatar.png')
			.image('ladder', path + 'ladder.png')
			.image('spike', path + 'images/spike.png')
			.image('floor', path + 'tilesets/platformPack_tilesheet.png')
			.image('news', path + 'news.jpg')
			.image('mountain', path + 'mountain.png')
			.image('water', path + 'water.png')
			.image('water2', path + 'water2.png')
			.image('box', path + 'box.png')
			.image('box2', path + 'box2.png')
			.image('sky', path + 'sky.png')
			.image('waypoint', path + 'light.png')
			.image('waypoint2', path + 'light2.png')
			.image('waypoint3', path + 'light3.png')
			.image('mountains-back', path + 'mountains-back.png')
			.image('scifi', path + 'bg.png')
			.image('mountains-mid2', path + 'mountains-mid2.png')


			.image('scifi2', path + 'scifi.png')
			.tilemapTiledJSON("level1_2", path + "level1_2.json?r=" + Math.random())
			.atlas('player', path + 'images/kenney_player.png?r=' + Math.random(), path + 'images/kenney_player_atlas.json');
	}
	create (){
		this.add.text(200, 150, "Preload", {
			fontFamily: 'Georgia',
			fontSize:"200px"
		});

		window.WebFont.load({
			custom: {
				families: [
					'SFDigitalReadout'
				]
			},
			fontactive: ()=> {
				setTimeout(()=>{
					this.game.events.emit('launch');
				}, 1000);
			}
		});

		const renderer = (this.sys.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer);
		// add all the pipelines we are going to use
		if (!renderer.pipelines.has(PIPELINES[0].KEY)){
			PIPELINES.forEach(Klass=>{
				renderer.pipelines.add(
					Klass.KEY,
					new Klass(this.sys.game)
				);
			});
		}
	}
}

export default Preload;