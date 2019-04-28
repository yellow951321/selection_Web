const header = document.getElementById('header')
const addForm = document.getElementById('addForm')
const pageManagement = document.getElementById('page-management')


//handle the delete pop up form
class Delete {
  constructor(){
    this.deleteForm = document.getElementById('delete')
  }
  static showDeleteConfirm(that){
    return (event) =>{
      event.preventDefault()
      $('#delete').modal({
        onApprove : function(){ return true},
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
      let path = campusNode.value
      fetch(`${path}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(res => {
          if(res == 'OK'){
            // window.location.assign(`/man/${user_id}`)
            let box = campusNode.parentNode.parentNode.parentNode.parentNode
            let container = box.parentNode
            box.remove()
            if( container.childElementCount - 1 == 0){
              container.remove()
            }
          }
          else
            throw new Error('刪除失敗')
        })
        .catch(err => {
          throw err
        })
    }
  }
}


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

// init
let del = new Delete()

//refresh dropdwon in addForm
$('select.dropdown')
  .dropdown()

$('.pointing.dropdown')
  .dropdown()

$('.progress')
  .progress({
    text: {
      percent: '{percent} %'
    }
  })

// add event listener

// add event listener to the add button
header.querySelector('.add').addEventListener('click', addButtonClicked)

// add enent listener to the dropdown of addForm
addForm.querySelector('.type-dropdown').firstChild.addEventListener('change', yearDropdownOnChange)

// trigger dropdown on change to refresh the selection of school
addForm.querySelector('.type-dropdown').firstChild.dispatchEvent(new Event('change'))


pageManagement.querySelectorAll('.deleteBtn').forEach( (node) => {
  console.log(node)
  node.addEventListener('click', Delete.showDeleteConfirm(del))
})
