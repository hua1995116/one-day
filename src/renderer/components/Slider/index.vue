<template>
  <div>
    <ul>
      <li class="one-li" v-for="item in menus" :key="item.icon">
        <a-icon :type="item.icon" />
      </li>
    </ul>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue';
export default {
  name: 'one-slider',
  components: {
    [Icon.name]: Icon,
  },
  data() {
    return {
      menus: [
        {
          type: 'main',
          icon: 'menu-unfold',
        },
      ],
    };
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>
<style lang='scss'>
.one-li {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>