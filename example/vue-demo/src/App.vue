<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import pcVideo from "./assets/video/pc.mp4";
import mobileVideo from "./assets/video/pc@fit:scale(w=300&h=200).mp4";
</script>

<template>
  <div class="video-container">
    <video class="pc-video" autoplay muted :src="pcVideo"></video>
    <video class="mobile-video" autoplay muted :src="mobileVideo"></video>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.video-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.pc-video {
  flex-grow: 2;
  width: 600px;
}
.mobile-video {
  flex-grow: 1;
  width: 400px;
}
</style>
