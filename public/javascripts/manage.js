// variables
const pageSelect = document.getElementById('page-select');
const pageManagement = document.getElementById('page-management');
const pageEdit = document.getElementById('page-edit');
let sessionId = '123';
//init
// pageEdit.style.display = 'none';

// dropdown
$('select.dropdown')
  .dropdown()
;

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
        pageManagement.insertAdjacentHTML('beforeend', data);
    })    

    $('.ui.modal').modal('hide');
})

// variables for selection, manage, edit

// selection variable
let selectionNowPage = 'start';
let selectionNowYear = '';
let selectionNowType = '';
let selectionNowSchool = '';
let selectionNowProject = '';

// page-management 

// page-mnaagement > variables
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
            childs[childs.length-1].querySelector( '.edit' ).addEventListener( 'click', projectSelected);
            childs[childs.length-1].querySelector( '.delete' ).addEventListener( 'click', projectDeleted);            
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


