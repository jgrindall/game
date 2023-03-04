/**
 * store your progress through a level
 */

import { defineStore } from 'pinia'
import {
    Info,
    Section,
    SectionProgress,
    SectionProgressType,
    SectionStatus,
    WayPointEnd,
    WayPointStart, WaypointType
} from "../types";

import {useDialogStore} from "./DialogModule";
import {useLevelStore} from "./LevelModule"

type State = {
    sectionProgress: SectionProgress
}

export const useProgressStore = defineStore('progress', {
    state: (): State => {
        return {
            sectionProgress: {
                currentSectionIndex:-1,
                sectionViewIndex: -1,
                sectionStatus:[]
            }
        }
      },
      getters:{
        sectionViewIndex(): number{
            return this.sectionProgress.sectionViewIndex;
        },
        currentSection():Section{
            return useLevelStore().sections[this.sectionProgress.currentSectionIndex];
        },
        sectionProgress():SectionProgress{
            return this.sectionProgress;
        },
        currentSectionStatus():SectionStatus{
            return this.sectionProgress.sectionStatus[this.sectionProgress.currentSectionIndex];
        },
        currentSectionIndex():number{
            return this.sectionProgress.currentSectionIndex;
        },
        currentCode():string{
            return this.currentSectionStatus.code;
        }
      },
      actions: {
        reset(){
            this.sectionProgress = {
                currentSectionIndex:-1,         // section you are on
                sectionViewIndex:-1,            // section you are viewing
                sectionStatus:[]
            };
        },
        setSectionProgress(progress: SectionProgress) {
            this.sectionProgress = progress;
        },
        setSectionViewIndex(index: number) {
            this.sectionProgress = {
                ...this.sectionProgress,
                sectionViewIndex: index
            };
        },
        nextSection() {
            const currentIndex = this.sectionProgress.currentSectionIndex;
            this.sectionProgress = {
                ...this.sectionProgress,
                currentSectionIndex: currentIndex + 1,
                sectionViewIndex: currentIndex + 1
            };
        },
        setSectionStatus(status: SectionProgressType) {
            const index = this.sectionProgress.currentSectionIndex;
            const sectionStatus:SectionStatus = this.sectionProgress.sectionStatus[index]
            this.sectionProgress.sectionStatus[index] = {
                ...sectionStatus,
                status
            }
        },
        setCurrentCode(code: string) {
            this.currentSectionStatus.code = code;
        },
        init(payload:SectionProgress){
            this.setSectionProgress(payload)
        },
        startPlayingSection() {
            this.setSectionStatus(SectionProgressType.PLAY);
        },
        waypointReached(payload: {waypoint:WayPointStart | WayPointEnd, info: any}): void{
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
                    this.nextSection()
                    this.setSectionStatus(SectionProgressType.PENDING);
                }
                if(startingFirstSection || startingNextSection){
                    this.setSectionStatus(SectionProgressType.CODE);
                    useDialogStore().setInfo(info);
                }
            }
            else if(waypoint._type === WaypointType.END){
                if(waypoint._section === index && progress.status === SectionProgressType.PLAY){
                    this.sectionComplete();
                }
            }
        },
        sectionComplete(){
            this.setSectionStatus(SectionProgressType.COMPLETE)
        },
        changeViewIndex(increment: number): void{
            this.setSectionViewIndex(this.sectionProgress.sectionViewIndex + increment)
         }
      }
})
