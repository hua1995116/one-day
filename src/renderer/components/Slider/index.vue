<template>
  <div class="slider-wraper">
    <ul>
      <li class="one-li" v-for="item in menus" :key="item.icon" :class="{'actived': item.isActive}" @click="handleRouter(item)">
        <a-icon :type="item.icon" />
      </li>
    </ul>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue';
import _ from 'lodash';
export default {
  name: 'one-slider',
  components: {
    [Icon.name]: Icon,
  },
  data() {
    return {
      menus: [
        {
          type: '/',
          icon: 'menu-unfold',
          isActive: true,
        },
        {
          type: '/labelconfig',
          icon: 'bg-colors',
          isActive: false,
        },
      ],
    };
  },

  computed: {},

  mounted() {},

  methods: {
    handleRouter(e) {
      console.log(e);
      const activeKey = _.findIndex(this.menus, { isActive: true });
      this.menus[activeKey].isActive = false;
      const key = _.findIndex(this.menus, { type: e.type });
      this.menus[key].isActive = true;
      this.$router.push(e.type);
    },
  },
};
</script>
<style lang='scss'>
.slider-wraper {

}
.one-li {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &.actived {
    background: rgba(255, 255, 255, 0.55);
    // background: rgba(0,0,0,0.1);
    // color: #fff;
  }
}
</style>