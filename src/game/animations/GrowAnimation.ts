import Phaser from "phaser";

const getId = ()=>{
	//TODO - change this
	return "25e04c02c" + Math.floor(Math.random() * 100000);
};

class GrowAnimation {
	grow(scene:Phaser.Scene, target:Element, num:number){
		/* console.log("grow", target.getProp("name"));
		const image:string = target.getProp("image");
		const x:number = target.getProp("x");
		const y:number = target.getProp("y");

		const data = _.range(num).map(i=>{
			const id = getId();
			return {
				"type": "plant",
				"props": {
					"name": "clone" + id,
					"id": id,
					"color": null,
					"x": x + i * 80,
					"y": y - i * 30,
					"angle":0,
					"scaleX":1,
					"scaleY":1,
					"image": image,
					"visibleAtStart": true
				},
				"id": id,
				"editable": true,
				"deleteable": false
			};
		});

		const elements =_sceneProxy.addElementsUsingData(data);

		const animations:Animation[] = elements.map(element=>{
			return Animation.fadeIn(scene, element.getGameObject());
		});
		_.last(animations).setOnComplete(()=>{
			this.onComplete();
		});

		return elements; */
	}
}

export default GrowAnimation;
