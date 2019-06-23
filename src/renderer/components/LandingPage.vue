<template>
  <div id="wrapper">
    <main>
      <div class="pm-body-wrapper">
        <div class="field">
          <input type="text" v-model="value" placeholder="What's your todos?" id="input" @keyup.enter="handleTodo"/>
          <div class="line"></div>
        </div>
        <ul class="ct-task-list">
          <li v-for="item in todos" :key="item.id" :class="[item.isChecked ? 'ct-task-li-checked' : 'ct-task-li' ]" class="ct-task one-line" >
            <div class="ct-task-outer" @mousemove.capture="handleMousemove" @mouseleave.capture="handleMouseleave">
              <div class="ct-task-context">
                <span @click="handleCheck(item)" class="task-check"></span>
                <!-- <span class="task-value">{{item.value}}</span> -->
                <a-textarea @change="handleChangeValue($event, item)" class="task-value" :value="item.value" placeholder="Autosize height with minimum and maximum number of lines" :autosize="{ minRows: 2, maxRows: 6 }" />
              </div>
              <span class="task-del">
                <span class="icon-shanchu iconfont icon"></span>
                <span class="task-del-text">Delete</span>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
  import { Input } from 'ant-design-vue';
  import uuid from '../utils/index';
  import db from '../../data/index';
  import getCliboard from '../opera/index';
  const { ipcRenderer } = require('electron');
  let cacheLast = '';

  export default {
    name: 'landing-page',
    components: {
      [Input.TextArea.name]: Input.TextArea,
    },
    data() {
      return {
        value: '',
        todos: db.get('data').value(),
        isOpera: false,
      };
    },
    mounted() {
      const that = this;
      ipcRenderer.on('main-process-messages', () => {
        console.log(getCliboard());
        if (getCliboard() !== cacheLast && getCliboard() !== '') {
          cacheLast = getCliboard();
          this.$confirm({
            title: '要将以下添加到日程吗?',
            content: cacheLast,
            onOk() {
              that.handleTodo(cacheLast);
            },
            onCancel() {},
          });
        }
      });
    },
    methods: {
      handleChangeValue(e, item) {
        console.log(e.target.value);
        console.log(e, item);
        this.todos[item.id].value = e.target.value;
      },
      handleMousemove(e) {
        const { target } = e;
        // console.log(1, target.className.includes('ct-task'), target);
        if (target.className.includes('task-value')) {
          const outer = target.parentNode.parentNode;
          const taskLi = outer.parentNode;
          const bounding = taskLi.getBoundingClientRect();
          const { right } = bounding;
          if (right - e.clientX < 50) {
            // console.log(target.className);
            if (!outer.className.includes('move')) {
              outer.classList.add('move');
            }
          }
        }
        e.stopPropagation();
      },
      handleMouseleave(e) {
        const { target } = e;
        if (target.className.includes('move')) {
          target.classList.remove('move');
        }
        e.stopPropagation();
      },
      handleCheck(item) {
        const oldValue = this.todos[item.id].isChecked;
        this.todos[item.id].isChecked = !oldValue;
        this.syncdata();
      },
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      syncdata() {
        setTimeout(() => {
          if (!this.isOpera) {
            this.isOpera = true;
            db.set('data', this.todos)
              .write();
            this.isOpera = false;
          }
        }, 50);
      },
      handleTodo(value) {
        const todo = {
          id: uuid(),
          value: value || this.value,
          isChecked: false,
        };
        this.todos = {
          ...(this.todos),
          [todo.id]: todo,
        };
        this.value = '';
        this.syncdata();
      },
    },
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    line-height: 1.5;
  }
  * {
      box-sizing: border-box;
      font-family: __SYMBOL,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
      font-variant-ligatures: none;
      font-variant-numeric: tabular-nums;
  }
  *, :after, :before {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
  }
  .clear:after {
    content: '';
    clear: both;
    height: 0;
    display: block;
  }

  .one-line:after {
    content: '';
    height: 1px;
    // transform: scale(0.5);
    width: 100%;
    background: #ddd;
    display: block;
  }

  .pm-body-wrapper {
      min-width: 300px;
      width: 80%;
      margin: 0 auto;
  }

  .pm-body-wrapper ul {
      margin: 8px 0;
  }

  .ct-task-list {
    .ct-task-li-checked {
      .task-value {
        color: #838383;
      }
    }
  }

  .ct-task {
    overflow: hidden;
    position: relative;
    min-height: 40px;
    box-sizing: border-box;
    position: relative;
    list-style-type: none!important;
    font-size: 14px;
    .ct-task-outer {
      width: 110%;
      display: flex;
      padding: 5px 0;
      transition: transform 0.125s;
      &.move {
        transform: translate3d(-10%, 0, 0);
      }
      .ct-task-context {
        flex: 1;
        min-height: 40px;
        display: flex;
        margin-right: 10px;
        .task-check {
          flex-basis: 25px;
        }
        .task-value {
          border: none;
          flex: 1;
        }
      }
      .task-del {
        min-height: 40px;
        display: flex;
        flex-basis: 35px;
        background: #ff3a31;
        color: #fff;
        font-size: 13px;
        text-align: center;
        transition: all 0.5s;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .icon {
          display: block;
          height: 15px;
          font-size: 13px;
          color: #fff;
        }
        &:hover {
          flex-basis: 55px;
          .task-del-text {
            display: block;
            animation-name: moveup;
            animation-duration: 0.375s;
          }
        }
        .task-del-text {
          transition: all 0.25s;
          font-size: 12px;
          display: none;
          opacity: 1;
        }
      }
    }
  }

  @keyframes moveup{
    0%{
      opacity: 0;
      transform: translate(0, 5px);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

  .ct-task-list .ct-task-li .task-check{
      height: 17px;
      width: 17px;
      border-radius: 1px;
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h16v16H0V0zm1 1v14h14V1H1z' fill='%236E6B6B' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat 50%;
  }

  .ct-task-list .ct-task-li-checked .task-check {
      height: 17px;
      width: 17px;
      border-radius: 1px;
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0v1H1v14h14V7h1v9H0V0h12zM6.908 9.728l7.385-7.385a1 1 0 0 1 1.414 1.414l-8.071 8.071c-.2.201-.465.299-.728.293a.997.997 0 0 1-.728-.293L2.938 8.586a1 1 0 0 1 1.414-1.414l2.556 2.556z' fill='%23AAA' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat 50%;
  }

  input {
    background: 0;
    border: 0;
    outline: none;
    width: 100%;
    font-size: 1.5em;
    transition: padding 0.3s 0.2s ease;
    text-align: center;
  }
  input:focus {
    padding-bottom: 5px;
  }
  input:focus + .line:after {
    -webkit-transform: scaleX(1);
            transform: scaleX(1);
  }
  .field {
    position: relative;
  }
  .field .line {
    width: 100%;
    height: 3px;
    position: absolute;
    bottom: -8px;
    background: #bdc3c7;
  }
  .field .line:after {
    content: " ";
    position: absolute;
    float: right;
    width: 100%;
    height: 3px;
    -webkit-transform: scalex(0);
            transform: scalex(0);
    transition: -webkit-transform 0.3s ease;
    transition: transform 0.3s ease;
    transition: transform 0.3s ease, -webkit-transform 0.3s ease;
    background: #1abc9c;
  }



</style>
