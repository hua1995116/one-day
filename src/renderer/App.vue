<template>
  <div id="app">
    <div class="one-wraper">
      <div class="one-slider">
        <one-slider></one-slider>
      </div>
      <div class="one-container">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
  import Slider from '@/components/Slider/index';
  export default {
    components: {
      [Slider.name]: Slider,
    },
    name: 'one-day',
  };
</script>

<style lang="scss">
#app {
  widows: 100%;
  height: 100%;
}
.one-wraper {
  width: 100%;
  height: 100%;
  display: flex;
  .one-slider {
    flex: 0 0 40px;
    background: #ddd;
  }
  .one-container {
    flex: auto;
  }
}

</style>
