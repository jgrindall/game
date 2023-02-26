import { defineStore } from 'pinia'

type State = {
    count:number
}

export const useCounterStore = defineStore('counter', {
  state: (): State => {
    return {
        count: 0
    }
  },
  actions: {
    increment() {
      this.count++
    }
  }
})