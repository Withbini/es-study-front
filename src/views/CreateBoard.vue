<template>
    <div class="create-board-page">
        <h1>게시판 생성</h1>
        <form @submit.prevent="createBoard">
            <div class="form-group">
                <label for="title">게시판 제목</label>
                <input id="title" type="text" v-model="title" placeholder="게시판 제목을 입력하세요" />
                <input id="author" type="text" v-model="author" placeholder="작성자 이름을 입력하세요" />
            </div>
            <div class="form-group">
                <label for="content">게시판 내용</label>
                <textarea id="content" v-model="content" placeholder="게시판 내용을 입력하세요"></textarea>
            </div>
            <button type="submit" class="create-button">생성</button>
            <router-link to="/">
                <button type="button" class="back-button">뒤로가기</button>
            </router-link>
        </form>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as boardApi from "@/api/board";

export default {
    setup() {
        // 상태 관리
        const title = ref("");
        const content = ref("");
        const author = ref("");
        const router = useRouter();

        // 게시판 생성 함수
        const createBoard = async () => {
            if (!title.value || !content.value) {
                alert("제목과 내용을 입력하세요!");
                return;
            }

            try {
                const response = await boardApi.create({
                    title: title.value,
                    author: author.value,
                    contents: content.value,
                });
                console.info("게시판 생성 성공:", response.data);
                alert("게시판이 성공적으로 생성되었습니다!");
                router.push("/"); // 메인 페이지로 이동
            } catch (error) {
                console.error("게시판 생성 실패:", error);
                alert("게시판 생성 중 오류가 발생했습니다.");
            }
        };

        // 뒤로가기 함수
        const goBack = () => {
            router.back(); // 이전 페이지로 이동
        };

        return {
            title,
            content,
            createBoard,
            author,
            goBack,
        };
    },
};
</script>

<style scoped>
.create-board-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input,
textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

textarea {
    min-height: 100px;
    resize: none;
}

.create-button,
.back-button {
    padding: 10px 20px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.create-button {
    background-color: #28a745;
    color: white;
}

.create-button:hover {
    background-color: #218838;
}

.back-button {
    background-color: #ffc107;
    color: white;
    margin-left: 10px;
}

.back-button:hover {
    background-color: #e0a800;
}
</style>