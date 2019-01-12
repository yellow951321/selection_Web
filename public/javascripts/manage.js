const host = 'localhost:3000';

$('select.dropdown')
  .dropdown()
;
const addClicked = () => {
    $('.ui.modal')
    .modal('show')
    ;
};

document.getElementById('add').addEventListener('click', addClicked);

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

    const reqURL = 'http://' + host + '/man/add';
    const project = addForm.querySelector('.addForm__project');
    const year = addForm.querySelector('.addForm__year');
    const school = addForm.querySelector('.addForm__school');
    const type = addForm.querySelector('.addForm__type');

    fetch(reqURL, {
        method: 'post',
        body: JSON.stringify({
            'sessionID': '123',
            'info': {
                'year': year.value,
                'campus': school.value,
                'name': project.value,
                'type': school.type, 
            }
        }),
        headers: {
            'Content-Type': 'addliction/json'
        }
    })   
    .then(res => res.json())
    .then(data => {
        console.log(res);
    })
    

    $('.ui.modal').modal('hide');
})