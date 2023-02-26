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
    import { defineComponent, watch } from 'vue';

    export default defineComponent({
        methods:{
            startGame(){
                const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
                const context = new AudioContext();
                const canvas:HTMLCanvasElement = this.$refs["myCanvas"] as HTMLCanvasElement
                const config = {
                    type: Phaser.WEBGL,
                    scene: [
                        Preload
                    ],

                    canvas: canvas,
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
        },
        computed:{
            showGrid():boolean{
                return this.sectionProgress && this.sectionProgress.status === SectionProgressType.CODE;
            },
            enabled(): boolean{
                // when info is visible the game is frozen
                if(this.info || ( this.sectionProgress && this.sectionProgress.status === SectionProgressType.CODE)){
                return false;
                }
                return true;
            }.
            sectionProgress():SectionStatus{
                return progressModule.currentSectionStatus;
            },
            sectionIndex():number{
                return progressModule.currentSectionIndex;
            },
            sections():Section[]{
                return levelModule.sections;
            },
            info(): Info{
                return dialogModule.info;
            }
        },
        watch:{
            sections(){
                if(this.sections && !this._game){
                // sections have loaded
                this.startGame();
            }
            },
            enabled(){
                this._scene.setEnabled(this.enabled);
            },
            showGrid(){
                this._scene.showGrid(this.showGrid);
            },
            info(){
                f(this.info){
                this._scene.dialogPlugin.show(this.info, ()=>{
                    dialogModule.setInfo(null);
                });
            }
            else{
                this._scene.dialogPlugin.hide();
            }
            },
            sectionProgress(){
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
    })

</script>
