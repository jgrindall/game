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
    import {useProgressStore} from "../store/ProgressModule";
    import {ISkulptError, ISkulptSuspension, SectionProgressType, SectionStatus} from "../types";
    import {useCodeStore} from "../store/CodeModule";

    const CODE_DELAY = 500; //ms between each line

    private playTimeout: number = 0;

    export default defineComponent({
        components: {
            CodeView
        },
        props:{

        },
        computed:{
            get sections(){
            return useLevelStore().sections;
        }

        get sectionStatus():SectionStatus{
            return useProgressStore().currentSectionStatus;
        }

        get enabled(): boolean{
            return this.sectionStatus ? (this.sectionStatus.status === SectionProgressType.CODE) : false;
        }
        get index(){
            return useProgressStore().sectionViewIndex;
        }
        },
        methods:{
            onStopCode(){
            //const codeRunner = CodeRunner.getInstance();
            codeRunner.stop();
        }
        viewSection(i:number){
            progressModule.setSectionViewIndex(i);
        }
        
        onRunCode(data:{initCode:string, code:string}){
           
        }
        }
    })



</script>

