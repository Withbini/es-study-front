<template>
    <div>
      <!-- 게시판 테이블 -->
      <table>
        <thead>
          <tr>
            <th @click="sortBy('title')">제목</th>
            <th @click="sortBy('author')">작성자</th>
            <th @click="sortBy('date')">작성일</th>
            <th @click="sortBy('views')">조회수</th>
            <th @click="sortBy('thumbsUp')">좋아요</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(board, index) in paginatedPosts" :key="index">
            <td>{{ board.title }}</td>
            <td>{{ board.author }}</td>
            <td>{{ board.generatedAt }}</td>
            <td>{{ board.views }}</td>
            <td>{{ board.thumbsUp }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- 페이지네이션 -->
      <footer>
        <nav class="pagination">
          <button @click="goToPage(1)" :disabled="currentPage === 1">처음</button>
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
  
          <span
            v-for="page in pagesToShow"
            :key="page"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </span>
  
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
          <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">마지막</button>
        </nav>
      </footer>
    </div>
  </template>
  
  <script>
import * as boardApi from '@/api/board';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onMounted, computed, ref} from 'vue';
  
  export default {
    setup() {
        onMounted(()=>{
            console.info("JBJB mount clear 전")
            store.commit('clear')
            get("","","","",10,1)
            console.info("JBJB mount clear 후")
        })
      // 게시글 데이터
      const boards = ref([
        { title: '첫 번째 게시글', author: '작성자1', date: '2024-11-01', views: 150, likes: 12 },
        { title: '두 번째 게시글', author: '작성자2', date: '2024-11-05', views: 200, likes: 50 },
        { title: '세 번째 게시글', author: '작성자3', date: '2024-11-03', views: 100, likes: 20 },
        { title: '네 번째 게시글', author: '작성자4', date: '2024-11-07', views: 180, likes: 40 },
        { title: '다섯 번째 게시글', author: '작성자5', date: '2024-11-06', views: 250, likes: 70 },
        // ... 추가 데이터
      ]);

      const store = useStore();
        const router = useRouter()
        const searchOption = ref('all');
        const searchData=ref('');
        const get = (keyword, searchType, sortField, sortOrder, size, page) => {
            boardApi.get(keyword, searchType, sortField, sortOrder, size, page).then((res) => {
                console.info(res.data)
                let boards = res.data.data
                if(res.data.data.length ==0) return
                boards.forEach((d) => {
                    store.commit('push', d)
                })

                store.commit('updateMeta',res.data.meta)
            })
        }
  
      // 상태 관리
      const currentPage = ref(store.getters.board.meta);
      const rowsPerPage = ref(5); // 페이지당 게시글 수
      const sortKey = ref('');
      const sortAsc = ref(true);
  
      // 계산 속성: 전체 페이지 수
      const totalPages = computed(() => Math.ceil(boards.value.length / rowsPerPage.value));
  
      // 계산 속성: 현재 페이지의 게시글
      const paginatedPosts = ref(store.getters.board)
  
      // 계산 속성: 정렬된 게시글
      const sortedPosts = ref(store.getters.board)
  
      // 계산 속성: 페이지네이션 범위
      const pagesToShow = computed(() => {
        const start = Math.max(currentPage.value - 5, 1);
        const end = Math.min(currentPage.value + 5, totalPages.value);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      });
  
      // 메서드: 페이지 이동
      const goToPage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
          currentPage.value = page;
        }
      };
  
      // 메서드: 정렬
      const sortBy = (key) => {
        if (sortKey.value === key) {
          sortAsc.value = !sortAsc.value; // 같은 키로 정렬 시 방향 전환
        } else {
          sortKey.value = key;
          sortAsc.value = true; // 새 키 정렬 시 기본 오름차순
        }
      };
  
      return {
        boards,
        currentPage,
        rowsPerPage,
        totalPages,
        paginatedPosts,
        pagesToShow,
        goToPage,
        sortBy,
        get,
      };
    },
  };
  </script>
  
  <style>
  /* 테이블 스타일 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
    cursor: pointer;
  }
  th:hover {
    background-color: #f5f5f5;
  }
  
  /* 페이지네이션 스타일 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
  }
  button {
    padding: 5px 10px;
    cursor: pointer;
    border: 1px solid #ccc;
    background-color: white;
    border-radius: 4px;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  span {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  span.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
  span:hover {
    background-color: #e0e0e0;
  }
  </style>
  