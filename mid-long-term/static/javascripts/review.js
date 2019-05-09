import {map, midLongTermFromNumber }from 'projectRoot/lib/static/javascripts/mapping/label.js'

// variables
const pageAdvice = document.querySelector('#advice')

class Filter{
  constructor(){
    this.selectedAspect = ''
    this.selectedkeypoint = ''
    this.selectedmethod = ''
    this.htmlTable = this.buildTables()
    this.pageMessage = document.getElementById('page-message')
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
        table[aspectIndex].table += `<option value='${ keypointIndex }'>${ keypoint.midLongTerm }</option>`
        table[aspectIndex]['keypoint'][keypointIndex] = ''
        for(let methodIndex in keypoint.method){
          table[aspectIndex]['keypoint'][keypointIndex] += `<option value='${ methodIndex }'>${ keypoint.method[methodIndex].midLongTerm }</option>`
        }
      }
    }
    return table
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
      const aspectLabel = that.targetNode.querySelector('.conflictedAspect')
      const keyointLabel = that.targetNode.querySelector('.conflictedKeypoint')
      const methodLabel = that.targetNode.querySelector('.conflictedMethod')

      let conflictedAspect = Number(pageAdvice.querySelector('.filter.filter__dimension').firstChild.value)
      let conflictedKeypoint = Number(pageAdvice.querySelector('.filter.filter__item').firstChild.value)
      let conflictedMethod = Number(pageAdvice.querySelector('.filter.filter__detail').firstChild.value)
      fetch(`/mid-long-term/review/conflict`, {
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
          conflictedMethod = midLongTermFromNumber({aspect: conflictedAspect, keypoint: conflictedKeypoint, method: conflictedMethod}).method
          conflictedKeypoint = midLongTermFromNumber({aspect: conflictedAspect, keypoint: conflictedKeypoint}).keypoint
          conflictedAspect = midLongTermFromNumber({aspect: conflictedAspect}).aspect

          aspectLabel.innerHTML = conflictedAspect
          keyointLabel.innerHTML = conflictedKeypoint
          methodLabel.innerHTML = conflictedMethod
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
      fetch(`/mid-long-term/review/check`, {
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
      const editNode = event.target.parentNode.parentNode.parentNode
      const keypoint = editNode.querySelector('.filter__item').firstChild
      const method = editNode.querySelector('.filter__detail').firstChild
      const defaultkeypoint = 0;
      // if the label value is 5 or 6 or -1 remove keypoint and method choice
      if(Number(event.target.value) === 5 || Number(event.target.value) === 6 || Number(event.target.value) === -1){
        editNode.querySelector('.keypointBlock').classList.add('visbility--hidden')
        editNode.querySelector('.methodBlock').classList.add('visbility--hidden')
      }
      else {
        editNode.querySelector('.keypointBlock').classList.remove('visbility--hidden')
        editNode.querySelector('.methodBlock').classList.remove('visbility--hidden')
      }
      keypoint.innerHTML = that.htmlTable[event.target.value]['table']
      keypoint.value = defaultkeypoint
      method.innerHTML = that.htmlTable[event.target.value]['keypoint'][keypoint.value]
    }
  }
  // dropndown item on change
  static keypointDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode
      const aspect = editNode.querySelector('.filter__dimension').firstChild.value
      const method = editNode.querySelector('.filter__detail').firstChild
      method.innerHTML = that.htmlTable[aspect]['keypoint'][event.target.value]
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


// initialize dropdown
// pageFilter.querySelector('[data-value="研究"]').click()
// pageFilter.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))

// test

// document.querySelector('.success').addEventListener('click', (event) => {
//   $('#advice').modal({
//     onApprove : function(){return false},
//   }).modal('show')
// })

Array.apply(null, document.querySelectorAll('.recommend')).forEach((button) => {
  button.addEventListener('click', Filter.showRecommend(filter))
})
Array.apply(null, document.querySelectorAll('.check')).forEach((button) => {
  button.addEventListener('click', Filter.check(filter))
})

pageAdvice.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Filter.aspectDropdownOnChanged(filter))
pageAdvice.querySelector('.filter.filter__item').firstChild.addEventListener('change', Filter.keypointDropdownOnChanged(filter))
pageAdvice.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))
pageAdvice.querySelector('.positive').addEventListener('click', Filter.recommend(filter))