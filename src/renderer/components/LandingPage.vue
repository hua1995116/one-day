<template>
  <div id="wrapper">
    <main>
      <div class="pm-body-wrapper">
        <div class="field">
          <input type="text" v-model="value" placeholder="What's your todos?" id="input" @keyup.enter="handleTodo"/>
          <div class="line"></div>
        </div>
        <ul class="ct-task-list">
          <li  v-for="item in todos" :key="item.id" :class="[item.isChecked ? 'ct-task-li-checked' : 'ct-task-li' ]">
            <span @click="handleCheck(item)" class="task-check"></span>
            <span class="task-value">{{item.value}}</span>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation';
  import uuid from '../utils/index';
  import db from '../../data/index';

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data() {
      return {
        value: '',
        todos: db.get('data').value(),
        isOpera: false,
      };
    },
    mounted() {
      // console.log(db.has('data').value());
    },
    methods: {
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
      handleTodo() {
        const todo = {
          id: uuid(),
          value: this.value,
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

<style>
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

  .pm-body-wrapper {
      min-width: 300px;
      width: 80%;
      margin: 0 auto;
  }

  .pm-body-wrapper ul {
      margin: 8px 0;
      padding-left: 24px;
  }

  .ct-task-list .ct-task-li {
      position: relative;
      list-style-type: none!important;
      min-height: 24px;
      font-size: 14px;
  }

  .ct-task-list .ct-task-li-checked {
      color: #838383;
      position: relative;
      list-style-type: none!important;
      min-height: 24px;
      font-size: 14px;
  }

  .ct-task-list .ct-task-li .task-check{
      content: "";
      position: absolute;
      top: 3px;
      left: -21px;
      height: 17px;
      width: 17px;
      border-radius: 1px;
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h16v16H0V0zm1 1v14h14V1H1z' fill='%236E6B6B' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat 50%;
  }

  .ct-task-list .ct-task-li-checked .task-check {
      content: "";
      position: absolute;
      top: 3px;
      left: -21px;
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
