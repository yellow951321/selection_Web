// variables
const header = document.getElementById('header')
const pageManagement = document.getElementById('page-management')

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

// handle delete
// show delete confirm popup
class Delete {
  constructor(){
    this.deleteForm = document.getElementById('delete')
  }
  static showDeleteConfirm(that){
    return (event) =>{
      // @TODO remove form after changing delete dependencies to database id
      event.preventDefault()
      $('#delete').modal({
        onApprove : function(){return false},
      }).modal('show')
      const campusNode = event.target
      if(that.lastDeleteEvent)
        that.deleteForm.querySelector('.positive').removeEventListener('click', that.lastDeleteEvent)
      that.lastDeleteEvent = Delete.deleteContent(that, campusNode)
      that.deleteForm.querySelector('.positive').addEventListener('click', that.lastDeleteEvent)
    }
  }
  // handle delete event
  static deleteContent(that, campusNode){
    return () =>{
      const dataId = campusNode.querySelector('.dataId').value
      const user_id = campusNode.querySelector('.user_id').value
      fetch(`/man/${user_id}/file/delete`, {
        method: 'DELETE',
        body: JSON.stringify({
          dataId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(res => {
          if(res == 'OK')
            window.location.assign(`/man/${user_id}`)
          else
            throw new Error('刪除失敗')
        })
        .catch(err => {
          throw err
        })
    }
  }
}
// init

let del = new Delete()
//refresh dropdwon in addForm
$('select.dropdown')
  .dropdown()

// add event listener

// add event listener to the add button
header.querySelector('.add').addEventListener('click', addButtonClicked)

// add event listender to all the nodes
pageManagement.querySelectorAll('.node').forEach((node) => {
  node.addEventListener('submit', Delete.showDeleteConfirm(del))
})

// add enent listener to the dropdown of addForm
addForm.querySelector('.type-dropdown').firstChild.addEventListener('change', yearDropdownOnChange)

// trigger dropdown on change to refresh the selection of school
addForm.querySelector('.type-dropdown').firstChild.dispatchEvent(new Event('change'))