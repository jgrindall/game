import Phaser from "phaser";

class OutlinePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
	// the unique id of this pipeline
	public static readonly KEY = "Outline";

	/**
	 * @param {Phaser.Game} game - the controller of the game instance
	 */
	constructor(game: Phaser.Game) {
		super({
			game: game,
			fragShader: `
			
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
uniform float uTextureWidth;   // passed in as the width of the sprite
uniform float uTextureHeight;  // passed in as the height of the sprite
varying vec2 outTexCoord;
varying float outTintEffect;
varying vec4 outTint;

void main(){
	vec4 texture = texture2D(uMainSampler, outTexCoord);
	vec4 texel = vec4(outTint.rgb * outTint.a, outTint.a);
	vec4 color = texture;
	
	float a = 0.6;
	
	if (outTintEffect == 0.0){
		color = texture * texel;
	}
	else if (outTintEffect == 1.0){
		color.rgb = mix(texture.rgb, outTint.rgb * outTint.a, texture.a);
		color.a = texture.a * texel.a;
	}
	else if (outTintEffect == 2.0){
		color = texel;
	}
	float dx = 1.0 / uTextureWidth;
	float dy = 1.0 / uTextureHeight;
	
	float tol = 0.025;
	vec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - dy));
	vec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + dy));
	vec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + dx, outTexCoord.y));
	vec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - dx, outTexCoord.y));
	bool hasSolidNeighbour = (colorU.a >= tol || colorD.a >= tol || colorL.a >= tol || colorR.a >= tol);
	if (texture.a <= 0.2 && hasSolidNeighbour) {
		// green
		gl_FragColor = vec4(0.1, 1.0, 0.1, 1.0) * vec4(outTint.a, outTint.a, outTint.a, outTint.a);
	}
	else{
		gl_FragColor = vec4(color.r, min(color.g * 1.75, 255.0), color.b, color.a);
	}
	
}
`
		});
	}
}

export default OutlinePipeline;

