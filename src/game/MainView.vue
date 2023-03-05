<template>
    <div class="main">
        <the-tool-bar></the-tool-bar>
        <div>
            <canvas-view ref="canvasView"></canvas-view>
            
        </div>
    </div>
</template>
<script lang="ts">

    import CanvasView from "./game/CanvasView.vue";
    import CodeList from "./code/CodeList.vue";
    import TheToolBar from "./components/TheToolBar.vue";
    import Plant from "./elements/Plant";
    import Door from "./elements/Door";
    import Ladder from "./elements/Ladder";
    import Flower from "./elements/Flower";
    import LevelService from "./services/LevelService";
    import {useLevelStore} from "./store/LevelModule";
    import {useProgressStore} from "./store/ProgressModule";
    import Container from "./elements/Container";
    import Platform from "./elements/Platform";
    import { defineComponent } from 'vue';

    export default defineComponent({
        components: {
            canvasView:CanvasView,
            TheToolBar:TheToolBar
        },
        mounted(){
            this.loadProgress();
        },
        methods:{
            onReset(){
                (this.$refs["canvasView"] as typeof CanvasView).reset()
            },
            async loadProgress(){
                const service = new LevelService();
                const data = await service.load();
                useLevelStore().init(data.sections);
                useProgressStore().init(data.sectionProgress);
            }
        }
        
    })
</script>


