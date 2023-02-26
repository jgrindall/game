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

    import {Component, Ref, Vue} from 'vue-property-decorator';

    import CanvasView from "./game/CanvasView.vue";
    import CodeList from "./code/CodeList.vue";
    import Toolbar from "./components/Toolbar.vue";
    import store from "./store/Store";
    import ElementManager from "./game/managers/ElementManager";
    import Sprite from "../../pip/elements/Sprite";
    import Plant from "./elements/Plant";
    import Door from "./elements/Door";
    import Ladder from "./elements/Ladder";
    import Flower from "./elements/Flower";
    import LevelService from "./services/LevelService";
    import Background from "../../pip/elements/Background";
    import levelModule from "./store/LevelModule";
    import progressModule from "./store/ProgressModule";
    import { config } from 'vuex-module-decorators'
    import Container from "./elements/Container";
    import Platform from "./elements/Platform";

    const SkulptOptions = require("../../pip/code/SkulptOptions");
    config.rawError = true;

    Vue.prototype.Sk = window.Sk;

    window.Sk.elementManager = new ElementManager({
        mapping: {
            [window.Sk.ELEMENT_TYPE_SPRITE]:Sprite,
            [window.Sk.ELEMENT_TYPE_BACKGROUND]: Background,
            [window.Sk.ELEMENT_TYPE_PLANT]: Plant,
            [window.Sk.ELEMENT_TYPE_PLATFORM]: Platform,
            [window.Sk.ELEMENT_TYPE_DOOR]: Door,
            [window.Sk.ELEMENT_TYPE_CONTAINER]: Container,
            [window.Sk.ELEMENT_TYPE_LADDER]: Ladder,
            [window.Sk.ELEMENT_TYPE_FLOWER]: Flower
        }
    });

    @Component({
        components: {
            canvasView:CanvasView,
            toolbar:Toolbar,
            codeList:CodeList
        }
    })
    export default class MainView extends Vue {
        private store = store;

        @Ref('canvasView')
        readonly canvasView!: CanvasView;

        onReset(){
            (this.canvasView as CanvasView).reset();
        }

        async loadProgress(){
            const service = new LevelService();
            const data = await service.load();
            levelModule.init(data.sections);
            progressModule.init(data.sectionProgress);
        }

        async mounted(){
            SkulptOptions.setup();
            this.loadProgress();
        }

    }
</script>


