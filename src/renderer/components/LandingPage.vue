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
            <div class="ct-task-outer"
              @mousemove.capture="handleMousemove" @mouseleave.capture="handleMouseleave">
              <div class="ct-task-context">
                <span @click="handleCheck(item)" class="task-check"></span>
                <!-- <span class="task-value">{{item.value}}</span> -->
                <div class="task-value" @click="handleSetting(item)">
                  <a-textarea class="task-textarea" v-on:click.stop="doThis" @change="handleChangeValue($event, item)"  :value="item.value" placeholder="Autosize height with minimum and maximum number of lines" :autosize="{ minRows: 1, maxRows: 6 }" />
                  <span class="task-setting">
                    <!-- <a-icon type="edit" /> -->
                    <span class="task-label-block" :style="{ background: item.label && item.label.color }"></span>
                    <span>{{item.label && item.label.value}}</span>
                  </span>
                </div>
              </div>
              <span class="task-del" @click="handleDel(item)">
                <span class="icon-shanchu iconfont icon"></span>
                <span class="task-del-text">Delete</span>
              </span>
            </div>
          </li>
        </ul>
        <a-drawer
          title="设置"
          placement="right"
          :closable="false"
          @close="onClose"
          :visible="visible"
        >
          <Description>
            <a-icon type="bell" slot="term"/>
            <div slot="detail">
              <a-date-picker
                :defaultValue="getTagetBell"
                class="task-bell"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="通知我"
                @change="onChangeBell"
                @ok="onOk"
                suffixIcon=" "
              />
            </div>
          </Description>
          <Description>
            <a-icon type="schedule" slot="term"/>
          </Description>
          <Description>
            <a-icon type="tags" slot="term"/>
            <div slot="detail">
              <a-select
                :defaultValue="targetTodo.label"
                showSearch
                placeholder="选择标签"
                optionFilterProp="children"
                style="width: 200px"
                @change="handleLabel"
              >
                <a-select-option v-for="item in configLabel" :key="item.value" :value="item.value">
                  <span class="task-label-block" :style="{ background: item.color }"></span>
                  <span>{{item.value}}</span>
                </a-select-option>
              </a-select>
            </div>
          </Description>
        </a-drawer>
      </div>
    </main>
  </div>
</template>

<script>
  import { Input, Icon, Dropdown, Menu, Drawer, DatePicker, Select } from 'ant-design-vue';
  import moment from 'moment';
  import Description from './Description/index';
  import uuid from '../utils/index';
  import db from '../../data/index';
  import getCliboard from '../opera/index';
  import url from '../api/api';
  const notifier = require('electron-notifications');
  const { ipcRenderer, remote } = require('electron');
  const { Menu: EMenu, MenuItem, BrowserWindow } = remote;

  let win;
  const menu = new EMenu();
  menu.append(new MenuItem({
    label: 'MenuItem1',
    click() {
      console.log('item 1 clicked');
      win = new BrowserWindow({
        width: 300,
        height: 200,
        frame: false, // 是否带工具栏
      });
      win.on('close', () => {
        win = null;
      });
    },
    submenu: [
      {
        role: 'startspeaking',
        type: 'normal',
      },
      { role: 'stopspeaking' },
    ],
  }));
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));
  let cacheLast = '';

  export default {
    name: 'landing-page',
    components: {
      [Input.TextArea.name]: Input.TextArea,
      [Icon.name]: Icon,
      [Dropdown.name]: Dropdown,
      [Menu.name]: Menu,
      [Menu.Item.name]: Menu.Item,
      [Menu.SubMenu.name]: Menu.SubMenu,
      [Drawer.name]: Drawer,
      [Description.name]: Description,
      [DatePicker.name]: DatePicker,
      [Select.name]: Select,
      [Select.Option.name]: Select.Option,
    },
    data() {
      return {
        visible: false,
        value: '',
        todos: db.get('data').value(),
        isOpera: false,
        isCliboard: false,
        isNotify: false,
        targetTodo: {},
        configLabel: [{
          value: '任务',
          color: 'red',
        }, {
          value: '链接',
          color: '#044BD9',
        }],
      };
    },
    mounted() {
      console.log(this.todos);
      const that = this;
      ipcRenderer.on('main-process-messages', () => {
        console.log(getCliboard());
        if (getCliboard() !== cacheLast && getCliboard() !== '' && this.isCliboard) {
          cacheLast = getCliboard();
          this.$confirm({
            title: '要将以下添加到日程吗?',
            content: cacheLast,
            async onOk() {
              if (/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(cacheLast)) {
                const result = await url.getTitle({
                  url: cacheLast,
                });
                if (result.code === 0) {
                  const { title } = result;
                  that.handleTodo(null, `${title}\r\n${cacheLast}`);
                }
              } else {
                that.handleTodo(null, cacheLast);
              }
            },
            onCancel() {},
          });
        }
      });
      if (this.isNotify) {
        const notification = notifier.notify('Calendar', {
          message: 'Event begins in 10 minutes',
          icon: 'https://i.loli.net/2019/06/23/5d0f83c70938994932.png',
          buttons: ['Dismiss', 'Snooze'],
        });
        notification.on('buttonClicked', (text, buttonIndex, options) => {
          if (text === 'Snooze') {
            // Snooze!
            console.log('继续');
          } else if (buttonIndex === 1) {
            console.log(options.url);
          }
          notification.close();
        });
      }
    },
    computed: {
      getTagetBell() {
        return this.targetTodo.bell ? moment(this.targetTodo.bell) : moment(new Date());
      },
    },
    methods: {
      handleLabel(e) {
        console.log(e.target.value);
      },
      onChangeBell(date, dateString) {
        const { id } = this.targetTodo;
        this.todos[id].bell = dateString;
        this.syncdata();
      },
      onOk() {

      },
      doThis() {
        console.log(1);
      },
      onClose() {
        this.visible = false;
      },
      handleSetting(item) {
        this.visible = true;
        this.targetTodo = item;
        console.log(item);
      },
      handleDel(item) {
        this.$confirm({
          title: '提示',
          content: '确认删除吗？',
          iconType: 'exclamation-circle',
          onOk: () => {
            const curData = this.todos;
            delete curData[item.id];
            this.todos = {
              ...curData,
            };
            this.syncdata();
          },
          onCancel() {},
        });
      },
      handleChangeValue(e, item) {
        console.log(e.target.value);
        console.log(e, item);
        this.todos[item.id].value = e.target.value;
      },
      handleMousemove(e) {
        const { target } = e;
        if (target.className.includes('task-textarea')) {
          const outer = target.parentNode.parentNode.parentNode;
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
      handleTodo(e, value) {
        const todo = {
          id: uuid(),
          value: value || this.value,
          isChecked: false,
          bell: null,
          label: this.configLabel[0],
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

<style lang="scss" src="./home.scss"></style>
