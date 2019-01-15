// variables
let userName = 'User';
let sessionId = '';
let selectionNowYear = '';
let selectionNowType = '';
let selectionNowSchool = '';
let selectionNowProject = '';

const addForm = document.getElementById('addForm');
const breadCrumb = document.getElementById( 'breadCrumb' );
const header = document.getElementById( 'header' );

// variables > functions

    // get current path through url
const getCurrentPath = () => {
    let pathSplit = window.location.pathname;
    pathSplit = pathSplit.split("/");

    userName = pathSplit[1]
    selectionNowYear = pathSplit[2] ? pathSplit[2] : '';
    selectionNowType = pathSplit[3] ? pathSplit[3] : '';
    selectionNowSchool = pathSplit[4] ? pathSplit[4] : '';
    selectionNowProject = pathSplit[5] ? pathSplit[5] : '';
}

    // fetch session from cookies
const fetchSession = () => {
    let sId = document.cookie.match(/sessionId=[^;]+/);
    console.log(sId);
    if( sId !== undefined){
        if( sId instanceof Array)
            sId = sId[0].substring(10);
        else
            sId = sId.substring(10);
        return sId;
    }
}

    // add project button clicked
const addButtonClicked = ( event ) => {
    $('.ui.modal').modal({
        onApprove : function(){return false;}
    }).modal('show');
}

    // handle edit and delete button clicked
const editDeleteButtonClicked = ( event ) => {
    //get the whole project node
    const projectNode = event.target.parentNode.parentNode;

    // variables
    const name =  projectNode.querySelector( '.manage__name ' ).innerHTML;
    const year = projectNode.querySelector( '.manage__year ' ).innerHTML;
    const school = projectNode.querySelector( '.manage__school ' ).innerHTML;
    const type = projectNode.querySelector( '.manage__type ' ).innerHTML;

    if( event.target.value === '編輯'){
        // redirect to the target folder
        window.location = window.location + '/' + name + '?sessionId=' + sessionId;
    }
    else if( event.target.value === '刪除' ){
        if( confirm( '確定要刪除嗎' ) ){

            fetch( 'man/delete', {
                method: 'POST',
                body: JSON.stringify({
                    sessionId: sessionId,
                    info: {
                        name: name,
                        year: year,
                        type: type,
                        campus: school
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.text())
            .then(data => {
                pageManagement.removeChild( projectNode );
                alert( '成功' );
            });
        }
    }
}

    // refresh the breadcrumb (path on top of the nodes)
const refreshBreadCrumb = () =>{
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="section"> ${ userName } </div>
    `);

    if( selectionNowYear == '')
        return;
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="divider"> / </div>
        <div class="section"> ${ selectionNowYear } </div>
    `);

    if( selectionNowType == '')
        return;
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="divider"> / </div>
        <div class="section"> ${ selectionNowType } </div>
    `);

    if( selectionNowSchool == '')
        return;
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="divider"> / </div>
        <div class="section"> ${ selectionNowSchool } </div>
    `);

    if( selectionNowProject == '')
        return;
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="divider"> / </div>
        <div class="section"> ${ selectionNowProject } </div>
    `);
}

// init

getCurrentPath();
    // refreshBreadCrumb needs to execute after get current path
refreshBreadCrumb();
sessionId = fetchSession();

// add event listener

// add event listener to the selectButton
Object.keys(
    Array.from( document.getElementById( 'page-management' ).querySelectorAll( '.edit' ) )
).forEach( (button) =>{
    button.addEventListener( 'click', editDeleteButtonClicked);
})

Object.keys(
    Array.from( document.getElementById( 'page-management' ).querySelectorAll( '.delete' ) )
).forEach( (button) =>{
    button.addEventListener( 'click', editDeleteButtonClicked);
})

// add event listener to the add button
header.querySelector( '.add', addButtonClicked );

// add event listener to the addForm
// when addform submit rederect to the new project location
addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const reqURL = '/man/add';
    const project = addForm.querySelector('.addForm__project');
    const year = addForm.querySelector('.addForm__year');
    const school = addForm.querySelector('.addForm__school');
    const type = addForm.querySelector('.addForm__type');

    fetch(reqURL, {
        method: 'POST',
        body: JSON.stringify({
            'sessionId': sessionId,
            'info': {
                'year': year.value,
                'campus': school.value,
                'name': project.value,
                'type': type.value
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then(data => {
        backClicked();
    })

    $('.ui.modal').modal('hide');
})