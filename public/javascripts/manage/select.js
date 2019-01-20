// variables
let userId = 0
let userName = 'User'
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
  selectionNowSchool = pathSplit[5] ? decodeURI(pathSplit[5]) : ''
}

// fetch user name
const fetchUserName = () => {
  fetch('/man/name', {
    method: 'POST',
    body: JSON.stringify({
      'id': userId
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(res => res.text())
  .then(data => {
    userName = data
    // get curent path
    getCurrentPath()

    // refreshBreadCrumb needs to execute after get current path 
    refreshBreadCrumb()
  })
}

// add project button clicked
const addButtonClicked = (event) => {
  $('.ui.modal').modal({
    onApprove : function(){return false},
  }).modal('show')
}

// redirect to next page through the selected information
const buttonSelected = (event) => {
  // determine current folder
  if(selectionNowYear === ''){
    selectionNowYear = event.target.innerHTML
    window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}/${selectionNowYear}`)
  }
  else if (selectionNowType === ''){
    selectionNowType = event.target.innerHTML
    // type selected
    window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}/${selectionNowType}`)
  }
}

// refresh the breadcrumb (path on top of the nodes)
const refreshBreadCrumb = () =>{
  breadCrumb.insertAdjacentHTML('beforeend', `
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userId}"> ${ userName } </div>
    `)

  if(selectionNowYear == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userId}/${selectionNowYear}"> ${ selectionNowYear } </div>
    `)

  if(selectionNowType == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userId}/${selectionNowYear}/${selectionNowType}"> ${ selectionNowType } </div>
    `)

  if(selectionNowSchool == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userId}/${selectionNowYear}/${selectionNowType}/${selectionNowSchool}"> ${ selectionNowSchool } </div>
    `)
}

// init

//refresh dropdwon in addForm
$('select.dropdown')
  .dropdown()

// fetch user name, get the current path and refresh the breadcrumb
fetchUserName()

// add event listener

// add event listener to the selectButton
Array.from(document.getElementById('page-select').querySelectorAll('.button')).forEach((button) =>{
  button.addEventListener('click', buttonSelected)
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
      'id': userId,
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
      'id': userId
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