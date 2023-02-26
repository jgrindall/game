/**
 * Status of CodeRunner. Used to show he right stop/start buttons
 */


import store from "./Store";
import {CodeStatus, Info, Section} from "../types";
import Vue from "vue";
import { defineStore } from 'pinia'

type State = {
    status?:CodeStatus,
    initCode:string[][]
}

export const useCodeStore = defineStore('code', {
  state: (): State => {
    return {
        status: CodeStatus.IDLE,
        initCode: []
    }
  },
  getters:{
    initCode(){
        //const currentSectionIndex = this.context.rootGetters["progress/currentSectionIndex"];
        //console.log('initCode', currentSectionIndex, this._initCode, this._initCode[currentSectionIndex]);
        //return this._initCode[currentSectionIndex];
    }
  },
  actions: {
    start() {
        this.status = CodeStatus.RUNNING;
    },
    complete() {
        this.status = CodeStatus.COMPLETE;
    },
    error() {
        this.status = CodeStatus.COMPLETE;
    },
    addElements(payload: {sceneIndex: number, elementNames:string[]}) {
        const code = payload.elementNames.map((name:string)=>{
            return `${name} = pip.getElementByName('${name}')`
        });
        //Vue.set(this._initCode, payload.sceneIndex, code);
    },
  }
})
