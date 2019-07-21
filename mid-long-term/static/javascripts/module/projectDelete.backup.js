// backup for show delete confirm pop up
class Delete {
  constructor(){
    this.deleteForm = document.getElementById('delete')
  }
  static showDeleteConfirm(that){
    return (event) =>{
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