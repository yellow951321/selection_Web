import {map, midLongTermFromWord}from 'projectRoot/lib/static/javascripts/mapping/label.js'

// variables
const footer = document.getElementById('footer')
const pageEdit = document.getElementById('page-edit')
const pageFilter = document.getElementById('page-filter')
const pageChange = document.getElementById('changeSelect')
const reserved = pageFilter.querySelector('.reserved')

// function for unsaved content alert
class UnsavedAlert{
  haveUnsaved(targetNode){
    return () => {
      if(!targetNode.classList.contains('editNode--unsaved')){
        targetNode.classList.add('editNode--unsaved')
        // targetNode.classList.remove('editNode--saved')
      }
    }
  }

  addAlertListener(targetNode){
    targetNode.querySelector('.page__start').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.page__end').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.title1').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.title2').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.title3').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.title4').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.content').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.summary').addEventListener('change', this.haveUnsaved(targetNode))
    targetNode.querySelector('.note').addEventListener('change', this.haveUnsaved(targetNode))
  }
  afterSaving(targetNode){
    if(targetNode.classList.contains('editNode--unsaved')){
      targetNode.classList.remove('editNode--unsaved')
    }
  }
}

class Filter{
  constructor(){
    this.selectedAspect = ''
    this.selectedkeypoint = ''
    this.selectedmethod = ''
    this.htmlTable = this.buildTables()
    this.pageMessage = document.getElementById('page-message')
    this.deleteForm = document.getElementById('delete')
    this.dataId = pageFilter.querySelector('.dataId').innerHTML
    this.selectedChangeLabelNode = null;

    //alert user when unsaved data exists
    this.unsaveAlert = new UnsavedAlert()
  }

  // build htmltable
  buildTables(){
    let table = [];
    for(let aspectIndex in map){
      let aspect = map[aspectIndex]
      table[aspectIndex] = {
        table: '',
        keypoint: [],
      };
      for(let keypointIndex in aspect.keypoint){
        let keypoint = aspect.keypoint[keypointIndex]
        if(keypoint.midLongTerm == '')
          continue;
        let keypointLabel = `${ aspect.label }${ keypoint.label }`
        table[aspectIndex].table += `<option value='${ keypointIndex }'>${ keypoint.midLongTerm }(${ keypointLabel })</option>`
        table[aspectIndex]['keypoint'][keypointIndex] = ''
        for(let methodIndex in keypoint.method){
          let method = keypoint.method[methodIndex];
          if(method.midLongTerm == '')
            continue;
          let methodLabel = `${keypointLabel}${method.label}`
          table[aspectIndex]['keypoint'][keypointIndex] += `<option value='${ methodIndex }'>${ method.midLongTerm }(${methodLabel})</option>`
        }
      }
    }
    return table
  }

  // filter button clicked choose Mode
  static chooseMode(that){
    return () => {
      const mode = pageFilter.querySelector('.filter.filter__mode').firstChild.value
      switch (mode){
      case 'edit':
        this.editMode(that)
        break
      case 'check':
        this.checkMode(that)
        break
      default:
        console.log('mode detection failed')
      }
    }
  }

  // filter for the dimension, keypoint, and method
  static editMode(that){
    const aspect = pageFilter.querySelector('.filter.filter__dimension').firstChild
    const keypoint = pageFilter.querySelector('.filter.filter__item').firstChild
    const method = pageFilter.querySelector('.filter.filter__detail').firstChild
    // query parameter for GET
    let parameters = {
      aspect: aspect.value,
      keypoint: keypoint.value,
      method: method.value,
    }
    parameters = Reflect.ownKeys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
    fetch(`/mid-long-term/content/${that.dataId}/filter?${parameters}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(data => {
        that.selectedAspect = Number(aspect.value)
        that.selectedkeypoint = Number(keypoint.value)
        that.selectedMethod = Number(method.value)
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

        // don't show add content button while show all content under certain label
        if(Number(that.selectedAspect) === -1 || Number(that.selectedkeypoint) === -1 || Number(that.selectedMethod) === -1){
          footer.querySelector('.add-content').classList.add('hidden')
        }
        else{
          footer.querySelector('.add-content').classList.remove('hidden')
        }

        // add eventListener to save and delete and changeLabel button
        pageEdit.querySelectorAll('.changeLabel').forEach((button)=> {
          button.addEventListener('click', Filter.showChangeLabel(that))
        })

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
    fetch(`/mid-long-term/content/${that.dataId}/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.text())
    .then(data => {
      pageEdit.innerHTML = ''

      const message = footer.querySelector('.message')
      footer.classList.remove('hidden')
      if(data === ''){
        message.classList.remove('transition')
        message.classList.remove('hidden')
      }
      else{
        pageEdit.insertAdjacentHTML('beforeend', data)
        message.classList.add('transition')
        message.classList.add('hidden')
      }

      // don't show add content button while show all content under certain label
      footer.querySelector('.add-content').classList.add('hidden')

      // add eventListener to check and change button
      Array.apply(null, pageEdit.querySelectorAll('.check')).forEach((button)=> {
        button.addEventListener('click', Filter.checkNodeClicked(that))
      })

      Array.apply(null, pageEdit.querySelectorAll('.change')).forEach((button)=> {
        button.addEventListener('click', Filter.changeNodeClicked(that))
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

  // handle add content button clicked
  static addContentClicked(that){
    const message = footer.querySelector('.message')
    return () => {
      fetch(`/mid-long-term/content/${that.dataId}/add`, {
        method: 'POST',
        body: JSON.stringify({
          aspect: that.selectedAspect,
          keypoint: that.selectedkeypoint,
          method: that.selectedMethod,
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
          pageEdit.lastChild.querySelector('.changeLabel').addEventListener('click', Filter.showChangeLabel(that))

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
  static aspectDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode
      const keypoint = editNode.querySelector('.filter__item').firstChild
      const method = editNode.querySelector('.filter__detail').firstChild
      const defaultkeypoint = 0;
      // if the label is 5 or 6 remove keypoint and method choice
      if(Number(event.target.value) === 5 || Number(event.target.value) === 6 || Number(event.target.value) === -1){
        editNode.querySelector('.keypointBlock').classList.add('visbility--hidden')
        editNode.querySelector('.methodBlock').classList.add('visbility--hidden')
      }
      else {
        editNode.querySelector('.keypointBlock').classList.remove('visbility--hidden')
        editNode.querySelector('.methodBlock').classList.remove('visbility--hidden')
        keypoint.innerHTML = that.htmlTable[event.target.value]['table']
        keypoint.value = defaultkeypoint
        method.innerHTML = that.htmlTable[event.target.value]['keypoint'][keypoint.value]
      }
      // handle show all option
      if(editNode.classList.contains('filter')){
        keypoint.innerHTML += `<option value='-1'>全部</option>`
        method.innerHTML += `<option value='-1'>全部</option>`
      }
    }
  }
  // dropndown keypoint on change
  static keypointDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode
      const aspect = editNode.querySelector('.filter__dimension').firstChild.value
      const method = editNode.querySelector('.filter__detail').firstChild
      if(Number(event.target.value) === -1){
        editNode.querySelector('.methodBlock').classList.add('visbility--hidden')
      }
      else {
        method.innerHTML = that.htmlTable[aspect]['keypoint'][event.target.value]
        editNode.querySelector('.methodBlock').classList.remove('visbility--hidden')
      }
      // handle show all option
      if(editNode.classList.contains('filter')){
        method.innerHTML += `<option value='-1'>全部</option>`
      }
    }
  }
  static modeDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode
      if(event.target.value === 'edit'){
        editNode.querySelector('.aspectBlock').classList.remove('visbility--hidden')
        editNode.querySelector('.keypointBlock').classList.remove('visbility--hidden')
        editNode.querySelector('.methodBlock').classList.remove('visbility--hidden')
      }
      else if(event.target.value === 'check'){
        editNode.querySelector('.aspectBlock').classList.add('visbility--hidden')
        editNode.querySelector('.keypointBlock').classList.add('visbility--hidden')
        editNode.querySelector('.methodBlock').classList.add('visbility--hidden')
      }
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
      fetch(`/mid-long-term/content/save`, {
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
  //handle change label
  static showChangeLabel(that){
    return (event) =>{
      event.preventDefault()
      $('#changeSelect').modal({
        onApprove : function(){return false},
      }).modal('show')
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode
      that.selectedChangeLabelNode = editNode
    }
  }
  static changeLabel(that){
    return () => {
      if(aspect === that.selectedAspect && keypoint === that.selectedkeypoint && method === that.selectedMethod)
        return;
      let aspect = Number(pageChange.querySelector('.filter.filter__dimension').firstChild.value)
      let keypoint = Number(pageChange.querySelector('.filter.filter__item').firstChild.value)
      let method = Number(pageChange.querySelector('.filter.filter__detail').firstChild.value)
      const message = that.pageMessage.querySelector('.message')
      fetch(`/mid-long-term/content/change`, {
        method: 'POST',
        body: JSON.stringify({
          contentId: that.selectedChangeLabelNode.querySelector('.node-index').value,
          aspect,
          keypoint,
          method,
          isChecked: 0,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(data => {
          $('#changeSelect').modal({
            onApprove : function(){return false},
          }).modal('hide')
          if(data !== 'completed'){
            throw new Error('更改標籤失敗')
          }
          that.selectedChangeLabelNode.parentNode.removeChild(that.selectedChangeLabelNode)
          message.classList.remove('red')
          message.classList.add('green')
          message.innerHTML = `<p>更改標籤成功</p>`
          that.fadeOut(that.pageMessage)
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
      fetch(`/mid-long-term/content/delete`, {
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
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode
      const contentId = editNode.querySelector('.node-index').value
      const message = that.pageMessage.querySelector('.message')
      fetch(`/mid-long-term/content/${that.dataId}/check`, {
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
      let aspect = editNode.querySelector('.conflictedAspect').innerHTML
      let keypoint = editNode.querySelector('.conflictedKeypoint').innerHTML
      let method = editNode.querySelector('.conflictedMethod').innerHTML
      method = midLongTermFromWord({aspect, keypoint, method}).method;
      keypoint = midLongTermFromWord({aspect, keypoint}).keypoint;
      aspect = midLongTermFromWord({aspect}).aspect;

      let aspectSelect =  pageChange.querySelector('.filter.filter__dimension')
      aspectSelect.querySelector(`[data-value="${aspect}"]`).click()
      let keypointSelect =  pageChange.querySelector('.filter.filter__item')
      keypointSelect.querySelector(`[data-value="${keypoint}"]`).click()
      let methodSelect = pageChange.querySelector('.filter.filter__detail')
      methodSelect.querySelector(`[data-value="${method}"]`).click()
      $('#changeSelect').modal({
        onApprove : function(){return false},
      }).modal('show')
      that.selectedChangeLabelNode = editNode
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

// refresh checkbox
$('.ui.checkbox')
  .checkbox()


// add event listener
//add window.unbeforeload
window.addEventListener('beforeunload', (e) => {
  e.preventDefault()
  // check if there is unsaved content
  if(pageEdit.querySelector('.red.inverted'))
	  e.returnValue = 'Do you want to leave?'
  return true
})

const goTop = () => {
  document.documentElement.scrollTop = 0
}

// add event listener to dropdowns
pageFilter.querySelector('.filter.filter__mode').firstChild.addEventListener('change', Filter.modeDropdownOnChanged(filter))
pageFilter.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Filter.aspectDropdownOnChanged(filter))
pageFilter.querySelector('.filter.filter__item').firstChild.addEventListener('change', Filter.keypointDropdownOnChanged(filter))
pageChange.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Filter.aspectDropdownOnChanged(filter))
pageChange.querySelector('.filter.filter__item').firstChild.addEventListener('change', Filter.keypointDropdownOnChanged(filter))

// add event listener to the add content button
footer.querySelector('.add-content').addEventListener('click', Filter.addContentClicked(filter))

document.getElementById('arrow').addEventListener('click', goTop)

// add event listener to the choice content button
pageFilter.querySelector('.filter.filter__choice').addEventListener('click', Filter.chooseMode(filter))

// add event listener to the change label button
pageChange.querySelector('.positive').addEventListener('click', Filter.changeLabel(filter))

// initialize dropdown
// pageFilter.querySelector('[data-value="研究"]').click()
pageFilter.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))
pageChange.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))

// if reserved exsists,which means this page was rendered by clicking the graph
// we need to filter the reserved dimension, item, and method
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