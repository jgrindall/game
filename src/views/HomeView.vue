<template>
  <div class="home">
    <MainView></MainView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainView from "../game/MainView.vue"

export default defineComponent({
  name: 'HomeView',
  components: {
    MainView
  }
});

</script>
