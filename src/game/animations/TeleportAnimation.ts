import Phaser from "phaser";

class TeleportAnimation {
	play(scene:Phaser.Scene, element:Element, x:number, y:number){
		/* const gameObj = element.getGameObject();
		new Animation()
			.tween(scene, gameObj, {alpha:0})
			.then(()=>{
				gameObj.x = x;
				gameObj.y = y;
				new Animation()
					.tween(scene, gameObj, {alpha:1})
					.then(()=>{
						this.onComplete();
					});
		}); */
	}
}

export default TeleportAnimation;