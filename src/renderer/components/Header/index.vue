<template>
  <div class="one-header">
    {{title}}
  </div>
</template>

<script>
export default {
  name: 'one-header',
  props: ['title'],
  components: {},
  data() {
    return {
    };
  },

  computed: {},

  mounted() {},

  methods: {},
};

</script>
<style lang='scss'>
.one-header {
  height: 40px;
  background: #04C4D9;
  opacity: 0.7;
  text-align: center;
  color: #fff;
  line-height: 40px;
  font-size: 18px;
}
</style>