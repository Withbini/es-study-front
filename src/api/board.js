import http from './http'

export async function get({ author, contents, title, size, page }) {
    return await http.get("/board/search", { "params": { "author": author, "contents": contents, "title": title, "size": size, "page": page } })
        .then(response => {
            if (response.status === 200) {
                return response
            }
        }).catch(() => console.error("게시판 정보를 얻는데 실패했습니다."))
}

const SearchType = {
    AUTHOR: "AUTHOR",
    TITLE: "TITLE",
    TITLE_AND_CONTENT: "TITLE_AND_CONTENT",
    CONTENT: "CONTENT",
};
export async function get2({ keyword, searchType = SearchType.TITLE_AND_CONTENT, sortField = "generatedAt", sortOrder = "desc", size, page }) {
    return await http.get("/board/search2", {
        "params": {
            "keyword": keyword,
            "searchType": searchType,
            "sortField": sortField,
            "sortOrder": sortOrder,
            "size": size,
            "page": page
        }
    })
        .then(response => {
            if (response.status === 200) {
                return response
            }
        }).catch(() => console.error("게시판 정보를 얻는데 실패했습니다."))
}

export async function getDetail(id) {
    return await http.get("/board", { "params": { "id": id } }).then(response => {
        if (response.status === 200) {
            return response
        }
    }).catch(() => console.error("특정 게시글 정보를 얻는데 실패했습니다."))
}

export async function create(request) {
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

export async function updateData(request) {
    return await http.put("/board/data", JSON.stringify(request)).then(response => {

        if (response.status === 200) {
            return response
        }
    }).catch(() => console.error("게시글 수정에 실패했습니다."))
}

export async function deleteBoard(id) {
    return await http.delete("/board", { "params": { "id": id } }).then(response => {
        if (response.status === 201) {
            return response
        }
    }).catch(() => console.error("게시글 삭제에 실패했습니다."))
}

export async function getSummary(target) {
    return await http.get("/board/aggregate", { "params": { "param": target } }).then(response => {
        if (response.status === 200) {
            return response
        }
    }).catch(() => console.error("집계 조회에 실패했습니다."))
}