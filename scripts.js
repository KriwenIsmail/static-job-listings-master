const container = document.querySelector('.list')
const addBtn = document.querySelector('#add')

let techs = new Set()

const render = e => {
    if (document.querySelector(`[data-id="${e.id}"]`)) return
    const el = document.createElement('div')
    el.setAttribute('data-id', e.id)
    el.classList.add('item')
    if (e.featured) el.classList.add('featured')
    container.append(el)

    el.innerHTML = `<div class="info">
    <div class="img">
        <img src="${e.logo}" alt="">
    </div>
    <div class="wrapper">
        <div class="top">
        <div class="company">${e.company}</div>
        ${e.new ? '<div class="new">new!</div>' : ''}
        ${e.featured ? '<div class="featured">featured</div>' : ''}
        </div>
        <div class="center">
        <div class="position">${e.position}</div>
        </div>
    <div class="bottom">
        <span class="createdAt">${e.postedAt}</span> - <span class="contract">${e.contract}</span> - <span class="country">${e.location}</span>
        </div>
    </div>
    </div>
    <div class="languages">
    </div>
                    </div>`
    e.languages.forEach(language => {
        const lang = document.createElement('div')
        lang.innerHTML = language
        lang.classList.add('lang')
        el.querySelector('.languages').append(lang)
        techs.add(language)
    })
    e.tools.forEach(tool => {
        const t = document.createElement('div')
        t.innerHTML = tool
        t.classList.add('lang')
        el.querySelector('.languages').append(t)
        techs.add(tool)
    })
}

fetch('./data.json')
    .then(res => res.json())
    .then(data => {
        container.innerHTML = ''
        data.forEach(e => render(e))
    })


const filter = () => {
    const list = []
    document.querySelectorAll('.search .search-item').forEach(searchItem => list.push(searchItem.querySelector('.text').innerText))
    container.innerHTML = ''
    fetch('./data.json')
        .then(res => res.json())
        .then(data => {
            if (list.length > 0) {
                data.forEach(e => {
                    list.forEach(l => {
                        if (e.languages.includes(l) || e.tools.includes(l)) render(e)
                    })
                })
            } else {
                data.forEach(e => render(e))
            }
        })
}

addBtn.addEventListener('click', () => {
    const inp = document.querySelector('#filter_text')
    if (!techs.has(inp.value) || document.querySelector(`[data-key="${inp.value}"]`)) {
        inp.value = ''
        return
    }
    if (inp.value == '') return
    const temp = document.createElement('div')
    temp.classList.add('search-item')
    temp.setAttribute('data-key', inp.value)
    temp.innerHTML = `<div class="text">${inp.value}</div>
                    <div class="remove" data-remove="${inp.value}">&times;</div>`
    inp.value = ''
    document.querySelector('.search .items').append(temp)
    const removeBtns = document.querySelectorAll('[data-remove]')
    if (removeBtns.length > 0) {
        removeBtns.forEach(btn => btn.addEventListener('click', () => {
            document.querySelector(`[data-key="${btn.dataset.remove}"]`).remove()
            filter()
        }))
    }
    filter()
})

document.querySelector('.add').addEventListener('click', () => {
    document.querySelector('.modal').classList.add('active')
})

document.querySelector('.close_modal').addEventListener('click', () => {
    document.querySelector('.modal').classList.remove('active')
})

document.querySelector('.clear').addEventListener('click', () => {
    document.querySelector('.search .items').innerHTML = ''
    filter()
})
