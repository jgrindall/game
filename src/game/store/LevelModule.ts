/**
 * Load the level data
 */

import {
    Section,
} from "../types";
import { defineStore } from 'pinia'

type State = {
    sections:Section[]
}

export const useLevelStore = defineStore('level', {
  state: (): State => {
    return {
        sections: []
    }
  },
  actions: {
    reset() {
        this.sections = []
    },
    setSections(payload:Section[]){
        this.sections = payload
    },
    init(payload:Section[]){
        this.sections = payload
    }
  }
})
