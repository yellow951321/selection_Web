// variables
let userName = 'User'
let sessionId = ''
let selectionNowYear = ''
let selectionNowType = ''
let selectionNowSchool = ''

let selecteddimension = ''
let selecteditem = ''
let selecteddetail = ''

let schema = {}
const breadCrumb = document.getElementById('breadcrumb')
const header = document.getElementById('header')

// variables > functions
// fetch schema
const fetchSchema = () => {
  fetch('/man/schema', {
    method: 'POST',
    body: JSON.stringify({
      'sessionId': sessionId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => {
      schema = data
    })
}
// get current path through url
const getCurrentPath = () => {
  let pathSplit = window.location.pathname
  pathSplit = pathSplit.split('/')

  userName = pathSplit[2]
  selectionNowYear = pathSplit[3] ? decodeURI(pathSplit[3]) : ''
  selectionNowType = pathSplit[4] ? decodeURI(pathSplit[4]) : ''
  selectionNowSchool = pathSplit[5] ? decodeURI(pathSplit[5]) : ''
}

// handle add content button clicked
const addContentClicked = () =>{
  fetch('/man/content/add', {
    method: 'POST',
    body: JSON.stringify({
      sessionId: sessionId,
      info: {
        year: selectionNowYear,
        type: selectionNowType,
        campus: selectionNowSchool,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.text())
    .then(data => {
      const pageEdit = document.getElementById('page-edit')
			pageEdit.insertAdjacentHTML('beforeend', data)
			pageEdit.lastChild.querySelector( '.save' ).addEventListener( 'click', saveContent);
    	pageEdit.lastChild.querySelector( '.delete' ).addEventListener( 'click', deleteContent);
    })
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
	const pageEdit = document.getElementById( 'page-edit' );
	const dimension = pageEdit.querySelector( '.filter.filter__dimension' );
	const item = pageEdit.querySelector( '.filter.filter__item' );
	const detail = pageEdit.querySelector( '.filter.filter__detail' );

	fetch( '/man/content/filter', {
		method: 'POST',
		body: JSON.stringify({
			sessionId: sessionId,
				info: {
					year: selectionNowYear,
					type: selectionNowType,
					campus: selectionNowSchool,
					dimension: dimension,
					item: item,
					detail: detail
				}
		})
	})
}

// handle save button clicked
const saveContent = (event) => {
  event.preventDefault()
  fetch('/man/content/save', {
    method: 'POST',
    body: JSON.stringify({
      sessionId: sessionId,
      info: {
				year: selectionNowYear,
				type: selectionNowType,
				campus: selectionNowSchool,
				dimension: dimension,
				item: item,
				detail: detail
			},
			title: title,
      data: contents,
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
	event.preventDefault();
	const node = event.target.parentNode.parentNode.parentNode.parentNode;
	const startPage = node.querySelector( '.page__start' ).value;
	const endPage = node.querySelector( '.page__end' ).value;
	const title = node.querySelector( '.title' ).value;
	const content = node.querySelector( '.content' ).value;
	console.log(startPage);
	console.log(endPage);
	console.log(title);
	console.log(content);
	// fetch('/man/content/delete', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     sessionId: sessionId,
  //     info: {
  //       year: selectionNowYear,
  //       type: selectionNowType,
	// 			campus: selectionNowSchool,
	// 			topic: ,
  //     },
  //     data: contents,
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
  //   .then(res => res.text())
  //   .then(data => {
  //     alert(data)
  //   })
}

// init
fetchSchema()
getCurrentPath()

// refreshBreadCrumb needs to execute after get current path and fetchSession
refreshBreadCrumb()
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