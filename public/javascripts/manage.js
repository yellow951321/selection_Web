// variables
const pageSelect = document.getElementById('page-select');
const pageManagement = document.getElementById('page-management');
const pageEdit = document.getElementById('page-edit');
const pageHeader = document.getElementById('header'); 
let sessionId = '123';

// selection variable
let selectionNowPage = 'start';
let selectionNowYear = '';
let selectionNowType = '';
let selectionNowSchool = '';
let selectionNowProject = '';

var schema = {};

//init
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

function init(){
    pageHeader.querySelector('.add').style.display = 'block';
    pageHeader.querySelector('.add-content').style.display = 'none';
    pageHeader.querySelector('.save-content').style.display = 'none';
    pageSelect.style.display = 'block';
    pageSelect.querySelector('.select__year').style.display = 'block';
    pageSelect.querySelector('.select__type').style.display = 'block';
    pageEdit.style.display = 'none';
    pageManagement.style.display = 'none';

    selectionNowPage = 'start';
    selectionNowYear = '';
    selectionNowType = '';
    selectionNowSchool = '';
    selectionNowProject = '';
}
init();
// dropdown
function refreshDropdown(){
    $('select.dropdown')
        .dropdown()
    ;
}
refreshDropdown();

// modal setting
const addClicked = () => {
    $('.ui.modal')
    .modal('show')
    ;
};

document.getElementById('add').addEventListener('click', addClicked);

// adding project
const addProjectClicked = (event) => {
    $('.ui.modal').modal({
        onApprove : function(){return false;}
    }).modal('show');
};

document.getElementById('add-project').addEventListener('click', addProjectClicked);

//add event listener to Add button (for new project)
const addForm = document.getElementById('addForm');
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

// back button
const backClicked = () => {
    // empty the pages
    const selectYear = pageSelect.querySelector('.select__year');
    const selectType = pageSelect.querySelector('.select__type');
    const selectSchool = pageSelect.querySelector('.select__school');

    const temp = [selectYear, selectType, selectSchool, pageManagement, pageEdit];
    for( var x in temp){
        while(temp[x].firstChild){
            temp[x].removeChild(temp[x].firstChild);
        }
    }
    // fetch years 
    fetch( 'man/fetch', {
        method: 'POST',
        body: JSON.stringify({sessionId: sessionId}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then(data => {
        init();
        const yearBlock =pageSelect.querySelector('.select__year');
        yearBlock.insertAdjacentHTML('beforeend', data);
        const childs = yearBlock.children;
        for(let i = 0; i < childs.length; i++){
            childs[i].addEventListener('click' , butttonSelected);
        }    
        selectionNowPage = 'year'; 
    })
}

pageHeader.querySelector('.back').addEventListener('click', backClicked);

// variables for selection, manage, edit

// selection 

// manage

// mnaage > variables
const projectSelected = (event) => {
    //get the whole project node
    projectNode = event.target.parentNode.parentNode;

    // variables
    const name =  projectNode.querySelector( '.manage__name ' ).innerHTML;
    const year = projectNode.querySelector( '.manage__year ' ).innerHTML;
    const school = projectNode.querySelector( '.manage__school ' ).innerHTML;
    const type = projectNode.querySelector( '.manage__type ' ).innerHTML;
    selectionNowProject = name;
    selectionNowYear = year;
    selectionNowSchool = school;
    selectionNowType = type;

    //change button and page
    pageHeader.querySelector('.add').style.display = 'none';
    pageHeader.querySelector('.add-content').style.display = 'block';
    pageHeader.querySelector('.save-content').style.display = 'block';
    pageManagement.style.display = 'none';
    pageEdit.style.display = 'block';


    fetch( 'man/edit', {
        method: 'POST',
        body: JSON.stringify({
            sessionId: sessionId,
            name: name, 
            year: year,
            type: type,
            campus: school
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( res => res.text() )
    .then( data => {
        pageEdit.insertAdjacentHTML('beforeend', data);
        const contentNodes = Array.from(pageEdit.querySelectorAll( 'form.ui.form.segment' ));
        contentNodes.forEach( (node) => {
            node.querySelector('.dimension').addEventListener('change', dimensionDropdownOnChanged);
            node.querySelector('.item').addEventListener('change', itemDropdownOnChanged);           
            refreshDropdown();
        })
    })
}

const projectDeleted = (event) => {

}

// selection

// selection > fetch button
const butttonSelected = (event) => {
    event.preventDefault();
    selectionNowYear = selectionNowPage === 'year' ? event.target.innerHTML : selectionNowYear;     
    selectionNowType = selectionNowPage === 'type' ? event.target.innerHTML : selectionNowType;     
    selectionNowSchool = selectionNowPage === 'school' ? event.target.innerHTML : selectionNowSchool;     
    
    const yearBlock = pageSelect.querySelector('.select__year');
    const typeBlock = pageSelect.querySelector('.select__type');
    const schoolBlock = pageSelect.querySelector('.select__school');
    
    fetch( 'man/fetch', {
        method: 'POST',
        body: JSON.stringify({
            sessionId: sessionId, 
            year: selectionNowYear,
            type: selectionNowType,
            campus: selectionNowSchool
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then(data => {
        // change to type page
        if( selectionNowPage === 'year'){
            yearBlock.style.display = 'none';
            typeBlock.insertAdjacentHTML('beforeend', data);
            const childs = typeBlock.children;            
            for(let i = 0; i < childs.length; i++){
                childs[i].addEventListener('click' , butttonSelected);
            }
            selectionNowPage = 'type';
        }
        // change to school page
        else if ( selectionNowPage === 'type' ){
            typeBlock.style.display = 'none';
            schoolBlock.insertAdjacentHTML('beforeend', data);
            const childs = schoolBlock.children;         
            for(let i = 0; i < childs.length; i++){
                childs[i].addEventListener('click' , butttonSelected);
            }
            selectionNowPage = 'school';
        }
        // show projects
        else if ( selectionNowPage === 'school' ){
            pageSelect.style.display = 'none';
            pageManagement.style.display = 'block';
            pageManagement.insertAdjacentHTML('beforeend', data);
            const childs = pageManagement.children;
            for(let i=0; i<childs.length; ++i){
                childs[i].querySelector( '.edit' ).addEventListener( 'click', projectSelected);
                childs[i].querySelector( '.delete' ).addEventListener( 'click', projectDeleted);
            }
            pageHeader.querySelector('.add').style.display = 'block';            
        }     
    })    
}


fetch( 'man/fetch', {
    method: 'POST',
    body: JSON.stringify({sessionId: sessionId}),
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(res => res.text())
.then(data => {
    const yearBlock =pageSelect.querySelector('.select__year');
    yearBlock.insertAdjacentHTML('beforeend', data);
    const childs = yearBlock.children;
    for(let i = 0; i < childs.length; i++){
        childs[i].addEventListener('click' , butttonSelected);
    }    
    selectionNowPage = 'year'; 
})

// Edit

// Edit > dropdow

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
    const defaultItem = Object.keys(schema[ event.target.value ])[0];
    item.value = defaultItem;
    Object.keys(schema[ event.target.value ]).forEach( (name) => {
        item.insertAdjacentHTML( 'beforeend', `<option value = ${ name } > ${ name } </option>`)
    })
    Object.keys(schema[ event.target.value ][ defaultItem ]).forEach( (name) => {
        detail.insertAdjacentHTML( 'beforeend', `<option value = ${ name } > ${ name } </option>`)
    })
}

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

// Edit > addButton
const addContent = () =>{
    fetch( 'man/addContent', {
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
        pageEdit.insertAdjacentHTML('beforeend', data);
        //add event listener to dropdowns
        pageEdit.lastChild.querySelector('.dimension').addEventListener('change', dimensionDropdownOnChanged);
        pageEdit.lastChild.querySelector('.item').addEventListener('change', itemDropdownOnChanged);
        refreshDropdown();
    })
}

pageHeader.querySelector('.add-content').addEventListener('click', addContent);

// Edit > saveButton

const saveContent = () =>{
    const childs = Array.from(pageEdit.children);
    console.log(childs)
    const contents = [];
    childs.forEach((child)=>{
        contents.push({
            dimension: child.querySelector('.dimension').value,
            item: child.querySelector('.item').value,
            detail: child.querySelector('.detail').value,
            content: child.querySelector('.content').value,
            page: {
                start: child.querySelector('.page__start').value,
                end: child.querySelector('.page__end').value
            }
        });
    })
    fetch( 'man/save', {
        method: 'POST',
        body: JSON.stringify({
            sessionId: sessionId, 
            info: {
                year: selectionNowYear,
                type: selectionNowType,
                campus: selectionNowSchool,
                name: selectionNowProject
            },
            data: contents
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then(data => { 
        console.log(data);
    })
}

pageHeader.querySelector('.save-content').addEventListener('click', saveContent);
