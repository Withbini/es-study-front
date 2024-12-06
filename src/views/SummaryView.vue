<template>
    <div class="summary-sidebar">
        <h3>게시판 요약</h3>
        <p>총 조회수: <span>{{ totalViews }}</span></p>
        <p>총 좋아요 수: <span>{{ totalLikes }}</span></p>
    </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from "vuex";
export default {
    setup() {
        const store = useStore();

        const totalViews = computed(() => store.getters.getTotalViews);
        const totalLikes = computed(() => store.getters.getTotalLikes);

        const updateTotalLikes = async () => {
            await store.dispatch("fetchTotalLikes");
        };
        const updateTotalViews = async () => {
            await store.dispatch("fetchTotalViews");
        };
        onMounted(() => {
            updateTotalViews()
            updateTotalLikes()
        });
        return {
            totalViews,
            totalLikes,
        };
    },
};
</script>

<style scoped>
.summary-sidebar {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 200px;
}

.summary-sidebar h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.summary-sidebar p {
    font-size: 14px;
    margin: 5px 0;
}

.summary-sidebar span {
    font-weight: bold;
    color: #007bff;
}
</style>