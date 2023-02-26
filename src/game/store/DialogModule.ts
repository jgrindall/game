/**
 * show a dialog on the screen
 */

import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "./Store";
import {Info, Section, SectionStatus, WayPointInfo} from "../types";
import {Vue} from "vue-property-decorator";

@Module({
    dynamic: true,
    name: "dialog",
    store:store,
    namespaced: true
})
class DialogModule extends VuexModule {

    private _info: Info = null;

    get info(): Info{
        return this._info;
    }

    @Mutation
    public setInfo(payload: Info) {
        if(!payload || !this._info) {
            this._info = payload;
        }
    }

}

export default getModule(DialogModule);
