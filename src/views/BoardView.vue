<template>
  <div>
    <!-- 게시판 테이블 -->
    <table>
      <thead>
        <tr>
          <th class="non-sortable">제목</th>
          <!-- <th @click="sortBy('author')">작성자</th> -->
          <th class="non-sortable">작성자</th>
          <th @click="sortBy('generatedAt')">작성일</th>
          <th @click="sortBy('views')">조회수</th>
          <th @click="sortBy('thumbsUp')">좋아요</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(board, index) in boards" :key="index" @click="navigateToDetail(board.id)" class="clickable-row">
          <!-- <td>
            <router-link :to="{ name: 'BoardDetail', params: { id: board.id } }" class="router-link">
              {{ board.title }}
            </router-link>
          </td> -->
          <td>{{ board.title }}</td>
          <td>{{ board.author }}</td>
          <td>{{ getDate(board.generatedAt) }}</td>
          <td>{{ board.views }}</td>
          <td>{{ board.thumbsUp }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <footer>
      <nav class="pagination">
        <button @click="goToPage(1)" :disabled="currentPage === 0">처음</button>
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 0">이전</button>

        <span v-for="page in pagesToShow" :key="page" :class="{ active: page === currentPage + 1 }"
          @click="goToPage(page)">
          {{ page }}
        </span>

        <button @click="goToPage(currentPage + 1)" :disabled="currentPage + 1 === totalPages">다음</button>
        <button @click="goToPage(totalPages)" :disabled="currentPage + 1 === totalPages">마지막</button>
      </nav>
    </footer>
    <div class="search-bar">
      <select v-model="searchType">
        <option value="TITLE">제목</option>
        <option value="TITLE_AND_CONTENT">제목 또는 내용</option>
        <option value="AUTHOR">작성자</option>
        <option value="CONTENT">내용</option>
      </select>
      <input v-model="keyword" type="text" placeholder="검색어를 입력하세요" />
      <button @click="search">검색</button>
    </div>
    <div>
      <router-link to="/create-board" class="create-button">
        생성
      </router-link>
    </div>
  </div>
</template>

<script>
import * as boardApi from '@/api/board';
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRouter();
    const boards = ref([]);

    const totalPages = ref(1);
    const currentPage = ref(0);
    const size = ref(20);
    const searchType = ref('TITLE');
    const isLast = ref(false);
    const sortField = ref("generatedAt");
    const sortOrder = ref("desc");
    const keyword = ref("");

    const print = () => {
      console.info("JBJB:", keyword.value, searchType.value, sortField.value, sortOrder.value, size.value, currentPage.value)
    }

    const getDate = (str) => {
      const date = new Date(str);

      const formatTwoDigits = (num) => String(num).padStart(2, "0");

      const year = date.getFullYear();
      const month = formatTwoDigits(date.getMonth() + 1);
      const day = formatTwoDigits(date.getDate());
      const hours = formatTwoDigits(date.getHours());
      const minutes = formatTwoDigits(date.getMinutes());
      const seconds = formatTwoDigits(date.getSeconds());

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const navigateToDetail = (id) => {
      console.info(`router :${id}`)
      route.push({ name: 'BoardDetail', params: { id: id } })
    }

    const get = () => {
      print()
      boardApi.get2({
        keyword: keyword.value,
        searchType: searchType.value,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
        size: size.value,
        page: currentPage.value
      }).then((response) => {
        console.info(response.data)

        if (response.data.data.length == 0) {
          alert("데이터가 존재하지 않습니다.")
          return
        }
        boards.value = response.data.data;
        totalPages.value = response.data.meta.total;
        size.value = response.data.meta.size;
        isLast.value = response.data.meta.isLast;
        currentPage.value = response.data.meta.page;
      })
    }

    const search = () => {
      currentPage.value = 0; // 검색 시 첫 페이지로 초기화
      get();
    };

    // 페이지네이션 계산
    const pagesToShow = computed(() => {
      const start = Math.max(currentPage.value + 1 - 5, 1);
      const end = Math.min(currentPage.value + 1 + 5, totalPages.value);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });

    // 페이지 변경
    const goToPage = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages.value) {
        currentPage.value = newPage - 1;
        get();
      }
    };

    //정렬 변경
    const sortBy = (field) => {
      if (sortField.value === field) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortField.value = field;
        sortOrder.value = "desc"; // 기본 내림
      }
      get();
    };

    onMounted(() => {
      get();
    })

    return {
      boards,
      totalPages,
      pagesToShow,
      goToPage,
      sortBy,
      get,
      search,
      getDate,
      currentPage,
      keyword,
      searchType,
      navigateToDetail
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

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

th:hover {
  background-color: #f5f5f5;
}

.non-sortable {
  cursor: default;
  pointer-events: none;
  /* 클릭 이벤트 비활성화 */
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

/* 검색창 스타일 */
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  /* 요소 간의 간격 */
  margin: 20px 0;
  /* 검색창 상하 여백 */
}

.search-bar input[type="text"] {
  padding: 10px;
  width: 200px;
  /* 입력창 너비 */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-bar input[type="text"]:focus {
  border-color: #007bff;
  outline: none;
}

.search-bar select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  background-color: white;
  transition: border-color 0.3s;
}

.search-bar select:focus {
  border-color: #007bff;
  outline: none;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.search-bar button:active {
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.2);
}

.create-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-button:hover {
  background-color: #0056b3;
}

.router-link {
  text-decoration: none;
  /* 밑줄 제거 */
  color: inherit;
  /* 텍스트 색상 상속 */
  cursor: pointer;
  /* 클릭 가능한 링크처럼 보이게 설정 */
}

.router-link:hover {
  text-decoration: underline;
  /* 마우스 오버 시 밑줄 표시 (선택 사항) */
  color: #007bff;
  /* 마우스 오버 시 색상 변경 */
}

.clickable-row {
  cursor: pointer;
  /* 클릭 가능하게 보이는 커서 */
  transition: background-color 0.3s;
  /* 배경색 변경 애니메이션 */
}

.clickable-row:hover {
  background-color: #f5f5f5;
  /* 호버 시 배경색 변경 */
}
</style>