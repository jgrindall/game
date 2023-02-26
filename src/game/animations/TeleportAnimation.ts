import Phaser from "phaser";
import Completable from "../../../pip/elements/Completable";
import Animation from "../../../pip/elements/Animation";
import Element from "../../../pip/elements/Element";


class TeleportAnimation extends Completable{
	play(scene:Phaser.Scene, element:Element, x:number, y:number){
		const gameObj = element.getGameObject();
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
		});
	}
}

export default TeleportAnimation;