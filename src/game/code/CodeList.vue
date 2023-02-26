<template>
    <div class="codeList" :class="{'enabled': enabled}">
        <span>{{index}}</span>

        <button
                class="selectSection"
                :class="{'active': i === index}"
                v-for="(_section, i) in sections"
                @click="viewSection(i)">
            {{i}}
        </button>

        <ul>
            <li v-for="(section, i) in sections" :class="{'active': i === index}">
                <code-view
                        :section="section"
                        @runCode="onRunCode"
                        @stopCode="onStopCode">
                </code-view>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import CodeView from "./CodeView.vue";
    import {useLevelStore} from "../store/LevelModule";
    import progressModule from "../store/ProgressModule";
    import {ISkulptError, ISkulptSuspension, SectionProgressType, SectionStatus} from "../types";
    import {useCodeStore} from "../store/CodeModule";

    const CODE_DELAY = 500; //ms between each line

    @Component({
        components: {
            CodeView

        }
    })
    export default class CodeList extends Vue {

        private playTimeout: number = 0;

        get sections(){
            return useLevelStore().sections;
        }

        get sectionStatus():SectionStatus{
            return progressModule.currentSectionStatus;
        }

        get enabled(): boolean{
            return this.sectionStatus ? (this.sectionStatus.status === SectionProgressType.CODE) : false;
        }
        get index(){
            return progressModule.sectionViewIndex;
        }

        onStopCode(){
            const codeRunner = CodeRunner.getInstance();
            codeRunner.stop();
        }
        viewSection(i:number){
            progressModule.setSectionViewIndex(i);
        }
        addListeners(){
            const codeRunner = CodeRunner.getInstance();

            const resume = codeRunner.resume.bind(codeRunner);

            const isWaiting = ()=>!!window.Sk.animation;

            const waitForAnimation = (onComplete: Function)=>{
                const waiting = isWaiting();
                if(waiting){
                    window.Sk.animation.setOnComplete(()=>{
                        window.Sk.animation = null;
                        onComplete();
                    });
                }
                return waiting;
            };

            const onCodeComplete = ()=>{
                //console.log("check it is correct. if so, mark the section as correct and allow proceed");
                if(Math.random() < 0.85){
                    alert("well done");
                    progressModule.startPlayingSection();
                }
                else{
                    alert("fail");
                }
            };

            const handleSkulptSuspension = (suspension:ISkulptSuspension)=>{
                console.log(suspension);
            };

            codeRunner
                .on("started", ()=>{
                    codeModule.start();
                    console.log('started');
                })
                .on("completed", (suspension:ISkulptSuspension)=>{
                    codeModule.complete();
                    handleSkulptSuspension(suspension);
                    if(isWaiting()){
                        waitForAnimation(onCodeComplete);
                    }
                    else{
                        onCodeComplete();
                    }
                })
                .on("output", (message:string)=>{
                    console.log('output', message);
                })
                .on("stopped", ()=>{
                    console.log('stopped');
                })
                .on("error", (error:ISkulptError)=>{
                    codeModule.error();
                    console.log('error', error);
                })
                .on("suspension", (suspension:ISkulptSuspension)=>{
                    handleSkulptSuspension(suspension);
                    clearTimeout(this.playTimeout);
                    if(isWaiting()){
                        waitForAnimation(()=>{
                            this.playTimeout = window.setTimeout(resume, CODE_DELAY);
                        });
                    }
                    else{
                        this.playTimeout = window.setTimeout(()=>{
                            if(isWaiting()){
                                waitForAnimation(resume);
                            }
                            else{
                                resume();
                            }
                        }, CODE_DELAY);
                    }

                })
        }

        onRunCode(data:{initCode:string, code:string}){
            const codeRunner = CodeRunner.getInstance();
            codeRunner
                .setInitCodeProvider(()=>{
                    return data.initCode;
                })
                .run(data.code, false);
        }


        mounted(){
            this.addListeners();
        }

    }
</script>

