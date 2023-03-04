/**
 * show a dialog on the screen
 */

import {Info, Section, SectionStatus, WayPointInfo} from "../types";
import { defineStore } from 'pinia'

type State = {
    info?:Info
}

export const useDialogStore = defineStore('dialog', {
  state: (): State => {
    return {
        info: undefined
    }
  },
  actions: {
    setInfo(payload: Info) {
        this.info = payload
    },
    clearInfo(){
      this.info = undefined
    }
  }
})
