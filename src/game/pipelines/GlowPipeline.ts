import Phaser from "phaser";

class GlowPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
	// the unique id of this pipeline
	public static readonly KEY = "GlowPipeline";

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

// Scene buffer
uniform sampler2D uMainSampler; 
varying vec2 outTexCoord;

// Effect parameters
uniform float uIntensity;
uniform float uTime;

void main() {
  	vec4 front = texture2D(uMainSampler, outTexCoord);
  	vec4 sum = vec4(0);
  	for(int xx = -4; xx <= 4; xx++) {
    	for(int yy = -3; yy <= 3; yy++) {
      	float dist = sqrt(float(xx*xx) + float(yy*yy));
      	float factor = 0.0;
      	if (dist == 0.0) {
        	factor = 2.0;
      	}
      	else {
        	factor = 2.0/abs(float(dist));
      	}
      	sum += texture2D(uMainSampler, outTexCoord + vec2(xx, yy) * 0.002) * factor;
    	}
  	}
  	float i = (1.0  + sin(uTime/500.0) - outTexCoord.x) * 0.333;
  	i = max(i, 0.0);
  	i = min(i, 1.0);
  	gl_FragColor = mix(front, sum, i);
    //gl_FragColor = front;
}
`
		});
	}
}

export default GlowPipeline;

