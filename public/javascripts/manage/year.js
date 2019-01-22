const header = document.getElementById('header')

// variables > functions

// add project button clicked
const addButtonClicked = (event) => {
  $('#addForm').modal({
    onApprove : function(){return false},
  }).modal('show')
}

// init

//refresh dropdwon in addForm
$('select.dropdown')
  .dropdown()

// add event listener

// add event listener to the add button
header.querySelector('.add').addEventListener('click', addButtonClicked)
