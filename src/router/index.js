import { createRouter, createWebHistory } from 'vue-router'
import BoardView from '../views/BoardView.vue'
import BoardDetail from '@/views/BoardDetail.vue';

const routes = [
    { path: '/', component: BoardView, },

    { path: '/board', component: BoardView, },
    { path: '/board/detail/:id', name: "BoardDetail", component: BoardDetail },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router