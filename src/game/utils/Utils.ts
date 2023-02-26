import {GameObject} from "../../../pip/elements/types";
import Phaser from "phaser";
import * as CodeMirror from "codemirror";
import {Editor} from "codemirror";

export const getUniqueId = ()=>{
	let d = (window.performance && typeof window.performance.now) ? performance.now() : new Date().getTime();
	return'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
};

export const promiseEach = <T1, T2>(a:T1[], promiseMaker:(val:T1)=>Promise<T2>)=>{
	return a.reduce(function(prev, cur) {
		return prev.then(() => promiseMaker(cur))
	}, Promise.resolve());
};

export const updateInteractiveBounds = (gameObj:GameObject, scale:{x:number, y:number}):void => {
	// @ts-ignore - this is valid
	const bounds = gameObj.getBounds();

	const w = bounds.width/scale.x;
	const h = bounds.height/scale.y;
	gameObj.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);
	if(gameObj.input){
		const hitArea =  gameObj.input.hitArea as Phaser.Geom.Rectangle;
		if(hitArea){
			hitArea.setSize(w, h);
		}
	}
};


const defaultOptions = {
    mode: "python",
    theme:"monokai",
    smartIndent: true,
    gutters: [
        "CodeMirror-lint-markers",
        "breakpoints"
    ],
    lineNumbers: true,
    tabSize: 2,
    autocorrect: false,
    autocapitalize: false,
    spellcheck: false,
    readOnly: false
};

export const makeCodeMirror = (el:HTMLTextAreaElement, code:string, options?: CodeMirror.EditorConfiguration) : CodeMirror.Editor => {
    const cm:Editor = CodeMirror.fromTextArea(el, {
        value:code,
            ...defaultOptions,
            ...options
    });
    cm
        .getDoc()
        .setValue(code);
    return cm;

};



