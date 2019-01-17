// variables
let userName = 'User'
let sessionId = ''
let selectionNowYear = ''
let selectionNowType = ''
let selectionNowSchool = ''
let selectionNowProject = ''

const addForm = document.getElementById('addForm')
const breadCrumb = document.getElementById('breadcrumb')
const header = document.getElementById('header')

// variables > functions

// get current path through url
const getCurrentPath = () => {
  let pathSplit = window.location.pathname
  pathSplit = pathSplit.split('/')

  userName = pathSplit[2]
  selectionNowYear = pathSplit[3] ? decodeURI(pathSplit[3]) : ''
  selectionNowType = pathSplit[4] ? decodeURI(pathSplit[4]) : ''
  selectionNowSchool = pathSplit[5] ? decodeURI(pathSplit[5]) : ''
  selectionNowProject = pathSplit[6] ? decodeURI(pathSplit[6]) : ''
}

// fetch session from cookies
const fetchSession = () => {
  let sId = document.cookie.match(/sessionId=[^;]+/)
  console.log(sId)
  if(sId !== undefined){
    if(sId instanceof Array)
      sId = sId[0].substring(10)
    else
      sId = sId.substring(10)
    return sId
  }
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
    window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}/${selectionNowYear}?sessionId=${sessionId}`)
  }
  else if (selectionNowType === ''){
    selectionNowType = event.target.innerHTML
    // type selected
    window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}/${selectionNowType}?sessionId=${sessionId}`)
  }
  else if (selectionNowSchool === ''){
    selectionNowSchool = event.target.innerHTML
    // school selected
    window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}${window.location.pathname}/${selectionNowSchool}?sessionId=${sessionId}`)
  }
}

// refresh the breadcrumb (path on top of the nodes)
const refreshBreadCrumb = () =>{
  breadCrumb.insertAdjacentHTML('beforeend', `
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}?sessionId=${sessionId}"> ${ userName } </div>
    `)

  if(selectionNowYear == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${selectionNowYear}?sessionId=${sessionId}"> ${ selectionNowYear } </div>
    `)

  if(selectionNowType == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${selectionNowYear}/${selectionNowType}?sessionId=${sessionId}"> ${ selectionNowType } </div>
    `)

  if(selectionNowSchool == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${selectionNowYear}/${selectionNowType}/${selectionNowSchool}?sessionId=${sessionId}"> ${ selectionNowSchool } </div>
    `)

  if(selectionNowProject == '')
    return
  breadCrumb.insertAdjacentHTML('beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${selectionNowYear}/${selectionNowType}/${selectionNowSchool}/${sele}?sessionId=${sessionId}"> ${ selectionNowProject } </div>
    `)
}

// init

getCurrentPath()
sessionId = fetchSession()
// refreshBreadCrumb needs to execute after get current path and fetchSession
refreshBreadCrumb()

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
  const project = addForm.querySelector('.addForm__project')
  const year = addForm.querySelector('.addForm__year')
  const school = addForm.querySelector('.addForm__school')
  const type = addForm.querySelector('.addForm__type')

  fetch(reqURL, {
    method: 'POST',
    body: JSON.stringify({
      'sessionId': sessionId,
      'info': {
        'year': year.value,
        'campus': school.value,
        'name': project.value,
        'type': type.value,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.text())
    .then(data => {
      if(data === 'OK')
        window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${year.value}/${type.value}/${school.value}?sessionId=${sessionId}`)
    })

  $('.ui.modal').modal('hide')
})

// add event listener to the logout button
header.querySelector('.logout').addEventListener('click', () =>{
  fetch('/log/out', {
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
        window.location.assign(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/log`)
    })
})