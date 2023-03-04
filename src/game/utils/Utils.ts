import Phaser from "phaser";

export const getUniqueId = ()=>{
	let d = (window.performance && typeof window.performance.now) ? performance.now() : new Date().getTime();
	return'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
};

export const promiseEach = async <T1, T2>(a:T1[], promiseMaker:(val:T1)=>Promise<T2>)=>{
    const initialValue: T2 = null as unknown as T2
    const initialValuePromise: Promise<T2> = Promise.resolve(initialValue)
    const callback = async (previousValue: Promise<T2>, currentValue: T1): Promise<T2>=>{
        await previousValue
        return promiseMaker(currentValue)
    }
    return a.reduce(callback, initialValuePromise)
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



//export const makeCodeMirror = (el:HTMLTextAreaElement, code:string, options?: CodeMirror.EditorConfiguration) : CodeMirror.Editor => {

export const makeCodeMirror = (el:HTMLTextAreaElement, code:string, options?: any) : any => {

    /*const cm:Editor = CodeMirror.fromTextArea(el, {
        value:code,
            ...defaultOptions,
            ...options
    });
    cm
        .getDoc()
        .setValue(code);
    return cm; */

    return null

};



