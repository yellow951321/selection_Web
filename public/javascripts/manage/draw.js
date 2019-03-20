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
      table['item'][dimension] = `<option value='All'>全部</option>`;
      if(schema[dimension] instanceof Object){
        Reflect.ownKeys(schema[dimension]).forEach((item) =>{
          table['detail'][item] = `<option value='All'>全部</option>`;
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
      // const defaultItem = Object.keys(schema[event.target.value])[0]
      if( event.target.value != 'All'){
        item.innerHTML = that.htmlTable['item'][event.target.value]
        item.value = 'All'
        detail.innerHTML = that.htmlTable['detail'][item.value]
      }
      else{
        item.innerHTML = '<option>全部</option>'
        detail.innerHTML = '<option>全部</option>'
      }
    }
  }
  // dropndown item on change
  static itemDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode
      const detail = editNode.querySelector('.filter__detail').firstChild
      detail.innerHTML = event.target.value != 'All' ? that.htmlTable['detail'][event.target.value] : '<option>全部</option>'
    }
  }
}


const draw = new Draw()

const retrieveSpecficData = (that)=>{
  const pathSplit = window.location.pathname.split('/')
  const selected = {
    userId: pathSplit[2],
    year: pathSplit[3] ? decodeURI(pathSplit[3]) : '',
    type: pathSplit[4] ? decodeURI(pathSplit[4]) : '',
    campus: pathSplit[5] ? decodeURI(pathSplit[5]) : ''
  }
  const aspect = pageFilter.querySelector('.filter.filter__dimension').firstChild
  const keypoint = pageFilter.querySelector('.filter.filter__item').firstChild
  const method = pageFilter.querySelector('.filter.filter__detail').firstChild
  return () => {
    //query parameter for GET
    let parameters = {
      id: selected.userId,
      year: selected.year,
      type: selected.type,
      campus: selected.campus,
      aspect: aspect.value,
      keypoint: keypoint.value,
      method: method.value
    }
    parameters = Reflect.ownKeys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
    fetch(`/man/${selected.userId}/${selected.year}/${selected.type}/${selected.campus}/graph/filter?${parameters}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.text())
    .then(data => {
      data = JSON.parse(data)
      let graphNode = document.querySelector('.page-svg')
      while( graphNode.lastChild )
        graphNode.removeChild(graphNode.lastChild)
      drawBarChart(data,{
        id: selected.userId,
        year: selected.year,
        type: selected.type,
        campus: selected.campus
      })
    })
  }
}

const zippedData = (data) => {
  let aspectLable = [],
      keypointLable = [],
      methodLable = []
  data.forEach( obj => {
    if( !methodLable.includes(obj.method) )
      methodLable.push(obj.method)
  })
  return {zipData: data , aspectLable, keypointLable, methodLable}
}


const drawBarChart = (data,info)=>{
  var margin              = {top: 80,
                             right: window.document.body.offsetWidth*0.17,
                             bottom: 80,
                             left: window.document.body.offsetWidth > 1024 ? window.document.body.offsetWidth*0.25 : window.document.body.offsetWidth*0.35},
      barHeight           = 25,
      barPadding          = 10,
      width               = window.document.body.offsetWidth > 1024 ? window.document.body.offsetWidth*0.4 : window.document.body.offsetWidth*0.3,
      height              = data.length*2*(barHeight + barPadding),
  // zipped the data as array
      {zipData, aspectLable, keypointLable, methodLable}   = zippedData(data)
  // define the scale of x
  var x = d3.scaleLinear()
      .domain([0,100])
      .range([0, width])


  var y_method = d3.scaleBand()
      .domain(methodLable)
      .rangeRound([0,height])
      .padding(0.2)

  var y_bar = d3.scaleBand()
      .domain(["self","overall"])
      .rangeRound([0,y_method.bandwidth()])
      .padding(0.1)

  var xAxis = d3.axisBottom(x)
      .ticks(10)

  var yAxis = d3.axisLeft(y_method)
      .tickSize(0)

  var svg = d3.select(".page-svg").append("svg")
  .attr("height" , height + margin.top + margin.bottom)
  .attr("width" , width + margin.left + margin.right)
  // .attr("transform", `translate`)
  .append("g")
  .attr("transform", "translate(" + (margin.left) +  "," + margin.top + ")");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .selectAll(".tick text")

  var bar = svg.append("g")
    .selectAll("g")
    .data(zipData)
    .join("g")
      .attr("transform", d => `translate(0,${y_method(d.method)})`)
    .selectAll('rect')
    .data( d => [
      { method: d.method, methodId: d.methodId, prop: "self",    value: d.self    , percentage: ((d.rank)*100).toFixed(2) },
      { method: d.method, methodId: d.methodId, prop: "overall", value: d.highest , percentage : 100 }] )
      .enter()
      .append('a')
        .attr("href", d=>{
          return `/man/${info.id}/${info.year}/${info.type}/${info.campus}/${d.methodId}`
        })

  bar.append('rect')
  .attr("fill", (d,i) => {
    if(i%2 == 0)
      return "#80d6ff"
    else
      return "#0077c2"
  })
  .attr("class", "bar")
  .attr("x", 0)
  .attr("y", d => {
    return y_bar(d.prop)})
  .attr("width", d => x(d.percentage))
  .attr("height", y_bar.bandwidth())

  bar.append('text')
    .attr("fill" , (d,i) => {
      if( i%2 == 0)
        return "black"
      else
        return "white"
    })
    .attr("x", 3)
    .attr("y" , d => {
      return y_bar(d.prop) + y_bar.bandwidth()/1.5 })
    .text((d , i) =>{
      if(d.value == 0)
        return ""
      else
        return `共 ${d.value} 筆 , 百分點: ${d.percentage}%`
    })

    //draw legends
    let legendLabel = [ '此大學資料數', '所有大學最多筆資料數']
    var legend = d3.select('.page-svg svg')
      .append('g')
      .selectAll('rect')
      .data(legendLabel)
      .enter()
        // .attr('transform', )
    legend.append('rect')
          .attr("fill", (d,i) => {
            if(i%2 == 0)
              return "#80d6ff"
            else
              return "#0077c2"
          })
          .attr("class", "bar")
          .attr("x", width)
          .attr("y", (d,i) => {
            return i*30 + i*5 + 5 +30/2
          })
          .attr("width", 30)
          .attr("height", 5)

    legend.append('text')
            .attr("fill" , "black" )
            .attr("x", width + 35)
            .attr("y" , (d,i)=>{
              return i*30+ i*5 + 5 + 2.5 + 30/2
            })
            .text(d => d)
}

$('select.dropdown')
  .dropdown()

// add event listener
// add event listener to dropdowns
pageFilter.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Draw.dimensionDropdownOnChanged(draw))
pageFilter.querySelector('.filter.filter__item').firstChild.addEventListener('change', Draw.itemDropdownOnChanged(draw))

// pageFilter.querySelector('.filter.filter__choice').addEventListener('click', Draw.filter(draw))
pageFilter.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'));


pageFilter.querySelector('.filter.filter__choice').addEventListener('click', retrieveSpecficData(draw) )
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