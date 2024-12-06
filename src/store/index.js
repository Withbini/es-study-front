import { createStore } from 'vuex';
function getDate(str) {
    let date = new Date(str)
    let strr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return strr
}
const store = createStore({
  state: {
    board: [],
    meta:{
        total:10,
        isLast:false,
        page:1,
    }
  },
  mutations: {
    clear(state) {
      state.board = [];
    },
    push(state, d) {
        state.board.push({ id: d.id, 
            title: d.title, 
            author: d.author,
            generatedAt: d.generatedAt,
            views: d.views,
            thumbup: d.thumbup,
            date: getDate(d.generatedAt)})
    },
    updateMeta(state ,m){
        state.meta.total = m.total
        state.meta.isLast = m.isLast
        state.meta.page=m.page
    }
  },
  actions: {
    push({ commit }, data) {
      commit('push', data);
    },
    clear({commit}){
        commit('clear');
    },
    updateMeta({commit},m){
        commit('updateMeta',m);
    }
  },
  getters: {
    board:(state)=>state.board,
    meta:(state)=>state.meta,
  },
});

export default store;