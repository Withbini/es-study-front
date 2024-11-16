<template>
  <div>
      <h2>게시글 상세 정보</h2>
      <p>게시글 ID: {{ id }}</p>
      <div class="box" v-if="board">
        <div v-if="isEditing">
          <input type="text" class="auto-resize-textarea box" v-model="editableTitle" placeholder="제목을 입력하세요" />
        </div>
        <h3 class="box" v-else>제목: {{ title }}</h3>

        <p class="box">작성자: {{ author }}</p>

        <div v-if="isEditing">
          <textarea v-model="editableContent" @input="autoResize" class="auto-resize-textarea box" placeholder="내용을 입력하세요"></textarea>
        </div>
        <p class="box" v-else>{{ content }}</p>

        <button class="box" v-if="!isEditing" @click="editBoard">수정</button>
        <button class="box" v-if="!isEditing" @click="deleteBoard">삭제</button>
        <button class="box" v-else @click="saveBoard">저장</button>
        <button class="box" v-if="isEditing" @click="cancelEdit">취소</button>
      </div>
      <div v-else>
        <p>해당 게시글을 찾을 수 없습니다.</p>
      </div>
  </div>
</template>
  
<script>
import { ref, onMounted,computed } from 'vue';
import { useRoute } from 'vue-router';
import {useStore} from 'vuex';
import * as boardApi from '@/api/board';
function getDate(str) {
    let date = new Date(str)
    let strr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return strr
}
export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const id = ref(route.params.id);

    const isEditing=ref(false)    
    const title = ref('');
    const content = ref('');
    const author = ref('');
    const date = ref('');
    const views = ref('');
    const thumbsUp = ref('');
    const editableTitle = ref(title.value);
    const editableContent = ref(content.value);
    onMounted(() => {
      console.info("게시물 ID:", id.value);
      // 여기서 id.value를 이용해 API 호출 등 필요한 작업을 수행할 수 있음
      boardApi.getDetail(id.value).then((res)=>{
        console.info(`BJJB ${res}`)
        var response=res.data;
        console.info(`JBJB response getDe:${JSON.stringify(response)}`)
        title.value = response.title;
        author.value = response.author;
        date.value = getDate(response.generatedAt);
        views.value = response.views;
        thumbsUp.value = response.thumbsUp;
        content.value = response.contents;
      })
    });

    
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
        id:id.value,
        title:title.value,
        contents:content.value
      }).then((res)=>{
        console.info(`JBJB update ${JSON.stringify(res.data)}`);
      })
    };
    const board= computed(()=>store.getters.board.find((p)=>p.id === id.value));

    const cancelEdit = () => {
      isEditing.value = false;
      editableTitle.value = title.value;
      editableContent.value = content.value;
    };
    const deleteBoard =()=>{
      boardApi.deleteBoard(id.value).then((res)=>{
        console.info(`JBJB delete result ${JSON.stringify(res.data)}`);
      })
      goBack();
    }
    const goBack = () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        route.push('/');
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
      views,
      thumbsUp,
      board
    };
  },
};
</script>

<style scoped>
/* 테두리 스타일 적용 */
.box {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.auto-resize-textarea {
  width: 100%;
  min-height: 40px; /* 최소 높이 설정 */
  resize: none; /* 사용자가 수동으로 크기 조정 못하도록 설정 */
  overflow: hidden; /* 스크롤바 숨기기 */
}
</style>