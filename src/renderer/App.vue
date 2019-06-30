<template>
  <div id="app">
    <one-header title="main"></one-header>
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
  import Header from '@/components/Header/index';
  import Slider from '@/components/Slider/index';
  export default {
    components: {
      [Slider.name]: Slider,
      [Header.name]: Header,
    },
    name: 'one-day',
  };
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
.one-wraper {
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  .one-slider {
    flex: 0 0 60px;
    background: #ddd;
    opacity: 0.7;
  }
  .one-container {
    flex: auto;
  }
}

</style>
