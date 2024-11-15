<template>
  <div>
      <h2>게시글 상세 정보</h2>
      <p>게시글 ID: {{ id }}</p>
      <div v-if="board">
        <h3>제목{{ board.title }}</h3>
        <p>작성자: {{ board.author }}</p>
        <p>{{ board.contents }}</p>
      </div>
      <div v-else>
        <p>해당 게시글을 찾을 수 없습니다.</p>
      </div>
  </div>
</template>
  
<script>
import { ref, computed,onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {useStore} from 'vuex';
export default {
  setup() {
    onMounted(() => {
      console.info("게시물 ID:", id.value);
      // 여기서 id.value를 이용해 API 호출 등 필요한 작업을 수행할 수 있음
    });
    const store = useStore();
    const route = useRoute(); // URL 파라미터를 가져오기 위해 useRoute 사용
    const id = ref(route.params.id); // URL의 id 파라미터를 ref로 저장
    const board = computed(() => store.getters.board.find((p) => p.id === id.value));
    

    return {
      id,
      board,
    };
  },
};
</script>