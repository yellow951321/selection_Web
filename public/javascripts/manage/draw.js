//Variables
const pageFilter = document.getElementById('page-filter')
const reserved = pageFilter.querySelector('.reserved')

class Draw {
  constructor() {
    this.selectedDimension = ''
    this.selectedItem = ''
    this.selectedDetail = ''
    this.htmlTable = this.buildTables()

    const pathSplit = window.location.pathname.split('/')
    this.selected = {
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
}


const draw = new Draw()

const retrieveSpecficData = ()=>{
  const dimension = pageFilter.querySelector('.filter.filter__dimension').firstChild
  const item = pageFilter.querySelector('.filter.filter__item').firstChild
  const detial = pageFilter.querySelector('.filter.filter__detail').firstChild
}

function retrieveAllData() {
  const pathSplit = window.location.pathname.split('/')
  const selected = {
    userId: pathSplit[2],
    year: pathSplit[3] ? decodeURI(pathSplit[3]) : '',
    type: pathSplit[4] ? decodeURI(pathSplit[4]) : '',
    campus: pathSplit[5] ? decodeURI(pathSplit[5]) : ''
  }
  console.log(selected)
  // query parameter for GET
  console.log('Enter')
  let parameters = {
    id: selected.userId,
    year: selected.year,
    type: selected.type,
    campus: selected.campus
  }
  parameters = Reflect.ownKeys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
  fetch(`/man/${selected.userId}/${selected.year}/${selected.type}/${selected.campus}/graph/all?${parameters}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(res => res.text())
  .then(data => {
    console.log(data)
    data = JSON.parse(data)
    drawBarChart(data,{
      id: selected.userId,
      year: selected.year,
      type: selected.type,
      campus: selected.campus
    })
  })

}

const zippedData = (data) => {
  let zipData = []
  for(let aspect in data)
    for(let keypoint in data[aspect])
      for(let method in data[aspect][keypoint]){
        zipData.push({
          aspect: aspect,
          keypoint : keypoint,
          method: method,
          value: [data[aspect][keypoint][method].self , data[aspect][keypoint][method].overview]
        })
      }
  let aspectLable = [],
      keypointLable = [],
      methodLable = []
  Object.keys(data).map(aspect => {
    aspectLable.push(aspect)
    Object.keys(data[aspect]).map( keypoint => {
      keypointLable.push(keypoint)
      Object.keys(data[aspect][keypoint]).map( method => {
        methodLable.push(method)
      })
    })
  })
  return {zipData, aspectLable, keypointLable, methodLable}
}


const drawBarChart = (data,info)=>{
  var margin              = {top: 80, right: 180, bottom: 80, left: 180},
      width               = 1000 - margin.left - margin.right,
      height              = 3000 - margin.top - margin.bottom,
      barHeight           = 20,
      aspectGroupHeight   = Object.keys(data).length,
      keypointGroupHeight = Object.keys(data).map(aspect=>{
        return  Object.keys(data[aspect]).length
      }),
      methodGroupHeight   = 2,

  // zipped the data as array
      {zipData, aspectLable, keypointLable, methodLable}   = zippedData(data),
      spaceForLabels      = 150,
      gapBetweenGroup     = 10

  console.log(zipData)
  // define the scale of x
  var x = d3.scaleLinear()
  .domain([0,d3.max(zipData, d => d.value[1] )])
  .range([0, window.innerWidth]);

  var y_aspect = d3.scaleBand()
      .domain(aspectLable)
      .rangeRound([0,height])
      .paddingInner(0.2)

  var y_keypoint = d3.scaleBand()
      .domain(keypointLable)
      .rangeRound([0,y_aspect.bandwidth()])
      .paddingInner(0.1)

  var y_method = d3.scaleBand()
      .domain(methodLable)
      .rangeRound([0,y_keypoint.bandwidth()])
      .padding(0.05)

  var y_bar = d3.scaleBand()
      .domain(["self","overview"])
      .rangeRound([0,y_method.bandwidth()])
      .padding(0.025)

  var xAxis = d3.axisBottom(x)
      .ticks(10)

  var yAxis = d3.axisLeft(y_method)

  var svg = d3.select(".page-svg").append("svg")
  .attr("height" , height + margin.top + margin.bottom)
  .attr("width" , width + margin.left + margin.right)
  // .attr("preserveAspectRatio" , "xMidYMin")
  // .attr("viewBox" , [-400, 0, width, height].join(" "))
  .append("g")
  .attr("transform", "translate(" + (margin.left+300) +  "," + margin.top + ")");


  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .selectAll(".tick text")

  const bar = svg
    .append("g")
    .selectAll("g")
    .data(zipData)
    .join("g")
      .attr("transform", d => {
        console.log(d)
        return `translate(0,${y_aspect(d.aspect)})`})
    .join("g")
      .attr("transform", d => `translate(0,${y_keypoint(d.keypoint)})`)
    .join("g")
      .attr("transform", d => `translate(0,${y_method(d.method)})`)
    .selectAll('rect')
    .data( d => [{method: "self", value: d.value[0]}, {method: "overview", value: d.value[1]}] )
      .enter()
      .append('a')
        .attr("href", d=>{
          return `/man/${info.id}/${info.year}/${info.type}/${info.campus}/${d.method}`
        })
      .append('rect')
        .attr("fill", (d,i) => {
          if(i%2 == 0)
            return "orange"
          else
            return "blue"
        })
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y_bar(d.method))
        .attr("width", d => x(d.value))
        .attr("height", y_bar.bandwidth())
}

$('select.dropdown')
  .dropdown()

// add event listener
// add event listener to dropdowns
pageFilter.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Draw.dimensionDropdownOnChanged(draw))
pageFilter.querySelector('.filter.filter__item').firstChild.addEventListener('change', Draw.itemDropdownOnChanged(draw))

// pageFilter.querySelector('.filter.filter__choice').addEventListener('click', Draw.filter(draw))
pageFilter.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'));

pageFilter.querySelector('.filter.filter__all').addEventListener('click', retrieveAllData)

// if reserved exsists,which means this page was rendered by clicking the graph
// we need to filter the reserved dimension, item, and detail
if(reserved.querySelector('.reserved__dimension') !== null){
  let dim = reserved.querySelector('.reserved__dimension').innerHTML
  let itm = reserved.querySelector('.reserved__item').innerHTML
  let det = reserved.querySelector('.reserved__detail').innerHTML

  new Promise( (res,rej) => {
    pageFilter.querySelector(`[data-value="${dim}"]`).click()
    res();
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