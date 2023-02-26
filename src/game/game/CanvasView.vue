import {SectionProgressType} from "../types";
import {SectionProgressType} from "../types";
<template>
    <div class="canvas">
        <canvas id="myCanvas" ref="myCanvas" width="1024" height="768"></canvas>
        <div id="debug">
            <textarea>{{sectionIndex}} : {{sectionProgress}}</textarea>
            <textarea>{{enabled}}</textarea>
            <textarea>{{info}}</textarea>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Ref, Vue, Watch} from 'vue-property-decorator';
    import Phaser from "phaser";
    import Scene from "./Scene";
    import Preload from "./Preload";
    import levelModule from "../store/LevelModule";
    import dialogModule from "../store/DialogModule";
    import progressModule from "../store/ProgressModule";
    import {Info, Section, SectionProgressType, SectionStatus} from "../types";
    import DialogPlugin from "../plugins/DialogPlugin";
    import HighlightPlugin from "../plugins/HighlightPlugin";
    import {Plugin as NineSlicePlugin} from 'phaser3-nineslice';
    import AnimatedTiles from "../plugins/AnimatedTiles"

    @Component({
        components: {

        },
        //?? computed: mapGetters(['foo'])
    })

    export default class CanvasView extends Vue {

        private _game:Phaser.Game;
        private _scene:Scene;

        @Ref('myCanvas')
        readonly myCanvas!: HTMLCanvasElement;

        public reset(){
            this._scene.reset();
        }

        private get showGrid():boolean{
            return this.sectionProgress && this.sectionProgress.status === SectionProgressType.CODE;
        }

        private get enabled(): boolean{
            // when info is visible the game is frozen
            if(this.info || ( this.sectionProgress && this.sectionProgress.status === SectionProgressType.CODE)){
               return false;
            }
            return true;
        }

        private get sectionProgress():SectionStatus{
            return progressModule.currentSectionStatus;
        }

        private get sectionIndex():number{
            return progressModule.currentSectionIndex;
        }

        private get sections():Section[]{
            return levelModule.sections;
        }

        private get info(): Info{
            return dialogModule.info;
        }

        private startGame(){
            const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
            const context = new AudioContext();

            const config = {
                type: Phaser.WEBGL,
                scene: [
                    Preload
                ],

                canvas: this.myCanvas,
                scale: {
                    mode: Phaser.Scale.FIT
                },
                audio: {
                    context: context
                },
                plugins: {

                    global: [
                        NineSlicePlugin.DefaultCfg
                    ],
                    scene: [
                        {
                            key: "DialogPlugin",
                            plugin: DialogPlugin,
                            mapping: "dialogPlugin",
                            start: true
                        },
                        {
                            key: 'HighlightPlugin',
                            plugin: HighlightPlugin,
                            mapping: 'highlightPlugin',
                            start: true
                        },
                        {
                            key: 'AnimatedTiles',
                            plugin: AnimatedTiles,
                            mapping: "animatedTiles",
                            start: true
                        }
                    ]
                },
                crisp: true
            };
            this._game = new Phaser.Game(config);

            this._scene = new Scene();
            this._game.scene.add("Scene", this._scene, false);
            this._game.events.on('launch', ()=>{
                this._game.scene
                    .remove("Preload")
                    .start("Scene", {
                        sections: levelModule.sections
                    });
            });
        }

        @Watch("sections")
        onChangeDefn() {
            if(this.sections && !this._game){
                // sections have loaded
                this.startGame();
            }
        }

        @Watch("enabled")
        onChangeEnabled() {
            this._scene.setEnabled(this.enabled);
        }

        @Watch("showGrid")
        onChangeShowGrid() {
            this._scene.showGrid(this.showGrid);
        }

        @Watch("info")
        onChangeDialog(){
            // listen to a change in the 'info' and show the right dialog
            if(this.info){
                this._scene.dialogPlugin.show(this.info, ()=>{
                    dialogModule.setInfo(null);
                });
            }
            else{
                this._scene.dialogPlugin.hide();
            }
        }

        @Watch("sectionProgress")
        onChangeSectionNum(newValue:SectionStatus, oldValue:SectionStatus) {
            // the pupil has progressed to the next section
            console.log(oldValue, "->", newValue);
            const newStatus = newValue.status;
            if(newStatus === SectionProgressType.COMPLETE){
                // the player moves to the next starting position
                this._scene.startFollow();
            }
            else if(newStatus === SectionProgressType.CODE){
                // the player must get the code correct in order to proceed
                const section:Section = progressModule.currentSection;
                this._scene
                    .stopFollow()
                    .setCameraToWaypoint();

            }
        }

    }
</script>
