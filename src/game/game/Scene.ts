import Phaser from "phaser";
import {ElementDefn, Info, PhaserEventData, Section, TiledElementDefn, WayPoint, WaypointType} from "../types";
import PlayerController from "./PlayerController";
import BaseScene from "./BaseScene";
import progressModule from '../store/ProgressModule';
import dialogModule from "../store/DialogModule";
import codeModule from "../store/CodeModule";
import Element from "../../../pip/elements/Element";
import {getUniqueId} from "../utils/Utils";
import Label from "../components/Label";

const SIZE = 16384;
const TILE_SIZE = 64;

class Scene extends BaseScene{

	private _overlap:Record<string, boolean> = {};

	private _layer2: Phaser.Tilemaps.TilemapLayer;
	private _arr:any;
	private _arr2:any;
	private _tiles2: Phaser.Tilemaps.Tileset;
	private _map2: Phaser.Tilemaps.Tilemap;

	private _wayPointImages: Phaser.GameObjects.Image[] = [];
	//private _infoImages: Phaser.GameObjects.Image[];
	private _background: Phaser.GameObjects.Image;

	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private _sections:Section[];
	private _controller: PlayerController;

	private grid: Phaser.GameObjects.TileSprite;

	private _initCode: string[][] = [];

	//private _laser: Phaser.GameObjects.Image;
	//private _workhole: Phaser.GameObjects.Image;
	//private _fire: Phaser.GameObjects.Image;
	//private _water: Phaser.GameObjects.Image;
	//private _water2: Phaser.GameObjects.Image;
	//private _news: Phaser.GameObjects.Image;

	constructor() {
		super({
			key: "Scene",
			physics: {
				default: 'arcade',
				arcade: {
					debug: true,
					gravity: {
						y: 800
					}
				}
			}
		});
	}

	public init(data:{sections: Section[]}) {
		this._sections = data.sections;
	}

	public async setCameraToWaypoint(){
		const index = this.getCurrentSectionIndex();
		const waypoint:Phaser.GameObjects.Image = this._wayPointImages.find(img => {
			return img.getData("_section") === index && img.getData("_type") === WaypointType.START;
		});
		if(waypoint){
			const x = waypoint.getData("_cameraX") * TILE_SIZE;
			const y = waypoint.getData("_cameraY") * TILE_SIZE;
			this.setCameraScroll({x, y});
		}
	}

	public stopFollow(): Scene{
		this.getCamera().stopFollow();
		return this;
	}

	private drawMap(){

		// create the Tilemap
		this._map2 = this.add.tilemap('level1_2', TILE_SIZE, TILE_SIZE, SIZE, SIZE);
		this._tiles2 = this._map2.addTilesetImage('scifi', 'scifi2');
		this._layer2 = this._map2.createLayer("Map", this._tiles2);
		this._layer2.setOrigin(0, 0);

		// 1, 2, 3, 4...  not  0, 1, 2, 3, 4...
		const indexes = [2, 3, 17, 19, 37, 38, 39];

		this._map2.setCollision(indexes, true, true, this._layer2, true);
		this._layer2.setCollision(indexes, true);

		this._arr = this._map2.createFromObjects("Objects", {
			//@ts-ignore exists
			classType: Phaser.GameObjects.Image
		});

		this._arr2 = this._map2.createFromObjects("Waypoints", {
			//@ts-ignore exists
			classType: Phaser.GameObjects.Image,
			key: 'waypoint'
		});

		this.animatedTiles.init(this._map2);
	}

	private addPlayer(){
		this.cursors = this.input.keyboard.createCursorKeys();
		this.player = this.physics.add.sprite(20, 20, 'player');
		const src = this.player.texture.getSourceImage();
		//this.highlightPlugin.showHighlight(this.player, src.width/4, src.height/2);
		this._controller = new PlayerController(this.player, this.cursors);
		let body:Phaser.Physics.Arcade.Body = (this.player.body as Phaser.Physics.Arcade.Body);
		body.setCollideWorldBounds(true);
		body.setBounce(0.05, 0.05);


		body.setSize(55, 64, true);
		body.offset.set(22, 30);


		//this.physics.add.collider(this.player, this._layer);
		this.physics.add.collider(this.player, this._layer2);
	}

	private addWaypoints(){
		//TODO - Phaser.GameObjects.Group and collision
		this._arr2.forEach((obj: Phaser.GameObjects.Image)=>{
			this.physics.add.existing(obj, true);
			const body = (obj.body as Phaser.Physics.Arcade.Body);
			body.allowGravity = false;
			this.physics.add.overlap(this.player, obj);
			this._wayPointImages.push(obj);

			obj.setInteractive(new Phaser.Geom.Rectangle(0, 0, 64, 64), Phaser.Geom.Rectangle.Contains)
				.on('pointerdown', (pointer:Phaser.Input.Pointer , x:number , y:number , event:PhaserEventData)=>{
					console.log("click");
					event.stopPropagation();
					const data = obj.data.getAll() as WayPoint;
					if(data._type === WaypointType.INFO) {
						const info:Info = {
							description:["aaaaaa", "bbbbbbbb", "cccccccccc"],
							type:"",
							label:"",
							autoShow: true
						};
						dialogModule.setInfo(info);
					}
				});
		});
	}

	public create(){
		window.Sk.elementManager.manageScene(this);
		this.getPhysics().world.setBounds(0, 0, SIZE, SIZE);
		this.getCamera()
			//TODO - size?
			.setBounds(0, 0, SIZE - 500, SIZE - 500);
		this.loadBg();
		this.drawMap();
		this.addPlayer();
		this.addWaypoints();
		this.addElements();
		this.addLights();
		this.addGrid();

		this.add.challenge(400, 400, "Challenge: ewfefef...");
	}

	protected addGrid(){
		const SIZE = 64;
		const g = this.add.graphics({ x: 0, y: 0});
		g.lineStyle(2, 0x888888, 0.5);
		g.strokeRect(0, 0, SIZE, SIZE);
		g.generateTexture('grid', SIZE, SIZE);
		g.destroy(true);
		this.grid = this.add.tileSprite(0, 0, 1280, 768, 'grid');
		this.grid.setOrigin(0, 0);
		this.grid.setScrollFactor(0,0);
		this.grid.visible = false;
	}

	protected addLights(){
		let light = this.add.pointlight(700, 300, 0x8888cc, 90, 0.05);

		//this._laser = this.add.image(200, 200, "waypoint");
		//this._laser.scaleX = 20;
		//var clr = 0xff5500;
		//var white = 0xffffff;
		//this._laser.fillGradientStyle(clr, clr, white, white,0, 0, 1, 1);
		//this._laser.fillRect(250, 200, 400, 4);
		//this._laser.blendMode = 'ADD';
		//this._laser.setPipeline(GlowPipeline.KEY);
		//this._laser.pipeline.set1f('uIntensity', 0.0);

	}

	protected addElements(){
		this._sections.forEach( (section:Section, i: number)=> {
			const imgs = this._arr.filter((img: Phaser.GameObjects.Image) => {
				const data = img.data.getAll() as TiledElementDefn;
				return data._scene === i;
			});
			const elts:ElementDefn[] = imgs.map( (img:Phaser.GameObjects.Image) => {
				const data = img.data.getAll() as TiledElementDefn;
				const id = getUniqueId();
				const defaults = {
					"angle":0,
					"scaleX":1,
					"scaleY":1,
				};
				//TODO - pass in extra data into props
				const imgs = {
					"platform": "/images/pythonator/platform.png",
					"plant": "/images/pythonator/bush2.png",
					"flower": "/images/pythonator/flower.png",
					"ladder": "/images/pythonator/ladder.png"
				};
				const image = imgs[data._type];
				return {
					"type": data._type,
					"props": {
						"name": data._name,
						"id": id,
						"color": null,
						"x": img.x,
						"y": img.y,
						"image":  image,
						"visibleAtStart": true,
						...defaults
					},
					"id": id,
					"editable": true,
					"deleteable": false
				} as ElementDefn;
			});
			const elements:Element[] = this._sceneProxy.addElementsUsingData(elts);
			this._elements.push(elements);
			const elementNames = elts.map((elt:ElementDefn) => elt.props.name);
			codeModule.addElements({sceneIndex:i, elementNames});
		});
		this._arr.forEach((img: Phaser.GameObjects.Image) => {
			img.destroy();
		});
	}

	private loadBg(){
		const width = this.scale.width;
		const height = this.scale.height;
		this.add.image(width/2, height/2, "background2");
		this._background = this.add.image(0, 0, "scifi");

		/*this._water2 = this.add.image(800, 150, "water2");
		this._water2.alpha = 0.8;
		this._water = this.add.image(800, 150, "water");
		this._news = this.add.image(550, 600, "news");
		this._workhole = this.add.image(800, 300, "box");
		this._fire = this.add.image(800, 450, "box");
		this._water.setPipeline(DistortPipeline.KEY);
		this._water2.setPipeline(DistortPipeline.KEY);

		this._fire.setPipeline(Fire2Pipeline.KEY);
		this._news.setPipeline(BadTVPipeline.KEY);*/

	}

	public showGrid(b:boolean){
		if(this.grid) {
			this.grid.visible = b;
		}
	}

	updateBg(){
		const width = this.scale.width;
		const height = this.scale.height;
		const x = this.getCamera().scrollX;
		const y = this.getCamera().scrollY;
		const r:number = 0.25;
		this._background.setPosition(x + width/2 - x * r, y + height/2 - y * r);
	}

/*
	private checkInfoLabels(){
		this._infoImages.forEach( (img: Phaser.GameObjects.Image) => {
			this._labelManager.updateUsing(img, this.player);
		});
	}
*/

	private checkWayPoints(){
		if(!this._enabled){
			return;
		}
		const prevOverlap = {...this._overlap};
		let newContact = false;
		this._wayPointImages.forEach(img=>{
			const data = img.data.getAll() as WayPoint;
			this._overlap[data._id] = false;
			if(this.getPhysics().overlap(img, this.player)){
				const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, img.x, img.y);
				if(dist < 50) {
					this._overlap[data._id] = true;
					if(!prevOverlap[data._id] && !newContact){
						// new contact
						newContact = true;
						if(data._type === WaypointType.START || data._type === WaypointType.END){
							const info:Info = {
								description:["Challenge", " Challengebbbbbbbb", " Challengecccccccccc"],
								type:"",
								label:"",
								autoShow: true
							};
							progressModule.waypointReached({waypoint:data, info});
						}
						else if(data._type === WaypointType.INFO){
							const info:Info = {
								description:["aaaaaa", "bbbbbbbb", "cccccccccc"],
								type:"",
								label:"",
								autoShow: true
							};
							dialogModule.setInfo(info);
						}
					}
				}
			}
		});
	}

	private checkPlayer(){
		if(this._ladders && this.player){
			const ladder = this._ladders.find(ladder=>{
				const img = ladder as Phaser.GameObjects.Image;
				return this.physics.overlap(img, this.player) && Math.abs(this.player.x - img.x) < 20;
			});
			const platform = this._platforms.find(platform=>{
				return this.physics.overlap(platform, this.player);
			});
			this._controller
				.setLadder(!!ladder)
				.setPlatform(!!platform)
				.setEnabled(this._enabled)
				.update();
		}
	}

	public update(t:number, dt:number){
		/*
		//TODO
		this.npcGroup = scene.physics.add.group();
    	scene.physics.add.overlap(this.talkZone, this.npcGroup);
		 */

		this.updateBg();
		this.checkWayPoints();
		//this.checkInfoLabels();
		this.checkPlayer();
		this._labelManager.update();
		this._platformManager
			.setEnabled(this._enabled)
			.update();

		/*const i = (1  + Math.sin(t/500)) / 3;
		this._laser.pipeline.set1f('uIntensity', i);
		this._laser.pipeline.set1f('uTime', t);
		this._water.pipeline.set1f("time", t/500);
		this._water2.pipeline.set1f("time", t/500);
		this._news.pipeline.set1f("distortion", 5.0);
		this._news.pipeline.set1f("distortion2", 2.0);
		this._news.pipeline.set1f("speed", Math.random() - 0.2);
		this._news.pipeline.set1f("rollSpeed", 0.0015);

		if(Math.sin(t / 750) > 0.1){
			this._news.pipeline.set1f("time", 0);
		}
		else{
			this._news.pipeline.set1f("time", t/7500);
		}

		this._workhole.pipeline.set1f("time", t/500);
		this._workhole.pipeline.set2f("resolution", 300, 300);

		this._fire.pipeline.set1f("time", t/1500);
		this._fire.pipeline.set2f("resolution", 100, 100);*/

	}

}

export default Scene;

