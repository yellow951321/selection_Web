// variables
const header = document.getElementById('header')
const footer = document.getElementById('footer')
const pageEdit = document.getElementById('page-edit')
const pageFilter = document.getElementById('page-filter')
const reserved = pageFilter.querySelector('.reserved')

// function for unsaved content alert
class UnsavedAlert{
  haveUnsaved(targetNode){
    return () => {
      if(!targetNode.classList.contains('editNode--unsaved')){
        targetNode.classList.add('editNode--unsaved')
        // targetNode.classList.add('inverted')
      }
    }
  }

  addAlertListener(targetNode){
    targetNode.querySelector('.page__start').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.page__end').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.title').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.content').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.summary').addEventListener('change', this.haveUnsaved(targetNode))
  }
  afterSaving(targetNode){
    if(targetNode.classList.contains('editNode--unsaved')){
      targetNode.classList.remove('editNode--unsaved')
      // targetNode.classList.remove('inverted')
      targetNode.classList.add('editNode--saved')
    }
  }
}

class Filter{
  constructor(){
    this.selectedDimension = ''
    this.selectedItem = ''
    this.selectedDetail = ''
    this.htmlTable = this.buildTables()
    this.pageMessage = document.getElementById('page-message')
    this.deleteForm = document.getElementById('delete')
    this.dataId = pageFilter.querySelector('.dataId').innerHTML

    const pathSplit = window.location.pathname.split('/')
    this.selected= {
      type: pathSplit[2],
      campus: pathSplit[3] ? decodeURI(pathSplit[3]) : '',
      dataId: pathSplit[4] ? decodeURI(pathSplit[4]) : '',
    }

    //alert user when unsaved data exists
    this.unsaveAlert = new UnsavedAlert()
  }

  // build htmltable
  buildTables(){
    let table = {
      item: {},
      detail: {},
    }
    Reflect.ownKeys(schema).forEach((dimension) => {
      table['item'][dimension] = ''
      if(schema[dimension] instanceof Object){
        Reflect.ownKeys(schema[dimension]).forEach((item) =>{
          Reflect.ownKeys(schema[dimension][item]).forEach((detail) =>{
            if(table['detail'][dimension] === undefined)
              table['detail'][dimension] = {}
            if(table['detail'][dimension][item] === undefined)
              table['detail'][dimension][item] = ''
            table['detail'][dimension][item] += `<option value='${ detail }'>${ detail }</option>`
          })
          table['item'][dimension] += `<option value='${ item }'>${ item }</option>`
        })
      }
    })
    return table
  }

  // filter button clicked choose Mode
  static chooseMode(that){
    return () => {
      const mode = pageFilter.querySelector('.filter.filter__mode').firstChild.value;
      switch (mode){
        case 'edit':
          this.editMode(that);
          break;
        case 'check':
          this.checkMode(that);
          break;
        default:
          console.log('mode detection failed');
      }
    }
  }

  // filter for the dimension, item, and detail
  static editMode(that){
    const dimension = pageFilter.querySelector('.filter.filter__dimension').firstChild
    const item = pageFilter.querySelector('.filter.filter__item').firstChild
    const detail = pageFilter.querySelector('.filter.filter__detail').firstChild
    // query parameter for GET
    let parameters = {
      dataId: that.dataId,
      dimension: dimension.value,
      item: item.value,
      detail: detail.value,
    }
    parameters = Reflect.ownKeys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
    fetch(`/mid-long-term/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/content/filter?${parameters}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(data => {
        that.selectedDimension = dimension.value
        that.selectedItem = item.value
        that.selectedDetail = detail.value
        footer.classList.remove('hidden')
        footer.classList.remove('transition')

        pageEdit.innerHTML = ''
        // if there is no project in this campus yet
        const message = footer.querySelector('.message')
        if(data === ''){
          message.classList.remove('transition')
          message.classList.remove('hidden')
        }
        else{
          pageEdit.insertAdjacentHTML('beforeend', data)
          message.classList.add('transition')
          message.classList.add('hidden')
        }

        // add eventListener to save and delete button
        pageEdit.querySelectorAll('.save').forEach((button)=> {
          button.addEventListener('click', Filter.saveContent(that))
        })
        pageEdit.querySelectorAll('.delete').forEach((button)=> {
          button.addEventListener('click', Filter.showDeleteConfirm(that))
        })

        // add unsavedAlert to all editNodes
        pageEdit.querySelectorAll('.editNode').forEach((targetNode) => {
          that.unsaveAlert.addAlertListener(targetNode)
        })
      })
      .catch(err => {
        const message = footer.querySelector('.message')
        message.classList.remove('green')
        message.classList.add('red')
        message.innerHTML = `<p>${err.message}</p>`
        that.fadeOut(that.pageMessage)
      })
  }

  static checkMode(that){
    fetch(`/mid-long-term/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/content/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(data => {
          pageEdit.innerHTML = ''
          pageEdit.insertAdjacentHTML('beforeend', data)

          // add eventListener to check and change button
          Array.apply(null, pageEdit.querySelectorAll('.check')).forEach((button)=> {
            button.addEventListener('click', Filter.checkNodeClicked(that))
          })

          Array.apply(null, pageEdit.querySelectorAll('.change')).forEach((button)=> {
            button.addEventListener('click', Filter.changeNodeClicked(that))
          })

          footer.classList.add('hidden')
          footer.classList.add('transition')
      })
      .catch(err => {
        const message = footer.querySelector('.message')
        message.classList.remove('green')
        message.classList.add('red')
        message.innerHTML = `<p>${err.message}</p>`
        that.fadeOut(that.pageMessage)
      })
  }

  // handle add content button clicked
  static addContentClicked(that){
    const message = footer.querySelector('.message')
    return () => {
      fetch(`/mid-long-term/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/content/add`, {
        method: 'POST',
        body: JSON.stringify({
          type: that.selected.type,
          campus: that.selected.campus,
          dataId: that.selected.dataId,
          dimension: that.selectedDimension,
          item: that.selectedItem,
          detail: that.selectedDetail,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(data => {
          pageEdit.insertAdjacentHTML('beforeend', data)
          pageEdit.lastChild.querySelector('.save').addEventListener('click', Filter.saveContent(that))
          pageEdit.lastChild.querySelector('.delete').addEventListener('click', Filter.showDeleteConfirm(that))
          message.classList.add('transition')
          message.classList.add('hidden')

          that.unsaveAlert.addAlertListener(pageEdit.lastChild)
        })
        .catch(err => {
          message.classList.remove('green')
          message.classList.add('red')
          message.innerHTML = `<p>${err.message}</p>`
          that.fadeOut(that.pageMessage)
        })
    }
  }

  // dropdown on change
  // dropdown dimension on change
  static dimensionDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode
      const item = editNode.querySelector('.filter__item').firstChild
      const detail = editNode.querySelector('.filter__detail').firstChild
      const defaultItem = Object.keys(schema[event.target.value])[0]
      item.innerHTML = that.htmlTable['item'][event.target.value]
      item.value = defaultItem
      detail.innerHTML = that.htmlTable['detail'][event.target.value][item.value]
    }
  }
  // dropndown item on change
  static itemDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode
      const dimensionName = editNode.querySelector('.filter__dimension').querySelector('.text').innerHTML
      const detail = editNode.querySelector('.filter__detail').firstChild
      detail.innerHTML = that.htmlTable['detail'][dimensionName][event.target.value]
    }
  }

  // handle save button clicked
  static saveContent(that){
    return (event) => {
      event.preventDefault()

      const message = that.pageMessage.querySelector('.message')
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode
      const startPage = editNode.querySelector('.page__start').value
      const endPage = editNode.querySelector('.page__end').value
      const title1 = editNode.querySelector('.title1').value
      const title2 = editNode.querySelector('.title2').value
      const title3 = editNode.querySelector('.title3').value
      const title4 = editNode.querySelector('.title4').value
      const content = editNode.querySelector('.content').value
      const contentId = editNode.querySelector('.node-index').value
      const summary = editNode.querySelector('.summary').value
      const note = editNode.querySelector('.note').value
      console.log(content+summary+note)
      fetch(`/mid-long-term/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/content/save`, {
        method: 'POST',
        body: JSON.stringify({
          page: {
            start: startPage,
            end: endPage,
          },
          contentId,
          title1,
          title2,
          title3,
          title4,
          content,
          summary,
          note,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(res => {
          if(res === 'completed'){
            message.classList.remove('red')
            message.classList.add('green')
            message.innerHTML = '<p>儲存成功</p>'
            that.fadeOut(that.pageMessage)

            // reset alert after saving
            that.unsaveAlert.afterSaving(editNode)
          }
          else{
            throw new Error('save failed')
          }
        })
        .catch(err => {
          message.classList.remove('green')
          message.classList.add('red')
          message.innerHTML = `<p>${err.message}</p>`
          that.fadeOut(that.pageMessage)
        })
    }
  }

  // handle delete
  // show delete confirm popup
  static showDeleteConfirm(that){
    return (event) =>{
      event.preventDefault()
      $('#delete').modal({
        onApprove : function(){return false},
      }).modal('show')
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode
      if(that.lastDeleteEvent)
        that.deleteForm.querySelector('.positive').removeEventListener('click', that.lastDeleteEvent)
      that.lastDeleteEvent = Filter.deleteContent(that, editNode)
      that.deleteForm.querySelector('.positive').addEventListener('click', that.lastDeleteEvent)
    }
  }
  // handle delete event
  static deleteContent(that, editNode){
    return () =>{
      const contentId = editNode.querySelector('.node-index').value
      const message = that.pageMessage.querySelector('.message')
      fetch(`/mid-long-term/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/content/delete`, {
        method: 'DELETE',
        body: JSON.stringify({
          contentId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(res => {
          if(res === 'completed'){
            editNode.parentNode.removeChild(editNode)
            $('#delete').modal({
              onApprove : function(){return false},
            }).modal('hide')
            message.classList.remove('red')
            message.classList.add('green')
            message.innerHTML = '<p>刪除成功</p>'
            that.fadeOut(that.pageMessage)
          }
          else{
            throw new Error('delete failed')
          }
        })
        .catch(err => {
          message.classList.remove('green')
          message.classList.add('red')
          message.innerHTML = `<p>${err.message}</p>`
          that.fadeOut(that.pageMessage)
        })
    }
  }

  static checkNodeClicked(that){
    return (event) => {
      event.preventDefault()
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode.parentNode
      const contentId = editNode.querySelector('.node-index').value
      const message = that.pageMessage.querySelector('.message')
      fetch(`/mid-long-term/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/content/check`, {
        method: 'POST',
        body: JSON.stringify({
          contentId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(res => {
          if(res === 'completed'){
            editNode.parentNode.removeChild(editNode)
          }
          else{
            throw new Error('delete failed')
          }
        })
        .catch(err => {
          message.classList.remove('green')
          message.classList.add('red')
          message.innerHTML = `<p>${err.message}</p>`
          that.fadeOut(that.pageMessage)
        })
    }
  }

  static changeNodeClicked(that){
    return (event) => {
      event.preventDefault()
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode.parentNode
      const contentId = editNode.querySelector('.node-index').value
      const message = that.pageMessage.querySelector('.message')
      const aspect = editNode.querySelector('.conflictedAspect').innerHTML
      const keypoint = editNode.querySelector('.conflictedKeypoint').innerHTML
      const method = editNode.querySelector('.conflictedMethod').innerHTML

      fetch(`/mid-long-term/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/content/change`, {
        method: 'POST',
        body: JSON.stringify({
          contentId,
          aspect,
          keypoint,
          method,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(res => {
          if(res === 'completed'){
            editNode.parentNode.removeChild(editNode)
          }
          else{
            throw new Error('delete failed')
          }
        })
        .catch(err => {
          message.classList.remove('green')
          message.classList.add('red')
          message.innerHTML = `<p>${err.message}</p>`
          that.fadeOut(that.pageMessage)
        })
    }
  }

  //FadeOut function for save and delte message
  fadeOut(el){
    el.classList.remove('hidden')
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.classList.remove('hidden')
      } else {
        setTimeout(fade, 250)
      }
    })()
  }
}

const filter = new Filter()

// init
// refresh dropdown
$('select.dropdown')
  .dropdown()
;
// refresh checkbox
$('.ui.checkbox')
  .checkbox()
;

// add event listener
//add window.unbeforeload
window.addEventListener('beforeunload', (e) => {
  e.preventDefault()
  // check if there is unsaved content
  if(pageEdit.querySelector('.red.inverted'))
	  e.returnValue = 'Do you want to leave?'
  return true
})

// add event listener to dropdowns
pageFilter.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Filter.dimensionDropdownOnChanged(filter))
pageFilter.querySelector('.filter.filter__item').firstChild.addEventListener('change', Filter.itemDropdownOnChanged(filter))

// add event listener to the add content button
footer.querySelector('.add-content').addEventListener('click', Filter.addContentClicked(filter))

// add event listener to the choice content button
pageFilter.querySelector('.filter.filter__choice').addEventListener('click', Filter.chooseMode(filter))

// initialize dropdown
// pageFilter.querySelector('[data-value="研究"]').click()
pageFilter.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))

// if reserved exsists,which means this page was rendered by clicking the graph
// we need to filter the reserved dimension, item, and detail
if(reserved.querySelector('.reserved__dimension') !== null){
  let dim = reserved.querySelector('.reserved__dimension').innerHTML
  let itm = reserved.querySelector('.reserved__item').innerHTML
  let det = reserved.querySelector('.reserved__detail').innerHTML

  new Promise((res, rej) => {
    pageFilter.querySelector(`[data-value="${dim}"]`).click()
    res()
  })
    .then(() => {
      pageFilter.querySelector(`[data-value="${itm}"]`).click()
    })
    .then(() => {
      pageFilter.querySelector(`[data-value="${det}"]`).click()
    })
    .then(()=> {
      pageFilter.querySelector('.filter.filter__choice').click()
    })
}