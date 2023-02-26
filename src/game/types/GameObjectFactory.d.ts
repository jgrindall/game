import TypeWriter from "../components/TypeWriter";
import DialogPlugin from "../plugins/DialogPlugin";
import HighlightPlugin from "../plugins/HighlightPlugin";
import Label from "../components/Label";
import Info from "../components/Info";
import AnimatedTiles from "../plugins/AnimatedTiles"
import Challenge from "../components/Challenge";

declare global {
	namespace Phaser.GameObjects {
		interface GameObjectFactory {
			typewriter(x: number, y: number, contents:string[], options?:any): TypeWriter;
			label(x: number, y: number, contents:string): Label;
			info(x: number, y: number, contents:string): Info;
			challenge(x: number, y: number, contents:string): Challenge;
		}
	}

	namespace Phaser{
		interface Scene {
			dialogPlugin: DialogPlugin,
			highlightPlugin: HighlightPlugin,
			animatedTiles: AnimatedTiles
		}
	}
}


