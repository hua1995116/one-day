<template>
  <div class="description">
    <div class="term">
      <slot name="term"></slot>
    </div>
    <div class="detail">
      <slot name="detail"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Description',
  components: {},
  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>
<style lang='scss'>
.description {
  display: table;

  .term {
    display: table-cell;
    margin-right: 8px;
    padding-bottom: 8px;
    white-space: nowrap;
    line-height: 20px;
  }

  .term:after {
    position: relative;
    top: -0.5px;
    margin: 0 8px 0 2px;
    content: "";
  }

  .detail {
    display: table-cell;
    padding-bottom: 8px;
    line-height: 20px;
    max-width: 240px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>