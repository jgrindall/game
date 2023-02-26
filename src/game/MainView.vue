<template>
    <div class="main">
        <toolbar></toolbar>
        <div>
            <canvas-view ref="canvasView"></canvas-view>
            <code-list @reset="onReset"></code-list>
        </div>
    </div>
</template>
<script lang="ts">

    import CanvasView from "./game/CanvasView.vue";
    import CodeList from "./code/CodeList.vue";
    import Toolbar from "./components/Toolbar.vue";
    import store from "./store/Store";
    import ElementManager from "./game/managers/ElementManager";
    import Plant from "./elements/Plant";
    import Door from "./elements/Door";
    import Ladder from "./elements/Ladder";
    import Flower from "./elements/Flower";
    import LevelService from "./services/LevelService";
    import levelModule from "./store/LevelModule";
    import progressModule from "./store/ProgressModule";
    import Container from "./elements/Container";
    import Platform from "./elements/Platform";
    import { defineComponent } from 'vue';

    export default defineComponent({
        components: {
            canvasView:CanvasView,
            toolbar:Toolbar,
            codeList:CodeList
        },
        mounted(){
            this.loadProgress();
        },
        methods:{
            onReset(){
                (this.$refs["canvasView"] as CanvasView).reset()
            },
            async loadProgress(){
                const service = new LevelService();
                const data = await service.load();
                levelModule.init(data.sections);
                progressModule.init(data.sectionProgress);
            }
        }
        
    })
</script>


