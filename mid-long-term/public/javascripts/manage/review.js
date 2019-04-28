// variables
const header = document.getElementById('header')
const footer = document.getElementById('footer')
const pageEdit = document.getElementById('page-edit')
const pageFilter = document.getElementById('page-filter')
const pageAdvice = document.querySelector('#advice');

class Filter{
    constructor(){
        this.selectedDimension = ''
        this.selectedItem = ''
        this.selectedDetail = ''
        this.htmlTable = this.buildTables()
        this.pageMessage = document.getElementById('page-message')
        this.targetNode = null

        const pathSplit = window.location.pathname.split('/')
        this.selected= {
            userId: pathSplit[2],
            type: pathSplit[3] ? decodeURI(pathSplit[3]) : '',
            campus: pathSplit[4] ? decodeURI(pathSplit[4]) : '',
            dataId: pathSplit[5] ? decodeURI(pathSplit[5]) : '',
        }
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

    static showRecommend(that){
        return (event) => {
            that.targetNode = event.target.parentNode.parentNode.parentNode.parentNode
            event.preventDefault();
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

            let conflictedAspect = pageAdvice.querySelector('.filter.filter__dimension').firstChild.value
            let conflictedKeypoint = pageAdvice.querySelector('.filter.filter__item').firstChild.value
            let conflictedMethod = pageAdvice.querySelector('.filter.filter__detail').firstChild.value
            fetch(`/mid-long-term/${that.selected.userId}/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/review/conflict`, {
                method: 'POST',
                body: JSON.stringify({
                    userId: that.selected.userId,
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
            let node = event.target.parentNode.parentNode.parentNode.parentNode;
            fetch(`/mid-long-term/${that.selected.userId}/${that.selected.type}/${that.selected.campus}/${that.selected.dataId}/review/check`, {
                method: 'POST',
                body: JSON.stringify({
                    id: that.selected.userId,
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
;
// refresh checkbox
$('.ui.checkbox')
    .checkbox()
;

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

pageAdvice.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Filter.dimensionDropdownOnChanged(filter))
pageAdvice.querySelector('.filter.filter__item').firstChild.addEventListener('change', Filter.itemDropdownOnChanged(filter))
pageAdvice.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))
pageAdvice.querySelector('.positive').addEventListener('click', Filter.recommend(filter))