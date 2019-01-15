// variables
let userName = 'User';
let sessionId = '';
let selectionNowYear = '';
let selectionNowType = '';
let selectionNowSchool = '';
let selectionNowProject = '';
let schema = {};
const breadCrumb = document.getElementById( 'breadcrumb' );
const header = document.getElementById( 'header' );

// variables > functions
    // fetch schema
const fetchSchema = () => {
    fetch( '/man/schema' , {
        method: 'POST',
        body: JSON.stringify({
            'sessionId': sessionId,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( res => res.json())
    .then( data => {
        schema = data;
    })
}
    // get current path through url
const getCurrentPath = () => {
    let pathSplit = window.location.pathname;
    pathSplit = pathSplit.split("/");

    userName = pathSplit[2]
    selectionNowYear = pathSplit[3] ? decodeURI( pathSplit[3] ) : '';
    selectionNowType = pathSplit[4] ? decodeURI( pathSplit[4] ) : '';
    selectionNowSchool = pathSplit[5] ? decodeURI( pathSplit[5] ) : '';
    selectionNowProject = pathSplit[6] ? decodeURI( pathSplit[6] ) : '';
}

    // fetch session from cookies
const fetchSession = () => {
    let sId = document.cookie.match(/sessionId=[^;]+/);
    if( sId !== undefined){
        if( sId instanceof Array)
            sId = sId[0].substring(10);
        else
            sId = sId.substring(10);
        return sId;
    }
}

    // add content button clicked

    // handle save button clicked

    // refresh the breadcrumb (path on top of the nodes)
const refreshBreadCrumb = () =>{
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}?sessionId=${sessionId}"> ${ userName } </div>
    `);

    if( selectionNowYear == '')
        return;
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${selectionNowYear}?sessionId=${sessionId}"> ${ selectionNowYear } </div>
    `);

    if( selectionNowType == '')
        return;
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${selectionNowYear}/${selectionNowType}?sessionId=${sessionId}"> ${ selectionNowType } </div>
    `);

    if( selectionNowSchool == '')
        return;
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${selectionNowYear}/${selectionNowType}/${selectionNowSchool}?sessionId=${sessionId}"> ${ selectionNowSchool } </div>
    `);

    if( selectionNowProject == '')
        return;
    breadCrumb.insertAdjacentHTML( 'beforeend', `
        <div class="divider"> / </div>
        <a class="section" href = "${window.location.protocol}//${window.location.hostname}:${window.location.port}/man/${userName}/${selectionNowYear}/${selectionNowType}/${selectionNowSchool}/${selectionNowProject}?sessionId=${sessionId}"> ${ selectionNowProject } </div>
    `);
}
    // add content
    // Edit > addButton
const addContentClicked = () =>{
    fetch( '/man/addContent', {
        method: 'POST',
        body: JSON.stringify({
            sessionId: sessionId,
            info: {
                year: selectionNowYear,
                type: selectionNowType,
                campus: selectionNowSchool,
                name: selectionNowProject,
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then(data => {
        const pageEdit = document.getElementById( 'page-edit' );
        pageEdit.insertAdjacentHTML( 'beforeend', data );
        //add event listener to dropdowns
        pageEdit.querySelector( '.dimension' ).addEventListener( 'change', dimensionDropdownOnChanged );
        pageEdit.querySelector( '.item' ).addEventListener( 'change', itemDropdownOnChanged );
        $( 'select.dropdown' ).dropdown();
    })
}

    // dropdown on change
    // dropdown dimension on change
const dimensionDropdownOnChanged = (event) => {
    const editNode = event.target.parentNode.parentNode.parentNode;
    const item = editNode.querySelector('div.item.ui.selection.dropdown').firstChild;
    const detail = editNode.querySelector('div.detail.ui.selection.dropdown').firstChild;
    while(item.firstChild){
        item.removeChild(item.firstChild);
    }
    while(detail.firstChild){
        detail.removeChild(detail.firstChild);
    }
    schema[ event.target.value ]
    const defaultItem = Object.keys(schema[ event.target.value ])[0];
    item.value = defaultItem;
    Object.keys(schema[ event.target.value ]).forEach( (name) => {
        item.insertAdjacentHTML( 'beforeend', `<option value = ${ name } > ${ name } </option>`)
    })
    Object.keys(schema[ event.target.value ][ defaultItem ]).forEach( (name) => {
        detail.insertAdjacentHTML( 'beforeend', `<option value = ${ name } > ${ name } </option>`)
    })
}
    // dropndown item on change
const itemDropdownOnChanged = (event) => {
    const editNode = event.target.parentNode.parentNode.parentNode;
    const dimension = editNode.querySelector('div.dimension.ui.selection.dropdown').firstChild;
    const detail = editNode.querySelector('div.detail.ui.selection.dropdown').firstChild;
    while(detail.firstChild){
        detail.removeChild(detail.firstChild);
    }
    Object.keys(schema[ dimension.value ][ event.target.value ]).forEach( (name) => {
        detail.insertAdjacentHTML( 'beforeend', `<option value = ${ name } > ${ name } </option>`)
    })
}

// init
fetchSchema();
getCurrentPath();
sessionId = fetchSession();
    // refreshBreadCrumb needs to execute after get current path and fetchSession
refreshBreadCrumb();
    // refresh dropdown
$('select.dropdown')
    .dropdown()
;

// add event listener

// add event listener to dropdowns
Array.from( document.getElementById( 'page-edit' ).querySelectorAll( 'form.ui.form.segment' ) ).forEach( (node) =>{
    node.querySelector('.dimension.ui.selection.dropdown').firstChild.addEventListener('change', dimensionDropdownOnChanged);
    node.querySelector('.item.ui.selection.dropdown').firstChild.addEventListener('change', itemDropdownOnChanged);
})

// add event listener to the add content button
header.querySelector( '.add-content' ).addEventListener( 'click', addContentClicked);