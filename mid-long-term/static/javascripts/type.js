const header = document.getElementById('header')

// variables > functions

// add project button clicked
const addButtonClicked = (event) => {
  $('#addForm').modal({
    onApprove : function(){return false},
  }).modal('show')
}

// handle dropdown on change
const yearDropdownOnChange = (event) => {
  const campusesDropDown = event.target.parentNode.parentNode.querySelector('.campus-dropdown').firstChild
  if(event.target.value == '0'){
    // find the innerHTML of .normal
    campusesDropDown.innerHTML = event.target.parentNode.parentNode.querySelector('.normal').innerHTML
  }
  else if(event.target.value == '1'){
    // find the innerHTML of .others
    campusesDropDown.innerHTML = event.target.parentNode.parentNode.querySelector('.others').innerHTML
  }
}

const restrictYear = (event) => {
  let to = parseInt(addForm.querySelector('.yearTo').value)
  let from = parseInt(addForm.querySelector('.yearFrom').value)
  if(from >= to)
    addForm.querySelector('.yearTo').value = ++from
}

// init

//refresh dropdwon in addForm
$('select.dropdown')
  .dropdown()

// add event listener

// add event listener to the add button
header.querySelector('.add').addEventListener('click', addButtonClicked)

// add event listener to the dropdown of addForm
addForm.querySelector('.type-dropdown').firstChild.addEventListener('change', yearDropdownOnChange)

// trigger dropdown on change to refresh the selection of school
addForm.querySelector('.type-dropdown').firstChild.dispatchEvent(new Event('change'))

addForm.querySelector('.yearTo').addEventListener('change', restrictYear)

addForm.querySelector('.yearFrom').addEventListener('change', restrictYear)