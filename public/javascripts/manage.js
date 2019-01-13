// variables
const pageSelect = document.getElementById('page-select');
const pageManagement = document.getElementById('page-management');
const pageEdit = document.getElementById('page-edit');

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
            'sessionID': '123',
            'info': {
                'year': year.value,
                'campus': school.value,
                'name': project.value,
                'type': type.type
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })   
    .then(res => res.text())
    .then(data => {
        console.log(typeof data);
        pageManagement.insertAdjacentHTML('beforeend', data);
    })    

    $('.ui.modal').modal('hide');
})