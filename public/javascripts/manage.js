$('select.dropdown')
  .dropdown()
;
const addClicked = () => {
    $('.ui.modal')
    .modal('show')
    ;
}

document.getElementById('add').addEventListener('click', addClicked)

const addProjectClicked = (event) => {
    $('.ui.modal').modal({
        onApprove : function(){return false;}
    }).modal('show');
}

document.getElementById('add-project').addEventListener('click', addProjectClicked)

