/**
 * Load the level data
 */

import {Module, Mutation, VuexModule, getModule, Action} from "vuex-module-decorators";
import store from "./Store";
import {
    Section,
} from "../types";

@Module({
    dynamic: true,
    name: "level",
    store,
    namespaced: true
})

class LevelModule extends VuexModule {

    private _sections: Section[] = [];

    get sections():Section[]{
        return this._sections;
    }

    @Mutation
    public reset(){
        this._sections = [];
    }

    @Mutation
    private _setSections(sections: Section[]) {
        this._sections = sections;
    }

    @Action
    init(payload:Section[]){
        this.context.commit('_setSections', payload);
    }

}
export default getModule(LevelModule);



