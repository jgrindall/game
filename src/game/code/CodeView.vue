<template>
    <div class="code" >

        <p class="pm-h2">Task:</p>
        <div v-for="(d, i) in description" :key="'des' + i">
            {{d}}
        </div>
        <p>{{sectionStatus.status}}</p>

        <div>
            <textarea
                    autocapitalize="off"
                    autocomplete="off"
                    ref="codeMirrorEl">
            </textarea>
        </div>

        <span>initCode {{initCode}}</span>
        <span>codeStatus {{codeStatus}}</span>

        <div>

              <button :disabled="disableRun" @click="onRunCode()">Run</button>
            <button :disabled="disableStop" @click="onStopCode()">Stop</button>
            <button :disabled="disableHints" @click="onResetCode()">Reset</button>

            <div>
                <button :disabled="disableHints" @click="showHint(i)" v-for="(hint, i) in hints" :key="'hint' + i">Hint</button>
            </div>


        </div>
    </div>
</template>
<script lang="ts">
    import {makeCodeMirror} from "../utils/Utils";

    import {
        Challenge,
        CodeStatus, Hint,
        Section,
        SectionProgressType,
        SectionStatus
    } from "../types";
    import {useProgressStore} from "../store/ProgressModule";
    import {useCodeStore} from "../store/CodeModule";
    import {defineComponent, PropType} from "vue"

    const CODE_DELAY = 500; //ms between each line

    type Data = {
        codeMirror: any
    }

    export default defineComponent({
        components: {
           
        },
        data(): Data{
            return {
                codeMirror: null
            }
        },
        mounted(){
            /* 
            this.codeMirror = makeCodeMirror(this.codeMirrorEl, "", {
                readOnly:  true
            });

            this.codeMirror.on('beforeChange',(_instance:CodeMirror.Editor, changeObj: EditorChangeCancellable) => {
                //console.log(changeObj.from.line, changeObj.to.line);
                if(Math.random() < -0.5){
                    changeObj.cancel();
                }
            });

            this.codeMirror.on('change',(_instance:CodeMirror.Editor, changeObj: EditorChange) => {
                //console.log(changeObj);
                progressModule.setCurrentCode(_instance.getValue());
            });

            this.codeMirror.on('changes',(_instance:CodeMirror.Editor, changeObj: EditorChange[]) => {
                //console.log(changeObj);
                progressModule.setCurrentCode(_instance.getValue());
            }); */
        },
        props:{
            section:{
                type: Object as PropType<Section>,
                required: true
            }
        },
        watch:{
            challenge(){
                //if(this.displayCode){
                    //this.setValue(this.displayCode);
                //}
            },
            disabled(){
                //this.codeMirror.setOption("readOnly", this.disabled);
            }
        },
        computed:{
            disableRun(): boolean{
                return this.disabled || this.codeStatus === CodeStatus.RUNNING;
            },
            sectionStatus():SectionStatus{
                return useProgressStore().currentSectionStatus;
            },
            currentCode(): string{
                return this.sectionStatus ? this.sectionStatus.code : "";
            },
            disableStop(): boolean{
                return this.disabled || this.codeStatus != CodeStatus.RUNNING;
            },
            disableReset(): boolean{
                return this.disabled || this.codeStatus != CodeStatus.COMPLETE;
            },
            challenge():Challenge | null{
                const section:Section = useProgressStore().currentSection;
                return section ? section.challenge : null;
            },
            codeStatus(): CodeStatus{
                return useCodeStore().status;
            },
            disableHints(): boolean{
                return this.sectionStatus ? (this.sectionStatus.status !== SectionProgressType.CODE) : true;
            },
            description():string[]{
                return this.challenge ? this.challenge.description : [];
            },
            initCode():string{
                return (useCodeStore().initCode || []).join('\n') + '\n';
            },
            disabled(): boolean{
                return this.sectionStatus ? (this.sectionStatus.status !== SectionProgressType.CODE) : true;
            },
            hints():Hint[]{
                return (this.section.hints || []);
            }
        },
        methods:{
            showHint(i:number){
                alert("show hint " + i + this.hints[i].content)
            },
            setValue(s: string){
                //console.log("->", s);
                this.codeMirror.setValue(s);
            },
            onResetCode(){
                this.setValue("");
                this.$emit("reset");
                useProgressStore().setCurrentCode("");
            },
            onStopCode(){
                this.$emit("stopCode");
            },
            onRunCode(){
                this.$emit("runCode", {
                    initCode: this.initCode,
                    code:useProgressStore().currentCode
                });
            }
        }
    })


</script>

