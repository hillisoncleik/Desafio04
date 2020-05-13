const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

for (item of menuItems){

    if (currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

//PAGINATION
const pagination = document.querySelector(".pagination")
if (pagination){
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const filter = pagination.dataset.filter

    let pages = [],
        oldPage
    
    for (let currentPage = 1 ; currentPage <= total ; currentPage++ ){
        const FirtsAndLeftsPages = currentPage == 1 || currentPage == 2 || currentPage == total || currentPage == total-1
        const pagesAfter = currentPage <= page + 1
        const pagesBefore = currentPage >= page - 1
        const intervalo = pagesBefore && pagesAfter

        if (FirtsAndLeftsPages || intervalo){
            if (oldPage && currentPage - oldPage > 2){
                pages.push("...")
            }
            
            if (oldPage && currentPage - oldPage == 2){
                pages.push(oldPage + 1)
            }
            
            pages.push(currentPage)
            
            oldPage = currentPage
        }

    }

    let elements = ""
    if (page!=1){
        elements += `<a href="?filter=${filter}&page=${page-1}" class="arrow_l"><i class="material-icons">arrow_left</i></a>`
    }

    for (let pag of pages){
        if (String(pag).includes("...")){
            elements += "<span>...</span>"
        }
        else{
            if (pag == page){
                if (filter){
                    elements += `<a href="?filter=${filter}&page=${pag}" class="active">${pag}</a>`
                }
                else{
                    elements += `<a href="?page=${pag}" class="active">${pag}</a>`
                }
            }
            else{
                if (filter){
                    elements += `<a href="?filter=${filter}&page=${pag}">${pag}</a>`
                }
                else{
                    elements += `<a href="?page=${pag}">${pag}</a>`
                }
            }
            
            
        }
        
    }
    if (page!=total){
        elements += `<a href="?filter=${filter}&page=${page+1}" class="arrow_r"><i class="material-icons">arrow_right</i></a>`
    }
    pagination.innerHTML = elements
    console.log(elements)

}