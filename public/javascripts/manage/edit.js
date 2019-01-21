// variables
let userName = 'User'
let userId = ''
let selectionNowYear = ''
let selectionNowType = ''
let selectionNowSchool = ''

let selecteddimension = ''
let selecteditem = ''
let selecteddetail = ''

//let schema = {}
const header = document.getElementById('header')

// get current path through url
const getCurrentPath = () => {
  let pathSplit = window.location.pathname
  pathSplit = pathSplit.split('/')

  userId = pathSplit[2]
  selectionNowYear = pathSplit[3] ? decodeURI(pathSplit[3]) : ''
  selectionNowType = pathSplit[4] ? decodeURI(pathSplit[4]) : ''
  selectionNowSchool = pathSplit[5] ? decodeURI(pathSplit[5]) : ''
}

// handle add content button clicked
const addContentClicked = () =>{
  event.preventDefault()
  getCurrentPath()
  fetch(`/man/${userId}/content/add`, {
    method: 'POST',
    body: JSON.stringify({
      'id': userId,
      year: selectionNowYear,
      type: selectionNowType,
      campus: selectionNowSchool,
      dimension: selecteddimension,
      item: selecteditem,
      detail: selecteddetail,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.text())
    .then(data => {
      const pageEdit = document.getElementById('page-edit')
      pageEdit.insertAdjacentHTML('beforeend', data)
      pageEdit.lastChild.querySelector('.save').addEventListener('click', saveContent)
    	pageEdit.lastChild.querySelector('.delete').addEventListener('click', deleteContent)
    })
}

// dropdown on change
// dropdown dimension on change
const dimensionDropdownOnChanged = (event) => {
  const editNode = event.target.parentNode.parentNode.parentNode
  const item = editNode.querySelector('.filter__item').firstChild
  const detail = editNode.querySelector('.filter__detail').firstChild
  while(item.firstChild){
    item.removeChild(item.firstChild)
  }
  while(detail.firstChild){
    detail.removeChild(detail.firstChild)
  }
  const defaultItem = Object.keys(schema[event.target.value])[0]
  item.value = defaultItem
  Object.keys(schema[event.target.value]).forEach((name) => {
    item.insertAdjacentHTML('beforeend', `<option value = ${ name } > ${ name } </option>`)
  })
  Object.keys(schema[event.target.value][defaultItem]).forEach((name) => {
    detail.insertAdjacentHTML('beforeend', `<option value = ${ name } > ${ name } </option>`)
  })
}
// dropndown item on change
const itemDropdownOnChanged = (event) => {
  const editNode = event.target.parentNode.parentNode.parentNode
  const dimension = editNode.querySelector('.filter__dimension').firstChild
  const detail = editNode.querySelector('.filter__detail').firstChild
  while(detail.firstChild){
    detail.removeChild(detail.firstChild)
  }
  Object.keys(schema[dimension.value][event.target.value]).forEach((name) => {
    detail.insertAdjacentHTML('beforeend', `<option value = ${ name } > ${ name } </option>`)
  })
}

// handle choice clicked
const filter = (event) => {
  event.preventDefault()
  const pageEdit = document.getElementById('page-edit')
  const dimension = pageEdit.querySelector('.filter.filter__dimension').firstChild.value
  const item = pageEdit.querySelector('.filter.filter__item').firstChild.value
  const detail = pageEdit.querySelector('.filter.filter__detail').firstChild.value
  getCurrentPath()
  fetch(`/man/${userId}/content/filter`, {
    method: 'POST',
    body: JSON.stringify({
      'id': userId,
      year: selectionNowYear,
      type: selectionNowType,
      campus: selectionNowSchool,
      dimension: dimension,
      item: item,
      detail: detail,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.text())
    .then(data => {
      selecteddimension = dimension
      selecteditem = item
      selecteddetail = detail
      // remove children of pageEdit except for first child
      while(pageEdit.firstChild !== pageEdit.lastChild){
        pageEdit.removeChild(pageEdit.lastChild)
      }
      pageEdit.insertAdjacentHTML('beforeend', data)
      document.getElementById('footer').classList.remove('hidden')
      document.getElementById('footer').classList.remove('transition')
      pageEdit.querySelectorAll('.save').forEach((button)=> {
        button.addEventListener('click', saveContent)
      })
      pageEdit.querySelectorAll('.delete').forEach((button)=> {
        button.addEventListener('click', deleteContent)
      })
    })
}

// handle save button clicked
const saveContent = (event) => {
  event.preventDefault()

  const node = event.target.parentNode.parentNode.parentNode.parentNode
  const startPage = node.querySelector('.page__start').value
  const endPage = node.querySelector('.page__end').value
  const title = node.querySelector('.title').value
  const content = node.querySelector('.content').value
  const index = node.querySelector('.node-index').value

  fetch(`/man/${userId}/content/save`, {
    method: 'POST',
    body: JSON.stringify({
      'id': userId,
      year: selectionNowYear,
      type: selectionNowType,
      campus: selectionNowSchool,
      dimension: selecteddimension,
      item: selecteditem,
      detail: selecteddetail,
      page: {
        start: startPage,
        end: endPage,
      },
      index: index,
      title: title,
      data: content,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.text())
    .then(data => {
      alert(data)
    })
}

// handle delete button clicked
const deleteContent = (event) =>{
  event.preventDefault()
  if(confirm('確定要刪除嗎')){
    const node = event.target.parentNode.parentNode.parentNode.parentNode
    const startPage = node.querySelector('.page__start').value
    const endPage = node.querySelector('.page__end').value
    const title = node.querySelector('.title').value
    const index = node.querySelector('.node-index').value

    getCurrentPath()
    fetch(`/man/${userId}/content/delete`, {
      method: 'POST',
      body: JSON.stringify({
        'id': userId,
        year: selectionNowYear,
        type: selectionNowType,
        campus: selectionNowSchool,
        dimension: selecteddimension,
        item: selecteditem,
        detail: selecteddetail,
        index: index,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(data => {
        document.getElementById('page-edit').querySelector('.choice').click()
        alert(data)
      })
  }
}

// init
//fetchSchema()

// fetch user name, get the current path and refresh the breadcrumb
//fetchUserName()

// refresh dropdown
$('select.dropdown')
  .dropdown()

// add event listener

// add event listener to dropdowns
Array.from(document.getElementById('page-edit').querySelectorAll('form.ui.form.segment')).forEach((node) =>{
  node.querySelector('.filter__dimension').firstChild.addEventListener('change', dimensionDropdownOnChanged)
  node.querySelector('.filter__item').firstChild.addEventListener('change', itemDropdownOnChanged)
})

// add event listener to the add content button
document.querySelector('.add-content').addEventListener('click', addContentClicked)

// add event listener to the choice content button
document.getElementById('page-edit').querySelector('.filter').addEventListener('submit', filter)