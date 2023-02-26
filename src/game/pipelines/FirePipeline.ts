import Phaser from "phaser";

class FirePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
	// the unique id of this pipeline
	public static readonly KEY = "FirePipeline";

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


const float WIDTH = 200.0;
const float HEIGHT = 200.0;
uniform float time;

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
		0.024390243902439
		); // 1.0 / 41.0
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
  	float x = gl_FragCoord.x/(WIDTH);
  	float y = gl_FragCoord.y/(WIDTH);
  	float gradient = gl_FragCoord.y/(HEIGHT);

  	float r = 1.0;
  	float g = 0.0;
  	float b = 0.0;

  	//Get noise value at location with some mixing
  	float noise = snoise(vec2(x/10.0,y/10.0 + 11.0));
  	noise += gradient * snoise(vec2(x*2.0,y*2.0 + 1.5 * time));
  	noise += gradient * snoise(vec2(x*3.0,y*3.0 + 2.0 * time));
  	noise += gradient * snoise(vec2(x*6.0,y*6.0 + 3.0 * time));

  	noise = max(0.0, noise);

   	g = 3.0 * noise * (gradient);
    b = noise * (gradient)/2.0; 

  	noise *= 0.65*(1.0-gradient);

  	//m = 1.0 if (gradient * 0.5) < noise, 0.0 otherwise.
  	float m = step(gradient * 0.5, noise);

  	gl_FragColor = vec4(m * r, m * g, m * b, 1.0);
}

`
		});
	}
}

export default FirePipeline;
