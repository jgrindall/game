<template>
    <div class="code" >

        <p class="pm-h2">Task:</p>
        <div v-for="d in description">{{d}}</div>
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

              <pm-button :disabled="disableRun" @click="onRunCode()">Run</pm-button>
            <pm-button :disabled="disableStop" @click="onStopCode()">Stop</pm-button>
            <pm-button :disabled="disableHints" @click="onResetCode()">Reset</pm-button>

            <div>
                <button :disabled="disableHints" @click="showHint(i)" v-for="(hint, i) in hints">Hint</button>
            </div>


        </div>
    </div>
</template>
<script lang="ts">
    import * as CodeMirror from "codemirror";
    import {EditorChange, EditorChangeCancellable} from "codemirror";
    import {makeCodeMirror} from "../utils/Utils";

    import pmButton from ".././../../common/components/pm-button.vue";

    import {
        Challenge,
        CodeStatus, Hint,
        Section,
        SectionProgressType,
        SectionStatus
    } from "../types";
    import progressModule from "../store/ProgressModule";
    import codeModule from "../store/CodeModule";

    const CODE_DELAY = 500; //ms between each line

    @Component({
        components: {
            pmButton:pmButton
        }
    })
    export default class CodeView extends Vue {

        private codeMirror: CodeMirror.Editor;


        @Prop({type: Object, required: true}) section: Section;

        @Ref('codeMirrorEl')
        readonly codeMirrorEl!: HTMLTextAreaElement;

        get disableRun(){
            return this.disabled || this.codeStatus === CodeStatus.RUNNING;
        }

        get sectionStatus():SectionStatus{
            return progressModule.currentSectionStatus;
        }

        get currentCode(){
            return this.sectionStatus ? this.sectionStatus.code : "";
        }

        get disableStop(){
            return this.disabled || this.codeStatus != CodeStatus.RUNNING;
        }

        get disableReset(){
            return this.disabled || this.codeStatus != CodeStatus.COMPLETE;
        }

        get challenge():Challenge{
            const section:Section = progressModule.currentSection;
            return section ? section.challenge : null;
        }

        get codeStatus(): CodeStatus{
            return codeModule.status;
        }

        get disableHints(){
            return this.sectionStatus ? (this.sectionStatus.status !== SectionProgressType.CODE) : true;
        }

        get description():string[]{
            return this.challenge.description;
        }

        get initCode(){
            return (codeModule.initCode || []).join('\n') + '\n';
        }

        get disabled(){
            return this.sectionStatus ? (this.sectionStatus.status !== SectionProgressType.CODE) : true;
        }

        get hints():Hint[]{
            return (this.section.hints || []);
        }

        showHint(i:number){
            alert("show hint " + i + this.hints[i].content)
        }

        setValue(s: string){
            //console.log("->", s);
            this.codeMirror.setValue(s);
        }

        @Watch("challenge")
        onChangeChallenge() {
            //if(this.displayCode){
                //this.setValue(this.displayCode);
            //}
        }

        @Watch("disabled")
        onChangeDisabled() {
            this.codeMirror.setOption("readOnly", this.disabled);
        }

        onResetCode(){
            this.setValue("");
            this.$emit("reset");
            progressModule.setCurrentCode("");
        }

        onStopCode(){
            this.$emit("stopCode");
        }

        onRunCode(){
            this.$emit("runCode", {
                initCode: this.initCode,
                code:progressModule.currentCode
            });
        }

        mounted(){

            this.codeMirror = makeCodeMirror(this.codeMirrorEl, "", {
                readOnly:  true
            });

            this.codeMirror.on('beforeChange',(_instance:CodeMirror.Editor, changeObj: EditorChangeCancellable) => {
                //console.log(changeObj.from.line, changeObj.to.line);
                if(Math.random() < -0.5){
                    changeObj.cancel();
                }
            });

            //TODO - both needed?

            //TODO - make sure it's the correct section

            this.codeMirror.on('change',(_instance:CodeMirror.Editor, changeObj: EditorChange) => {
                //console.log(changeObj);
                progressModule.setCurrentCode(_instance.getValue());
            });

            this.codeMirror.on('changes',(_instance:CodeMirror.Editor, changeObj: EditorChange[]) => {
                //console.log(changeObj);
                progressModule.setCurrentCode(_instance.getValue());
            });

        }
    }
</script>

