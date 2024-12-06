<template>
    <v-container>

        <select v-model="searchOption" name="searchOption">
            <option value="all" selected>전체 검색</option>
            <option value="title">제목 검색</option>
            <option value="author">작성자 검색</option>
            <option value="content">내용 검색</option>
        </select>
        <form @submit.prevent="search">
            <input class="search-txt" type="text" name="" v-model="searchData" placeholder="검색어를 입력하세요">
            <button class="search-btn" type="submit" name="">

            </button>
        </form>
            <v-data-table
                :items="board"
                item-key="id"
                class="elevation-1"
                :headers="header"
                
                hide-default-footer
                >
                <!-- @click:row="(bd) => getDetail(bd.id)" -->
                <template #item="{ item }">
                        <tr>
                    <!-- <td>{{ item.id }}</td> -->
                    <td>
                        <v-btn text @click.stop="getDetail(item.id)">
                        {{ item.title }}
                        </v-btn>
                    </td>
                    <td>{{ item.author }}</td>
                    <td>{{ item.views }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.thumpsUp }}</td>
                    </tr>
                </template>
            </v-data-table>
        <v-container>
            <v-btn :disabled="nextDisabled" @click="getNext"> 
                +
            </v-btn>
            <v-btn :disabled="previousDisabled" @click="getPrevious"> -</v-btn>
            </v-container>
    </v-container>
</template>
<script>
import * as boardApi from '@/api/board';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onMounted, computed, ref} from 'vue';


export default {
    setup(){
        onMounted(()=>{
            console.info("JBJB mount clear 전")
            store.commit('clear')
            //get("","","",10,1)
            get2("","","","",10,1)
            console.info("JBJB mount clear 후")
        })
    //     onActivated(() => {
    //         console.info('컴포넌트가 활성화되었습니다.');
    //         store.commit('clear')
    //         get("","","",10,1)
    //    });
    const header = ref([
        {text:'제목',value:'title'},
        {text:'작성자',value:'author'},
        {text:'생성일',value:'date'},
        {text:'조회수',value:'views'},
        {text:'좋아요',value:'thumbsUp'}
    ])

        const store = useStore();
        const router = useRouter()
        const searchOption = ref('all');
        const searchData=ref('');
        //const board = toRef(state, 'board')
        const board = computed(()=>store.getters.board)
        const previousDisabled=computed(()=>meta.value.page<=1)
        const nextDisabled=computed(()=>meta.value.last==true)
        const meta = computed(()=>store.getters.meta)
        const get = (author, contents, title, size, page) => {
            boardApi.get(author, contents, title, size, page).then((res) => {
                console.info(res.data)
                let boards = res.data.boards
                if(res.data.data.length ==0) return
                boards.forEach((d) => {
                    store.commit('push', d)
                })

                store.commit('updateMeta',res.data.meta)
            })
        }
        const get2 = (keyword, searchType, sortField, sortOrder, size, page) => {
            boardApi.get2(keyword, searchType, sortField,sortOrder, size, page).then((res) => {
                console.info(res.data)
                let boards = res.data.boards
                if(res.data.data.length ==0) return
                boards.forEach((d) => {
                    store.commit('push', d)
                })

                store.commit('updateMeta',res.data.meta)
            })
        }
        const update = (id) => {
            router.push({
                path: "/board/edit",
                state: {
                    data: id
                }
            })
        }
        const getDetail = (boardId) => {
            console.info(`BJB getdetail id:${boardId}`)
            router.push({
                name: "BoardDetail",
                params: {
                     id:boardId
                }
            })
        }
        const deleteBoard = (id) => {
            boardApi.deleteBoard(id).then((res)=>{
                console.info(`JBJB delete board ${res}`)
            })
        }
        const getNext=()=>{
            store.commit('clear')
            get({page:meta.value.page + 1})
        }
        const getPrevious=()=>{
            store.commit('clear')
            get({page:meta.value.page - 1})
        }
        const callbackAfterGetApi=(data)=>{
            console.info(data)
            let boards = data.boards
            store.commit('clear')
            boards.forEach((d) => {
                store.commit('push', d)
            })
            store.commit('updateMeta',data.meta)
        }
        const search = ()=>{
            console.info(`JBJB ${searchOption.value}`);
            if(searchOption.value == "content") {
                boardApi.get({"contents":searchData.value}).then((res) => {
                    callbackAfterGetApi(res.data)
                })
            }
            else if(searchOption.value == "author") {
                boardApi.get({"author":searchData.value}).then((res) => {
                    callbackAfterGetApi(res.data)
                })
            }
            else if(searchOption.value == "title"){
                boardApi.get({"title":searchData.value}).then((res) => {
                    callbackAfterGetApi(res.data)
                })
            }else{
                get("","","",10,1)
            }
        }
        return{
            get,update,getDetail,deleteBoard,previousDisabled,nextDisabled,getNext,getPrevious,board,search,searchData,searchOption,
            header
        }
    }
}
</script>

<style lang="css" scoped>
.search-btn{
    color:#ffdeec;
    width:20px;
    height:20px;
    background-color: #ffdeec;
}
</style>