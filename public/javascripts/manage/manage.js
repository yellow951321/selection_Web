// variables
let userId = 0
let userName = 'User'
let sessionId = ''
let selectionNowYear = ''
let selectionNowType = ''

const addForm = document.getElementById('addForm')
const breadCrumb = document.getElementById('breadcrumb')
const header = document.getElementById('header')

// variables > functions

// get current path through url
const getCurrentPath = () => {
  let pathSplit = window.location.pathname
  pathSplit = pathSplit.split('/')

  userId = pathSplit[2]
  selectionNowYear = pathSplit[3] ? decodeURI(pathSplit[3]) : ''
  selectionNowType = pathSplit[4] ? decodeURI(pathSplit[4]) : ''
}

// add project button clicked
const addButtonClicked = (event) => {
  $('.ui.modal').modal({
    onApprove : function(){return false},
  }).modal('show')
}

// handle edit and delete button clicked
const editDeleteButtonClicked = (event) => {
  //get the whole project node
  const projectNode = event.target.parentNode.parentNode

  // variables
  const school = projectNode.querySelector('.manage__school ').innerHTML

  if(event.target.innerHTML === '編輯'){
    // redirect to the target folder
    window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}/${school}`)
  }
  else if(event.target.innerHTML === '刪除'){
    if(confirm('確定要刪除嗎')){

      fetch('/man/delete', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: sessionId,
          info: {
            year: selectionNowYear,
            type: selectionNowType,
            campus: school,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(data => {
          if(data === 'OK')
            projectNode.parentNode.removeChild(projectNode)
            alert('成功')
        })
    }
  }
}

// refresh the breadcrumb (path on top of the nodes)
const refreshBreadCrumb = () =>{
  breadCrumb.insertAdjacentHTML('beforeend', `
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userId}?sessionId=${sessionId}"> ${ userId } </div>
    `)

  if(selectionNowYear == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userId}/${selectionNowYear}?sessionId=${sessionId}"> ${ selectionNowYear } </div>
    `)

  if(selectionNowType == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userId}/${selectionNowYear}/${selectionNowType}?sessionId=${sessionId}"> ${ selectionNowType } </div>
    `)
}

// init

getCurrentPath()

//refresh dropdwon in addForm
$('select.dropdown')
  .dropdown()

// refreshBreadCrumb needs to execute after get current path and fetchSession
refreshBreadCrumb()

// add event listener

// add event listener to the edit and delete button
Array.from(document.getElementById('page-management').querySelectorAll('.edit')).forEach((button) =>{
  button.addEventListener('click', editDeleteButtonClicked)
})

Array.from(document.getElementById('page-management').querySelectorAll('.delete')).forEach((button) =>{
  button.addEventListener('click', editDeleteButtonClicked)
})

// add event listener to the add button
header.querySelector('.add').addEventListener('click', addButtonClicked)

// add event listener to the addForm
// when addform submit rederect to the new project location
addForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const reqURL = '/man/add'
  const year = addForm.querySelector('.addForm__year')
  const school = addForm.querySelector('.addForm__school')
  const type = addForm.querySelector('.addForm__type').firstChild

  fetch(reqURL, {
    method: 'POST',
    body: JSON.stringify({
      'sessionId': sessionId,
      'info': {
        'year': year.value,
        'type': type.value,
        'campus': school.value,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.text())
    .then(data => {
      if( data === 'OK')
        window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userId}/${year.value}/${type.value}`);
    })

  $('.ui.modal').modal('hide')
})

// add event listener to the logout button
header.querySelector('.logout').addEventListener('click', () =>{
  fetch('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({
      sessionId: sessionId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.text())
    .then(data => {
      if(data === 'Log out')
        window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/auth/login`)
    })
})