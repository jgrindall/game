<template>
    <div>
        <div class='menu'>
            <img class="toolicon" data-type="new" @click="onClickNew()" />
            <img class="toolicon" data-type="open" @click="onClickLoad()"/>
            <img class="toolicon" data-type="save" @click="onClickSave()"/>
            <img class="toolicon" data-type="share"  />
        </div>

        <div class='left'>
        </div>

        <div class="center">
            <img class="toolicon" data-type="play" @click="onClickPlay()" />
        </div>

        <div class='right'>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch } from 'vue';

    export default defineComponent({
        mounted() {
            //
        },
        methods:{
            onClickNew(){
                //
            },
            onClickLoad(){
                //
            },
            onClickSave(){
                //
            },
            onClickPlay(){
                //
            }
        }
    })

</script>


