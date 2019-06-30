const state = {
  configLabel: [{
    id: 1,
    value: '任务',
    color: 'red',
  }, {
    id: 2,
    value: '链接',
    color: '#044BD9',
  }],
};

const mutations = {
  setConfigLabel(state, data) {
    state.configLabel = data;
  },
  delConfigLabel() {
  },
};

const actions = {
  someAsyncTask({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER');
  },
};

export default {
  state,
  mutations,
  actions,
};
