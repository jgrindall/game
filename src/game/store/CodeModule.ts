/**
 * Status of CodeRunner. Used to show he right stop/start buttons
 */


import {Module, Mutation, VuexModule, getModule} from "vuex-module-decorators";
import store from "./Store";
import {CodeStatus, Info, Section} from "../types";
import Vue from "vue";

@Module({
    dynamic: true,
    name: "code",
    store,
    namespaced: true
})

class CodeModule extends VuexModule {

    private _status: CodeStatus = CodeStatus.IDLE;
    private _initCode: string[][] = [];

    get status():CodeStatus{
        return this._status;
    }

    get initCode(): string[]{
        const currentSectionIndex = this.context.rootGetters["progress/currentSectionIndex"];
        console.log('initCode', currentSectionIndex, this._initCode, this._initCode[currentSectionIndex]);
        return this._initCode[currentSectionIndex];
    }

    @Mutation
    public start() {
        this._status = CodeStatus.RUNNING;
    }

    @Mutation
    public complete() {
        this._status = CodeStatus.COMPLETE;
    }

    @Mutation
    public error() {
        this._status = CodeStatus.COMPLETE;
    }

    @Mutation
    public addElements(payload: {sceneIndex: number, elementNames:string[]}) {
        const code = payload.elementNames.map((name:string)=>{
            return `${name} = pip.getElementByName('${name}')`
        });
        Vue.set(this._initCode, payload.sceneIndex, code);
    }

}
export default getModule(CodeModule);



