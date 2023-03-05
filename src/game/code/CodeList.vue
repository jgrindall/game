<template>
    <div class="codeList" :class="{'enabled': enabled}">
        <span>{{index}}</span>

        <button
                class="selectSection"
                :class="{'active': i === index}"
                v-for="(_section, i) in sections"
                :key="'section' + i"
                @click="viewSection(i)">
            {{i}}
        </button>

        <ul>
            <li v-for="(section, i) in sections" :class="{'active': i === index}" :key="'section' + i">
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
    import {ISkulptError, ISkulptSuspension, SectionProgressType, SectionStatus, Section} from "../types";
    import {useCodeStore} from "../store/CodeModule";
    import {defineComponent} from "vue"

    const CODE_DELAY = 500; //ms between each line

    let playTimeout = 0;

    export default defineComponent({
        components: {
            CodeView
        },
        props:{

        },
        computed:{
            sections(): Section[]{
                return useLevelStore().sections;
            },
            sectionStatus():SectionStatus{
                return useProgressStore().currentSectionStatus;
            },
            enabled(): boolean{
                return this.sectionStatus ? (this.sectionStatus.status === SectionProgressType.CODE) : false;
            },
            index(): number{
                return useProgressStore().sectionViewIndex;
            }
        },
        methods:{
            onStopCode(){
                //const codeRunner = CodeRunner.getInstance();
                //codeRunner.stop();
            },
            viewSection(i:number){
                useProgressStore().setSectionViewIndex(i);
            },
            onRunCode(data:{initCode:string, code:string}){
                //TODO
            }
        }
    })



</script>

