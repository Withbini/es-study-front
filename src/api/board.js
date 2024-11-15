import http from './http'

export async function get({author, contents, title, size, page}) {
    return await http.get("/board/search", {"params":{ "author": author, "contents": contents, "title": title, "size": size, "page": page} })
    .then(response => {
        if (response.status === 200) {
            return response
        }
    }).catch(() => console.error("게시판 정보를 얻는데 실패했습니다."))
}

export async function getDetail(id) {
    return await http.get("/board", { "params":{ "id": id }}).then(response => {
        if (response.status === 200) {
            return response
        }
    }).catch(() => console.error("특정 게시글 정보를 얻는데 실패했습니다."))
}

export async function save(request) {
    return await http.post("/board", JSON.stringify(request)).then(response => {

        if (response.status === 200) {
            return response
        }
    }).catch(() => console.error("게시글 생성에 실패했습니다."))

}

export async function update(request) {
    return await http.put("/board", JSON.stringify(request)).then(response => {

        if (response.status === 200) {
            return response
        }
    }).catch(() => console.error("게시글 수정에 실패했습니다."))
}

export async function deleteBoard(id) {
    return await http.get("/board", { "id": id }).then(response => {
        if (response.status === 201) {
            return response
        }
    }).catch(() => console.error("게시글 삭제에 실패했습니다."))
}