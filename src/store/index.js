import { createStore } from 'vuex';
import * as boardApi from '@/api/board';

const store = createStore({
  state: {
    totalViews: 0,
    totalLikes: 0,
    boards: [],
  },
  mutations: {
    setBoards(state, boards) {
      state.boards = boards;
    },
    // 총 조회수와 좋아요 수를 초기화
    setSummary(state, { totalViews, totalLikes }) {
      state.totalViews = totalViews;
      state.totalLikes = totalLikes;
    },
    setSummaryViews(state, { totalViews }) {
      state.totalViews = totalViews;
    },
    setSummaryLikes(state, { totalLikes }) {
      state.totalLikes = totalLikes;
    },
    incrementLikes(state, boardId) {
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.thumbsUp += 1;
        state.totalLikes += 1;
      }
    },
    decrementLikes(state, boardId) {
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.thumbsUp -= 1;
        state.totalLikes -= 1;
      }
    },

  },
  actions: {
    updateBoard({ commit }, boards) {
      commit("setBoards", boards)
    },
    // Summary를 설정하는 액션
    setSummary({ commit }, summaryData) {
      commit("setSummary", summaryData);
    },
    // Summary를 업데이트하는 액션
    updateSummary({ commit }, updateData) {
      commit("updateSummary", updateData);
    },
    async fetchTotalViews({ commit }) {
      boardApi.getSummary("views").then((res) => {
        console.info(`JBJB fetchTotalViews :${JSON.stringify(res.data)}`)
        commit("setSummaryViews", {
          totalViews: res.data,
        });
      })
    },
    async fetchTotalLikes({ commit }) {
      boardApi.getSummary("thumbsUp").then((res) => {
        console.info(`JBJB fetchTotalLikes :${JSON.stringify(res.data)}`)
        commit("setSummaryLikes", {
          totalLikes: res.data,
        });
      })
    },

  },
  getters: {
    // 총 조회수 가져오기
    getTotalViews: (state) => state.totalViews,
    // 총 좋아요 수 가져오기
    getTotalLikes: (state) => state.totalLikes,
  },
});

export default store;