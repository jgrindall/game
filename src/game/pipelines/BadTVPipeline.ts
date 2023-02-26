import Phaser from "phaser";

//https://editor.isf.video/shaders/871
//https://editor.isf.video/shaders/5e7a7fb57c113618206de308
//https://mrdoob.com/lab/javascript/webgl/clouds/
//https://paveldogreat.github.io/WebGL-Fluid-Simulation/
//https://codesandbox.io/s/3878x?file=/src/shaders/Fire.js
//https://www.youtube.com/watch?v=OSvKPtXufUw
//https://github.com/mattdesl/tendril-webtoy-blog-post
//https://adrianton3.github.io/jonquil/




class BadTVPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
	// the unique id of this pipeline
	public static readonly KEY = "BadTVPipeline";

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
varying vec2 outTexCoord;

uniform float time;
uniform float distortion;
uniform float distortion2;
uniform float speed;
uniform float rollSpeed;

vec3 mod289(vec3 x) {
  	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  	return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v){
  	const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  	vec2 i  = floor(v + dot(v, C.yy) );
  	vec2 x0 = v -   i + dot(i, C.xx);

  	vec2 i1;
  	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  	vec4 x12 = x0.xyxy + C.xxzz;
  	x12.xy -= i1;

  	i = mod289(i); // Avoid truncation effects in permutation
  	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));

  	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  	m = m*m ;
  	m = m*m ;

  	vec3 x = 2.0 * fract(p * C.www) - 1.0;
  	vec3 h = abs(x) - 0.5;
  	vec3 ox = floor(x + 0.5);
  	vec3 a0 = x - ox;

  	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  	vec3 g;
  	g.x  = a0.x  * x0.x  + h.x  * x0.y;
  	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  	return 130.0 * dot(m, g);
}

void main() {

	vec2 p = outTexCoord;
	float ty = time*speed;
	float yt = p.y - ty;
	float offset = snoise(vec2(yt*3.0,0.0))*0.2;
	offset = offset*distortion * offset*distortion * offset;
	float n = snoise(vec2(yt*50.0,0.0));
	if (n < 0.25){
		gl_FragColor = texture2D(uMainSampler,  outTexCoord);
	}
	else{
		offset += n*distortion2*0.001;
		gl_FragColor = texture2D(uMainSampler,  vec2(fract(p.x + offset),fract(p.y-time*rollSpeed) ));
	}
}
`
		});
	}
}

export default BadTVPipeline;
