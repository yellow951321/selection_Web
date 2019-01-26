// variables
const header = document.getElementById('header')
const footer = document.getElementById('footer')
const pageEdit = document.getElementById('page-edit')
const pageFilter = document.getElementById('page-filter')

class Filter{
  constructor(){
    this.selectedDimension = ''
    this.selectedItem = ''
    this.selectedDetail = ''
    this.htmlTable = this.buildTables()
    this.pageMessage = document.getElementById('page-message')
    this.deleteForm = document.getElementById('delete')

    const pathSplit = window.location.pathname.split('/')
    this.selected= {
      userId: pathSplit[2],
      year: pathSplit[3] ? decodeURI(pathSplit[3]) : '',
      type: pathSplit[4] ? decodeURI(pathSplit[4]) : '',
      school: pathSplit[5] ? decodeURI(pathSplit[5]) : ''
    }
  }

  // build htmltable
  buildTables(){
    let table = {
      item: {},
      detail: {},
    };
    Reflect.ownKeys(schema).forEach((dimension) => {
      table['item'][dimension] = '';
      if(schema[dimension] instanceof Object){
        Reflect.ownKeys(schema[dimension]).forEach((item) =>{
          table['detail'][item] = '';
          Reflect.ownKeys(schema[dimension][item]).forEach((detail) =>{
            table['detail'][item] += `<option value='${ detail }'>${ detail }</option>`
          })
          table['item'][dimension] += `<option value='${ item }'>${ item }</option>`
        })
      }
    })
    return table;
  }

  // filter for the dimension, item, and detail
  static filter(that){
    const dimension = pageFilter.querySelector('.filter.filter__dimension').firstChild
    const item = pageFilter.querySelector('.filter.filter__item').firstChild
    const detail = pageFilter.querySelector('.filter.filter__detail').firstChild
    return ()=>{
      // query parameter for GET
      let parameters = {
        id: that.selected.userId,
        year: that.selected.year,
        type: that.selected.type,
        campus: that.selected.school,
        dimension: dimension.value,
        item: item.value,
        detail: detail.value,
      }
      parameters = Reflect.ownKeys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
      fetch(`/man/${that.selected.userId}/content/filter?${parameters}`, {
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
        const message = footer.querySelector('.message');
        if(data === ''){
          message.classList.remove('transition');
          message.classList.remove('hidden');
        }
        else{
          // @TODO turn data into json format and render at frontend
          pageEdit.insertAdjacentHTML('beforeend', data)
          message.classList.add('transition');
          message.classList.add('hidden');
        }
        pageEdit.querySelectorAll('.save').forEach((button)=> {
          button.addEventListener('click', Filter.saveContent(that))
        })
        pageEdit.querySelectorAll('.delete').forEach((button)=> {
          button.addEventListener('click', Filter.showDeleteConfirm(that))
        })
      })
      .catch(err => {
        message.classList.remove('green')
        message.classList.add('red')
        message.innerHTML = `<p>${err.message}</p>`
        that.fadeOut(that.pageMessage)
      })
    }
  }

  // handle add content button clicked
  static addContentClicked(that){
    const message = footer.querySelector('.message');
    return  () => {
      fetch(`/man/${that.selected.userId}/content/add`, {
        method: 'POST',
        body: JSON.stringify({
          id: that.selected.userId,
          year: that.selected.year,
          type: that.selected.type,
          campus: that.selected.school,
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
        message.classList.add('transition');
        message.classList.add('hidden');
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
      detail.innerHTML = that.htmlTable['detail'][item.value]
    }
  }
  // dropndown item on change
  static itemDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode
      const detail = editNode.querySelector('.filter__detail').firstChild
      detail.innerHTML = that.htmlTable['detail'][event.target.value]
    }
  }

  // handle save button clicked
  static saveContent (that){
    return (event) => {
      // @TODO remove form after changing delete dependencies to database id
      event.preventDefault();

      const message = that.pageMessage.querySelector('.message')
      const editNode = event.target.parentNode.parentNode.parentNode.parentNode
      const startPage = editNode.querySelector('.page__start').value
      const endPage = editNode.querySelector('.page__end').value
      const title = editNode.querySelector('.title').value
      const content = editNode.querySelector('.content').value
      // @TODO save by id
      const content_id = editNode.querySelector('.node-index').value

      fetch(`/man/${that.selected.userId}/content/save`, {
        method: 'POST',
        body: JSON.stringify({
          id: that.selected.userId,
          // year: that.selected.year,
          // type: that.selected.type,
          // campus: that.selected.school,
          // dimension: that.selectedDimension,
          // item: that.selectedItem,
          // detail: that.selectedDetail,
          page: {
            start: startPage,
            end: endPage,
          },
          content_id: content_id,
          title: title,
          content: content,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.text())
      .then(data => {
        message.classList.remove('red')
        message.classList.add('green')
        message.innerHTML = '<p>儲存成功</p>'
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
      // @TODO remove form after changing delete dependencies to database id
      event.preventDefault();
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
      // @TODO delete by id
      const content_id = editNode.querySelector('.node-index').value
      const message = that.pageMessage.querySelector('.message')
      fetch(`/man/${that.selected.userId}/content/delete`, {
        method: 'DELETE',
        body: JSON.stringify({
          content_id: content_id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.text())
      .then(data => {
        editNode.parentNode.removeChild(editNode)
        $('#delete').modal({
          onApprove : function(){return false},
        }).modal('hide')
        message.classList.remove('red')
        message.classList.add('green')
        message.innerHTML = '<p>刪除成功</p>'
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

  //FadeOut function for save and delte message
  fadeOut(el){
    el.classList.remove('hidden')
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.classList.remove('hidden')
      } else {
        setTimeout(fade, 250);
      }
    })();
  }
}

const filter = new Filter();

// init
// refresh dropdown
$('select.dropdown')
  .dropdown()

// add event listener
// add event listener to dropdowns
pageFilter.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Filter.dimensionDropdownOnChanged(filter))
pageFilter.querySelector('.filter.filter__item').firstChild.addEventListener('change', Filter.itemDropdownOnChanged(filter))

// add event listener to the add content button
footer.querySelector('.add-content').addEventListener('click', Filter.addContentClicked(filter))

// add event listener to the choice content button
pageFilter.querySelector('.filter.filter__choice').addEventListener('click', Filter.filter(filter))

// initialize dropdown
pageFilter.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'));