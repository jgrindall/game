/**
 * store your progress through a level
 */

import {Module, Mutation, VuexModule, getModule, Action} from "vuex-module-decorators";
import {Vue} from 'vue-property-decorator';
import store from "./Store";
import {
    Info,
    Section,
    SectionProgress,
    SectionProgressType,
    SectionStatus,
    WayPointEnd,
    WayPointStart, WaypointType
} from "../types";
import dialogModule from "./DialogModule";

@Module({
    dynamic: true,
    name: "progress",
    store,
    namespaced: true
})

class ProgressModule extends VuexModule {

    private _sectionProgress:SectionProgress = {
        currentSectionIndex:-1,
        sectionViewIndex: -1,
        sectionStatus:[]
    };

    get sectionViewIndex(): number{
        return this._sectionProgress.sectionViewIndex;
    }

    get currentSection():Section{
        const sections = this.context.rootGetters["level/sections"];
        return sections[this._sectionProgress.currentSectionIndex];
    }

    get sectionProgress():SectionProgress{
        return this._sectionProgress;
    }

    get currentSectionStatus():SectionStatus{
        return this._sectionProgress.sectionStatus[this._sectionProgress.currentSectionIndex];
    }

    get currentSectionIndex():number{
        return this._sectionProgress.currentSectionIndex;
    }

    get currentCode():string{
        return this.currentSectionStatus.code;
    }

    @Mutation
    public reset(){
        this._sectionProgress = {
            currentSectionIndex:-1,         // section you are on
            sectionViewIndex:-1,            // section you are viewing
            sectionStatus:[]
        };
    }

    @Mutation
    private _setSectionProgress(progress: SectionProgress) {
        this._sectionProgress = progress;
    }

    @Mutation
    public setSectionViewIndex(index: number) {
        this._sectionProgress = {
            ...this._sectionProgress,
            sectionViewIndex: index
        };
    }

    @Mutation
    public nextSection() {
        const currentIndex = this._sectionProgress.currentSectionIndex;
        this._sectionProgress = {
            ...this._sectionProgress,
            currentSectionIndex: currentIndex + 1,
            sectionViewIndex: currentIndex + 1
        };
    }

    @Mutation
    private _setSectionStatus(status: SectionProgressType) {
        const index = this._sectionProgress.currentSectionIndex;
        const sectionStatus:SectionStatus = this._sectionProgress.sectionStatus[index];
        Vue.set(this._sectionProgress.sectionStatus, index, {
            ...sectionStatus,
            status
        });
    }

    @Action
    public setCurrentCode(code: string) {
        this.currentSectionStatus.code = code;
    }

    @Action
    init(payload:SectionProgress){
        this.context.commit('_setSectionProgress', payload);
    }

    @Action
    public startPlayingSection() {
        this.context.commit('_setSectionStatus', SectionProgressType.PLAY);
    }

    @Action
    public waypointReached(payload: {waypoint:WayPointStart | WayPointEnd, info: any}): void{
        const progress:SectionStatus = this.currentSectionStatus;
        const index:number = this.currentSectionIndex;
        const waypoint = payload.waypoint;
        const info = payload.info;

        console.log(payload)
        console.log(progress, index)

        if(waypoint._type === WaypointType.START){
            const startingFirstSection = (progress.status === SectionProgressType.PENDING && waypoint._section === 0);
            const startingNextSection = (progress.status === SectionProgressType.COMPLETE && waypoint._section === index + 1);
            if(startingNextSection){
                console.log("startNextSection!");
                this.context.commit('nextSection');
                this.context.commit('_setSectionStatus', SectionProgressType.PENDING);
            }
            if(startingFirstSection || startingNextSection){
                this.context.commit('_setSectionStatus', SectionProgressType.CODE);
                dialogModule.setInfo(info);
            }
        }
        else if(waypoint._type === WaypointType.END){
            if(waypoint._section === index && progress.status === SectionProgressType.PLAY){
                this.sectionComplete();
            }
        }
    }


    @Action
    public sectionComplete(){
        this.context.commit('_setSectionStatus', SectionProgressType.COMPLETE);
    }

    @Action({ commit: 'setSectionViewIndex' })
    public changeViewIndex(increment: number): number{
        return this._sectionProgress.sectionViewIndex + increment;
    }

}
export default getModule(ProgressModule);



