<template>
    <!-- <v-container>
            <v-list>
                <v-list-item v-for="bd in board" :key="bd.id">
                    <v-list-item-title>{{ bd.title }} </v-list-item-title>
                    <v-list-item-subtitle>작성자: {{ bd.author }}</v-list-item-subtitle>
                    <v-list-item-subtitle>조회수: {{ bd.views }}</v-list-item-subtitle>
                    <v-list-item-action>
                        <v-btn color="primary" @click="getDetail(bd.id)">더보기</v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        <v-container>
            <v-btn :disabled="previousPossible" @click="getPrevious"> 
                +
            </v-btn>
            <v-btn :disabled="nextPossible" @click="getNext"> -</v-btn>
            </v-container>
    </v-container> -->
    <v-container></v-container>
</template>
<script>
import * as boardApi from '@/api/board';
import { useRouter } from 'vue-router';
import { onMounted, reactive, computed, toRef} from 'vue';

function getDate(str) {
    let date = new Date(str)
    let strr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return strr
}
export default {
    setup(){
        onMounted(()=>{
            get("","","",10,1)
        })
        const router = useRouter()
        const state = reactive({
            board: [],
            meta:{
                count:10,
                last:false,
                page:1,
            }
        })
        const board = toRef(state, 'board')
        const previousPossible=computed(()=>state.board.meta.page<=1)
        const nextPossible=computed(()=>state.meta.last==true)
        //const board = toRef(state,'board')
        const get = (author, contents, title, size, page) => {
            boardApi.get(author, contents, title, size, page).then((res) => {
                console.info(res.data)
                let boards = res.data.boards
                boards.forEach((d) => {
                    state.board.push({ id: d.id, 
                        title: d.title, 
                        author: d.author,
                        generatedAt: d.generatedAt,
                        views: d.views,
                        thumbup: d.thumbup,
                        date: getDate(d.createdAt)})
                })
                state.meta = res.data.meta
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
        const getDetail = (id) => {
            router.push({
                path: "/board/detail",
                state: {
                    data: id
                }
            })
        }
        const deleteBoard = (id) => {
            boardApi.deleteBoard(id).then((res)=>{
                console.info(`JBJB delete board ${res}`)
            })
        }
        const getNext=()=>{
            get(state.meta.page + 1)
        }
        const getPrevious=()=>{
            get(state.meta.page - 1)
        }
        return{
            state,get,update,getDetail,deleteBoard,previousPossible,nextPossible,getNext,getPrevious,board
        }
    }
}
</script>