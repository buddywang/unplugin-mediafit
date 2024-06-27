<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import pcVideo from "./assets/video/pc.mp4";
import mobileVideo from "./assets/video/pc@fit:scale(w=750).mp4";
import cardPng from "./assets/image/card.png";
// todo 图片不同分辨率、不同格式 demo
import cardWebp from "./assets/image/card@fit:imgtf(f=webp).png";
console.log(333, cardWebp);
</script>

<template>
  <div class="video-container">
    <!-- todo 用source 写响应式 demo -->
    <video class="pc-video" autoplay muted :src="pcVideo"></video>
    <video class="mobile-video" autoplay muted :src="mobileVideo"></video>
  </div>
  <!-- todo 响应式图片demo -->
  <img class="image" :src="cardWebp" alt="" />
  <picture>
    <source
      srcset="landscape.png"
      media="(min-width: 1000px)"
      width="1000"
      height="400"
    />
    <source
      srcset="square.png"
      media="(min-width: 800px)"
      width="800"
      height="800"
    />
    <source
      srcset="portrait.png"
      media="(min-width: 600px)"
      width="600"
      height="800"
    />
    <img
      src="fallback.png"
      alt="当浏览器不支持来源时使用的图片"
      width="500"
      height="400"
    />
  </picture>
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
  width: 600px;
}
.mobile-video {
  width: 400px;
}
.image {
  width: 300px;
}
</style>
