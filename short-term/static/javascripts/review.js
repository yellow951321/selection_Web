import {map, shortTermFromNumber }from 'projectRoot/lib/static/javascripts/mapping/label.js'

// variables
const pageAdvice = document.getElementById('advice')
const pageFilter = document.getElementById('page-filter')
const pageAudit = document.getElementById('page-audit')
const footer = document.getElementById('footer')

class Filter{
  constructor(){
    this.selectedAspect = ''
    this.selectedkeypoint = ''
    this.selectedmethod = ''
    this.htmlTable = this.buildTables()
    this.pageMessage = document.getElementById('page-message')
    this.dataId = pageFilter.querySelector('.dataId').innerHTML
    this.targetNode = null
  }

  // build htmltable
  buildTables(){
    let table = {
      item: {},
      detail: {},
    }
    for(let aspectIndex in map){
      let aspect = map[aspectIndex]
      table[aspectIndex] = {
        table: '',
        keypoint: [],
      };
      for(let keypointIndex in aspect.keypoint){
        let keypoint = aspect.keypoint[keypointIndex]
        let keypointLabel = `${ aspect.label }${ keypoint.label }`
        table[aspectIndex].table += `<option value='${ keypointIndex }'>${ keypoint.shortTerm }(${ keypointLabel })</option>`
        table[aspectIndex]['keypoint'][keypointIndex] = ''
        for(let methodIndex in keypoint.method){
          let method = keypoint.method[methodIndex];
          let methodLabel = `${keypointLabel}${method.label}`
          table[aspectIndex]['keypoint'][keypointIndex] += `<option value='${ methodIndex }'>${ method.shortTerm }(${methodLabel})</option>`
        }
      }
    }
    return table
  }

  static chooseMode(that){
    return (event) => {
      const mode = pageFilter.querySelector('.filter.filter__mode').firstChild.value
      switch (mode){
      case 'view':
        this.viewAndAuditMode(that, 'view')
        break
      case 'audit':
        this.viewAndAuditMode(that, 'audit')
        break
      default:
        console.log('mode detection failed')
      }
    }
  }

  static viewAndAuditMode(that, mode){
    const aspect = pageFilter.querySelector('.filter.filter__dimension').firstChild
    const keypoint = pageFilter.querySelector('.filter.filter__item').firstChild
    const method = pageFilter.querySelector('.filter.filter__detail').firstChild
    const message = that.pageMessage.querySelector('.message')
    let isChecked;
    if(mode === 'audit'){
      isChecked = 0
    }
    else{
      isChecked = 1
    }
    // query parameter for GET
    let parameters = {
      aspect: aspect.value,
      keypoint: keypoint.value,
      method: method.value,
      isChecked,
    }
    console.log(parameters)
    parameters = Reflect.ownKeys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
    fetch(`/short-term/review/${that.dataId}/filter?${parameters}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(data => {
        that.selectedAspect = Number(aspect.value)
        that.selectedkeypoint = Number(keypoint.value)
        that.selectedmethod = Number(method.value)
        pageAudit.innerHTML = ''
        if(data === ''){
          footer.classList.remove('hidden')
          return
        }
        else{
          footer.classList.add('hidden')
        }
        // if there is no project in this campus yet
        pageAudit.insertAdjacentHTML('beforeend', data)


        // add eventListener to showRecommend and check button
        Array.apply(null, document.querySelectorAll('.recommend')).forEach((button) => {
          button.addEventListener('click', Filter.showRecommend(filter))
        })
        Array.apply(null, document.querySelectorAll('.check')).forEach((button) => {
          button.addEventListener('click', Filter.check(filter))
        })
      })
      .catch(err => {
        message.classList.remove('green')
        message.classList.add('red')
        message.innerHTML = `<p>${err.message}</p>`
        that.fadeOut(that.pageMessage)
      })
  }

  static showRecommend(that){
    return (event) => {
      that.targetNode = event.target.parentNode.parentNode.parentNode.parentNode
      event.preventDefault()
      $('#advice').modal({
        onApprove : function(){return false},
      }).modal('show')
    }
  }

  static recommend(that){
    const message = that.pageMessage.querySelector('.message')
    return (event) => {
      event.preventDefault()

      let conflictedAspect = Number(pageAdvice.querySelector('.filter.filter__dimension').firstChild.value)
      let conflictedKeypoint = Number(pageAdvice.querySelector('.filter.filter__item').firstChild.value)
      let conflictedMethod = Number(pageAdvice.querySelector('.filter.filter__detail').firstChild.value)
      fetch(`/short-term/review/conflict`, {
        method: 'POST',
        body: JSON.stringify({
          contentId: that.targetNode.querySelector('.node-index').value,
          conflictedAspect,
          conflictedKeypoint,
          conflictedMethod,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(data => {
          $('#advice').modal({
            onApprove : function(){return false},
          }).modal('hide')
          that.targetNode.parentNode.removeChild(that.targetNode)

        })
        .catch(err => {
          message.classList.remove('green')
          message.classList.add('red')
          message.innerHTML = `<p>${err.message}</p>`
          that.fadeOut(that.pageMessage)
        })
    }
  }
  static check(that){
    const message = that.pageMessage.querySelector('.message')
    return (event) => {
      event.preventDefault()
      let node = event.target.parentNode.parentNode.parentNode.parentNode
      fetch(`/short-term/review/check`, {
        method: 'POST',
        body: JSON.stringify({
          contentId: node.querySelector('.node-index').value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.text())
        .then(data => {
          if(data === 'completed'){
            node.parentNode.removeChild(node)
          }
          else{
            throw new Error('check failed')
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
  // dropndown item on change
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

// add event listener to the choice content button
pageFilter.querySelector('.filter.filter__choice').addEventListener('click', Filter.chooseMode(filter))

pageAdvice.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Filter.aspectDropdownOnChanged(filter))
pageAdvice.querySelector('.filter.filter__item').firstChild.addEventListener('change', Filter.keypointDropdownOnChanged(filter))
pageAdvice.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))
pageAdvice.querySelector('.positive').addEventListener('click', Filter.recommend(filter))

pageFilter.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Filter.aspectDropdownOnChanged(filter))
pageFilter.querySelector('.filter.filter__item').firstChild.addEventListener('change', Filter.keypointDropdownOnChanged(filter))
pageFilter.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))