<template>
  <div>
    <h2 class="detail-header">게시글 상세 정보</h2>
    <div class="box" v-if="id">
      <div v-if="isEditing">
        <input type="text" class="auto-resize-textarea box" v-model="editableTitle" />
      </div>
      <h3 class="detail-title box" v-else>제목: {{ title }}</h3>

      <div class="detail-meta box">
        <div class="meta-item">작성자: {{ author }}</div>
        <div class="meta-item">작성일: {{ date }}</div>
        <div class="meta-item">조회수: {{ views }}</div>
        <div class="meta-item">좋아요: {{ like }}</div>
      </div>

      <div v-if="isEditing">
        <textarea v-model="editableContent" @input="autoResize" class="auto-resize-textarea box"></textarea>
      </div>
      <p class="detail-content box" v-else>{{ content }}</p>

      <div class="button-group">
        <div class="left-buttons">
          <button v-if="!isEditing" @click="editBoard" class="action-button edit-button">수정</button>
          <button v-if="!isEditing" @click="deleteBoard" class="action-button delete-button">삭제</button>
          <button v-else @click="saveBoard" class="action-button save-button">저장</button>
          <button v-if="isEditing" @click="cancelEdit" class="action-button cancel-button">취소</button>
          <button @click="goBack" class="action-button back-button">뒤로가기</button>
        </div>
        <div class="right-buttons">
          <button v-if="!isEditing" @click="increaseLike" class="action-button like-button">좋아요</button>
          <button v-if="!isEditing" @click="decreaseLike" class="action-button dislike-button">싫어요</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>해당 게시글을 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import * as boardApi from '@/api/board';

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const id = ref(route.params.id);

    const isEditing = ref(false)
    const title = ref('');
    const content = ref('');
    const author = ref('');
    const date = ref('');
    const views = ref('');
    const like = ref('');
    const editableTitle = ref(title.value);
    const editableContent = ref(content.value);
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
    }
    onMounted(() => {
      boardApi.getDetail(id.value).then((res) => {
        var response = res.data;

        title.value = response.title;
        author.value = response.author;
        date.value = getDate(response.generatedAt);
        views.value = response.views;
        like.value = response.thumbsUp;
        content.value = response.contents;
      })
    });

    const increaseLike = () => {
      boardApi.updateData({
        "id": id.value,
        "action": "INCREASE",
        "target": "thumbsUp"
      }).then(() => {
        like.value = like.value + 1;
      })
    }
    const decreaseLike = () => {
      boardApi.updateData({
        "id": id.value,
        "action": "DECREASE",
        "target": "thumbsUp"
      }).then(() => {
        like.value = like.value - 1;
      })
    }


    const editBoard = () => {
      isEditing.value = true;
      editableTitle.value = title.value;
      editableContent.value = content.value;
    };

    const saveBoard = () => {
      title.value = editableTitle.value;
      content.value = editableContent.value;
      isEditing.value = false;
      boardApi.update({
        id: id.value,
        title: title.value,
        contents: content.value
      }).then((res) => {
        console.info(`JBJB update ${JSON.stringify(res.data)}`);
      })
    };
    const board = computed(() => store.getters.board.find((p) => p.id === id.value));

    const cancelEdit = () => {
      isEditing.value = false;
      editableTitle.value = title.value;
      editableContent.value = content.value;
    };
    const deleteBoard = () => {
      boardApi.deleteBoard(id.value).then((res) => {
        console.info(`JBJB delete result ${JSON.stringify(res.data)}`);
      })
      goBack();
    }
    const goBack = () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        route.push("/");
      }
    };
    return {
      editableTitle,
      editableContent,
      deleteBoard,
      editBoard,
      saveBoard,
      cancelEdit,
      isEditing,
      id,
      title,
      content,
      author,
      date,
      views,
      like,
      board,
      goBack,
      increaseLike,
      decreaseLike,
    };
  },
};
</script>

<style scoped>
.detail-container {
  max-width: 600px;
  margin: 0 auto;
}

.detail-header {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.box {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.detail-meta {
  display: flex;
  /* 수평 정렬 */
  justify-content: space-between;
  /* 요소 간 간격 균등 배분 */
  align-items: center;
  /* 세로 정렬 */
  gap: 20px;
  /* 요소 간 간격 */
  pointer-events: none;
  /* 마우스 이벤트 비활성화 */
}

.meta-item {
  flex: 1;
  /* 모든 요소가 동일한 너비를 가지도록 설정 */
  text-align: center;
  /* 텍스트 중앙 정렬 */
  font-size: 14px;
  /* 글씨 크기 */
  color: #555;
  /* 텍스트 색상 */
}

.detail-content {
  white-space: pre-line;
  /* 줄바꿈 유지 */
}

.auto-resize-textarea {
  width: 100%;
  min-height: 40px;
  resize: none;
  overflow: hidden;
  padding: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  /* 버튼을 좌우로 분리 */
  align-items: center;
  margin-top: 20px;
}

.left-buttons {
  display: flex;
  gap: 10px;
  /* 좌측 버튼 간 간격 */
}

.right-buttons {
  display: flex;
  gap: 10px;
  /* 우측 버튼 간 간격 */
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

/* 수정 버튼 스타일 */
.edit-button {
  background-color: #007bff;
  color: white;
}

.edit-button:hover {
  background-color: #0056b3;
}

/* 삭제 버튼 스타일 */
.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #b52a3b;
}

/* 저장 버튼 스타일 */
.save-button {
  background-color: #28a745;
  color: white;
}

.save-button:hover {
  background-color: #218838;
}

/* 취소 버튼 스타일 */
.cancel-button {
  background-color: #ffc107;
  color: white;
}

.cancel-button:hover {
  background-color: #e0a800;
}

/* 좋아요 버튼 스타일 */
.like-button {
  background-color: #17a2b8;
  color: white;
}

.like-button:hover {
  background-color: #138496;
}

/* 싫어요 버튼 스타일 */
.dislike-button {
  background-color: #6c757d;
  color: white;
}

.dislike-button:hover {
  background-color: #5a6268;
}

/* 뒤로가기 버튼 스타일 */
.back-button {
  background-color: #6f42c1;
  color: white;
}

.back-button:hover {
  background-color: #5936a2;
}
</style>