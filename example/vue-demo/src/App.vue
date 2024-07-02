<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
// 响应式视频
import pcVideo from "./assets/video/pc.mp4";
import mobileVideo from "./assets/video/pc@fit:scale(w=750).mp4";
// 响应式图片
// 参考https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
import cardPng from "./assets/image/card.png";
import cardWebp from "./assets/image/card@fit:imgtf(f=webp).png";
import cardAvif from "./assets/image/card@fit:imgtf(f=avif).png";
import cardJpeg from "./assets/image/card@fit:imgtf(f=jpeg).png";
console.log(33444, cardAvif);
</script>

<template>
  <!-- 当视口宽度小于600px时 用 mobileVideo， 否则用 pcVideo，不支持video时显示 video not support-->
  <video controls autoplay muted>
    <source :src="mobileVideo" media="(max-width: 600px)" />
    <source :src="pcVideo" />
    video not support
  </video>
  <!-- 响应式图片：按浏览器支持优先选择 avif > webp > jpeg > png -->
  <picture>
    <source :srcset="cardAvif" type="image/avif" />
    <source :srcset="cardWebp" type="image/webp" />
    <source :srcset="cardJpeg" type="image/jpeg" />
    <img class="img" :src="cardPng" alt="demo" />
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
video {
  width: 100%;
}
.img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
