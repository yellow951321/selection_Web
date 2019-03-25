//global variable
var savedData = null
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
      school: pathSplit[5] ? decodeURI(pathSplit[5]) : '',
    }
  }

  // build htmltable
  buildTables(){
    let table = {
      item: {},
      detail: {},
    }
    Reflect.ownKeys(schema).forEach((dimension) => {
      table['item'][dimension] = '<option value=\'All\'>全部</option>'
      if(schema[dimension] instanceof Object){
        Reflect.ownKeys(schema[dimension]).forEach((item) =>{
          table['detail'][item] = '<option value=\'All\'>全部</option>'
          Reflect.ownKeys(schema[dimension][item]).forEach((detail) =>{
            table['detail'][item] += `<option value='${ detail }'>${ detail }</option>`
          })
          table['item'][dimension] += `<option value='${ item }'>${ item }</option>`
        })
      }
    })
    return table
  }

  // dropdown on change
  // dropdown dimension on change
  static dimensionDropdownOnChanged(that){
    return (event) => {
      const editNode = event.target.parentNode.parentNode.parentNode
      const item = editNode.querySelector('.filter__item').firstChild
      const detail = editNode.querySelector('.filter__detail').firstChild
      if(event.target.value != 'All'){
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
    campus: pathSplit[5] ? decodeURI(pathSplit[5]) : '',
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
      method: method.value,
    }
    parameters = Reflect.ownKeys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
    fetch(`/man/${selected.userId}/${selected.year}/${selected.type}/${selected.campus}/graph/filter?${parameters}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(data => {
        data = JSON.parse(data)
        let graphNode = document.querySelector('.page-svg')
        while(graphNode.lastChild)
          graphNode.removeChild(graphNode.lastChild)
        drawBoxPlot(data, {
          id: selected.userId,
          year: selected.year,
          type: selected.type,
          campus: selected.campus,
        })
      })
  }
}

const percentageDropdownOnChanged = () => {
  if(savedData == null)
    return
  let graphNode = document.querySelector('.page-svg')
  while(graphNode.lastChild)
    graphNode.removeChild(graphNode.lastChild)

  let {data, info, } = savedData
  drawBoxPlot(data, info)
}


const rebuildDataStructure = (dataSet, range = [0, 100, ]) => {
  let rebuildData = (dataSet.map(d => {
    let data = d.data.map(ele => ele.count)
    let { whiskerIndices, whiskerData, } = whiskerInfo(data)
    let quartileData = quartileInfo(data)
    let { selfPercentage, self, } = dataPercentage(d.selfId, d.data)
    return {
      whiskerIndices,
      whiskerData,
      quartileData,
      method: d.method,
      methodId: d.methodId,
      selfPercentage,
      self,
    }
  })).filter(d => {
    if(d.selfPercentage*100 > range[0] && d.selfPercentage*100 < range[1])
      return true
    return false
  })

  let methodLabel = rebuildData.map(d => {
    return d.method
  })

  return {
    methodLabel,
    newData : rebuildData,
  }
}

const drawBarChart = (data, info)=>{
  var margin = {top: 80,
      right: window.document.body.offsetWidth*0.17,
      bottom: 80,
      left: window.document.body.offsetWidth > 1024 ? window.document.body.offsetWidth*0.25 : window.document.body.offsetWidth*0.35, },
    barHeight = 25,
    barPadding = 10,
    width = window.document.body.offsetWidth > 1024 ? window.document.body.offsetWidth*0.4 : window.document.body.offsetWidth*0.3,
    height = data.length*2*(barHeight + barPadding),
    // zipped the data as array
    {zipData, aspectLable, keypointLable, methodLable, } = zippedData(data)
  // define the scale of x
  var x = d3.scaleLinear()
    .domain([0, 100, ])
    .range([0, width, ])


  var y_method = d3.scaleBand()
    .domain(methodLable)
    .rangeRound([0, height, ])
    .padding(0.2)

  var y_bar = d3.scaleBand()
    .domain(['self', 'overall', ])
    .rangeRound([0, y_method.bandwidth(), ])
    .padding(0.1)

  var xAxis = d3.axisBottom(x)
    .ticks(10)

  var yAxis = d3.axisLeft(y_method)
    .tickSize(0)

  var svg = d3.select('.page-svg').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + (margin.left) + ',' + margin.top + ')')

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .selectAll('.tick text')

  var bar = svg.append('g')
    .selectAll('g')
    .data(zipData)
    .join('g')
    .attr('transform', d => `translate(0,${y_method(d.method)})`)
    .selectAll('rect')
    .data( d => [
      { method: d.method, methodId: d.methodId, prop: "self",    value: d.self    , percentage: ((d.rank)*100).toFixed(2) },
      { method: d.method, methodId: d.methodId, prop: "overall", value: d.highest , percentage : 100 }] )
      .enter()
      .append('a')
        .attr("href", d => {
          return `/man/${info.id}/${info.year}/${info.type}/${info.campus}/${d.methodId}`
        })

  bar.append('rect')
    .attr('fill', (d, i) => {
      if(i%2 == 0)
        return '#80d6ff'
      else
        return '#0077c2'
    })
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => {
      return y_bar(d.prop)})
    .attr('width', d => x(d.percentage))
    .attr('height', y_bar.bandwidth())

  bar.append('text')
    .attr('fill', (d, i) => {
      if(i%2 == 0)
        return 'black'
      else
        return 'white'
    })
    .attr('x', 3)
    .attr('y', d => {
      return y_bar(d.prop) + y_bar.bandwidth()/1.5 })
    .text((d, i) =>{
      if(d.value == 0)
        return ''
      else
        return `共 ${d.value} 筆 , 百分點: ${d.percentage}%`
    })

  //draw legends
  let legendLabel = ['此大學資料數', '所有大學最多筆資料數', ]
  var legend = d3.select('.page-svg svg')
    .append('g')
    .selectAll('rect')
    .data(legendLabel)
    .enter()

  legend.append('rect')
    .attr('fill', (d, i) => {
      if(i%2 == 0)
        return '#80d6ff'
      else
        return '#0077c2'
    })
    .attr('class', 'bar')
    .attr('x', width)
    .attr('y', (d, i) => {
      return i*30 + i*5 + 5 +30/2
    })
    .attr('width', 30)
    .attr('height', 5)

  legend.append('text')
    .attr('fill', 'black')
    .attr('x', width + 35)
    .attr('y', (d, i)=>{
      return i*30+ i*5 + 5 + 2.5 + 30/2
    })
    .text(d => d)
}

const drawBoxPlot = (data, info) => {
  //save the data
  savedData = {
    data,
    info,
  }
  const percentage = pageFilter.querySelector('.filter.filter__percent').firstChild.value
  var margin = {top: 80,
      right: window.document.body.offsetWidth*0.17,
      bottom: 80,
      left: window.document.body.offsetWidth > 1024 ? window.document.body.offsetWidth*0.25 : window.document.body.offsetWidth*0.35, },
    barHeight = 25,
    barPadding = 20,
    // zipped the data as array
    range = rangeDetermine(percentage),
  // rebuild data structure
    {newData , methodLabel} = rebuildDataStructure(data,range)
    width               = window.document.body.offsetWidth > 1024 ? window.document.body.offsetWidth*0.6 : window.document.body.offsetWidth*0.3,
    height              = newData.length*2*(barHeight + barPadding),
    max = d3.max(data, d => d3.max(d.data, d => d.count))
    tickValues         = []
  for(let i=0;i<max;i++)
    tickValues.push(i)

  var x = d3.scaleLinear()
    .domain([0,max])
    .range([0,width])

  var x_info = d3.scaleLinear()
    .domain([0, 100, ])
    .range([0, width, ])

  var y_method = d3.scaleBand()
    .domain(methodLabel)
    .rangeRound([0, height, ])
    .paddingInner(0.2)

  var y_particle = d3.scaleBand()
    .domain(['box', 'bar', ])
    .rangeRound([0, y_method.bandwidth(), ])
    .paddingInner(0.1)

  var yAxis = d3.axisLeft(y_method)
    .tickSize(0)
  var xAxis = d3.axisBottom(x)
    .ticks(max)
    .tickValues(tickValues)
    .tickFormat( (d,i) => {
      if(i == 0)
        return ""
      if(i%5 == 0 )
        return d
      else
        return ""
    })
    .tickSize(10)

  var svg = d3.select('.page-svg').append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + (margin.left) + ',' + margin.top + ')')

  // draw the illustration
  var illustration = svg.append("g")
      .attr("x", 0)
      .attr("y", 0)
      .attr("transform", `translate(-200,-50)`)

  illustration.append("rect")
      .attr("fill", "#FF0085")
      .attr("x", x(10))
      .attr("y", 0)
      .attr("width", 25)
      .attr("height", 3)

  illustration.append("text")
      .attr("x", x(10) + 26 )
      .attr("y", 5)
      .text(`${info.year}年${info.campus}所有資料位置`)

  // draw the y-axis
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)

  var boxPlot = svg.append("g")
      .selectAll("g")
      .data(newData)
      .enter()
      .append("g")
        .attr("transform", d => {
          return `translate(0,${y_method(d.method)})`
        })

  boxPlot.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${y_particle("bar")})`)
      .call(xAxis)

  // draw the horizontal line
  boxPlot.append("line")
      .attr("class","center")
      .attr("x1" , d => x(d.whiskerData[0]) )
      .attr("y1" , y_particle("box") + barHeight/2 )
      .attr("x2" , d => x(d.whiskerData[1]))
      .attr("y2" , y_particle("box") + barHeight/2 )

  // draw the upper bound and lower bound
  boxPlot.append("line")
      .attr("class", "lower bound" )
      .attr("x1", d => x(d.whiskerData[0]) )
      .attr("y1", y_particle("box") )
      .attr("x2" , d => x(d.whiskerData[0]) )
      .attr("y2" , barHeight )

  boxPlot.append("line")
      .attr("class", "upper bound")
      .attr("x1", d => x(d.whiskerData[1]))
      .attr("y1", y_particle("box") )
      .attr("x2" , d => x(d.whiskerData[1]))
      .attr("y2" , barHeight )

  // draw the bar chart
  boxPlot.append('rect')
    .attr('class', 'box')
    .attr('fill', '#80d6ff')
    .attr('x', d => x(d.quartileData[0]))
    .attr('y', d => y_particle('box'))
    .attr('width', d => x(d.quartileData[2]) - x(d.quartileData[0]))
    .attr('height', barHeight)

  // draw the line median
  boxPlot.append("line")
        .attr("class", "median")
        .attr("x1", d => x(d.quartileData[1] ) )
        .attr("y1", d => y_particle("box")  )
        .attr("x2", d => x(d.quartileData[1] ) )
        .attr("y2", d => y_particle("box") + barHeight  )

  // draw the line represent self
  boxPlot.append("line")
        .attr("class","self")
        .attr("x1", d => x(d.self) )
        .attr("y1", y_particle("box") )
        .attr("x2", d => x(d.self ))
        .attr("y2", y_particle("box") + barHeight )
        .attr("stroke", "#FF0085")
        .attr("stroke-width", 2)

  var xAxis = boxPlot.append("g")
        .attr("transform", d => {
          return `translate(0,${y_particle("bar")})`
        })

  d3.selectAll(".y.axis text")
    .style("cursor", "pointer")
    .data(data)
    .on("click", (d) => {
      console.log(d)
        document.location.href = `/man/${info.id}/${info.year}/${info.type}/${info.campus}/${d.methodId}`;
        return
    })
  d3.selectAll(".y.axis .tick text")
    .attr("transform", `translate(-10,0)`)

  // xAxis.append("path")
  //       .attr("class","domain")
  //       .attr("stroke","#000")
  //       .attr("d", `M${x(0)} ${y_particle("bar")/2} L${x(x.domain()[1])} ${y_particle("bar")/2} Z`)

  // var ticks = xAxis.selectAll("svg")
  //       .data([ x.domain()[1] ], d => {
  //         let range = Math.ceil(d)
  //         let t = []
  //         for(let i=0;i<range;i++){
  //           t.push(i)
  //         }
  //         return t
  //       }).enter()
  //       .append("g")
  //         .attr("transform", d => `translate(${x(d)},0)`)


  // ticks.append("line")
  //       .attr("x1", d => {
  //         console.log(d)
  //         return x(d)} )
  //       .attr("y1", y_particle("bar") )
  //       .attr("x2", d => x(d) )
  //       .attr("y2", d => {
  //         if(d%5 == 0)
  //           return 3
  //         else
  //           return 2
  //       })
  //       .attr("stroke","#000")
  //       .attr("stroke-width",d => {
  //         if(d%5 == 0){
  //           return 2
  //         }else
  //           return 1
  //       })
  // ticks.append("text")
  //       .attr("x", d => x(d) )
  //       .attr("y", y_particle("bar") + 2)
  //       .text(d => {
  //         if(d%5 == 0)
  //           return d
  //         else
  //           return ""
  //       })
  // draw the bar chart
  // var barChart = boxPlot.selectAll("g").data( d => {
  //   let min = {
  //     percentage: 0,
  //     value: Math.floor(d.whiskerData[0]),
  //     color: "#2FD5D6"
  //   }
  //   let max = {
  //     percentage: 1,
  //     value: Math.floor(d.whiskerData[1]),
  //     color: '#2F2DD6'
  //   }
  //   let q1 = {
  //     percentage: 0.25,
  //     value: Math.floor(d.quartileData[0]),
  //     color: '#2FACD8'
  //   }
  //   let q2 = {
  //     percentage: 0.5,
  //     value: Math.floor(d.quartileData[1]),
  //     color: '#2F83D6'
  //   }
  //   let q3 = {
  //     percentage: 0.75,
  //     value: Math.floor(d.quartileData[2]),
  //     color: '#2F59D5'
  //   }
  //   let self = {
  //     percentage: d.selfPercentage,
  //     value: d.self,
  //     color: '#FF0085'
  //   }
  //   let result = [min,q1,q2,q3,self,max]
  //   result = result.sort((a,b) => {
  //     return a.percentage - b.percentage
  //   })
  //   return result
  // })
  // .enter()

  // barChart.append("rect")
  //   .attr("fill", d => d.color )
  //   .attr("x", (d,i) => x_info(100*0.166*i) )
  //   .attr("y", y_particle("bar"))
  //   .attr("width", x_info(100*0.166) )
  //   .attr("height", barHeight )

  // barChart.append("text")
  //   .attr("fill", (d,i) => {
  //     if(i == 0 )
  //       return "black"
  //     else
  //       return "white"
  //   })
  //   .attr("x", (d,i) => x_info(100*0.166*i + 2))
  //   .attr("y", y_particle("bar") + y_particle.bandwidth()/2 )
  //   .text((d,i)=> {
  //     return `第${(d.percentage*100).toFixed(0)}百分點: ${d.value} 筆`
  //   })

}

const iqr = (k) => {
  return (d, i) => {
    var q1 = d.quartiles[0],
      q3 = d.quartiles[2],
      iqr = (q3 - q1)*k,
      i = -1,
      j = d.length

    while(d[++i] < q1 - iqr);
    while(d[--j] > q3 + iqr);
    return [i, j, ]
  }
}

const whiskerInfo = (data) => {
  let whiskerIndices = [0, data.length-1, ]
  let whiskerData = whiskerIndices.map(i => data[i])

  return { whiskerIndices, whiskerData, }
}

const quartileInfo = (data) => {
  return [
    d3.quantile(data, .25),
    d3.quantile(data, .5),
    d3.quantile(data, .75),
  ]
}

const dataPercentage = (dataId, data = []) => {
  let targetIndex = data.findIndex(d => {
    return d.dataId == dataId
  })
  let targetValue = data[targetIndex].count

  let matchNum = (data.map((d, i) => {
    if(d.count == targetValue){
      return i
    }
  })).filter(d => {
    if(d)
      return true
  })

  return {
    selfPercentage: (matchNum[matchNum.length-1]/data.length).toFixed(2),
    self: data[targetIndex].count,
  }
}

const rangeDetermine = (data) => {
  switch(data){
  case 'All':
    return [0, 100, ]
  case 'q3':
    return [75, 100, ]
  case 'q2':
    return [50, 75, ]
  case 'q1':
    return [25, 50, ]
  case 'q0':
    return [0, 25, ]
  }
}
$('select.dropdown')
  .dropdown()

// add event listener
// add event listener to dropdowns
pageFilter.querySelector('.filter.filter__dimension').firstChild.addEventListener('change', Draw.dimensionDropdownOnChanged(draw))
pageFilter.querySelector('.filter.filter__item').firstChild.addEventListener('change', Draw.itemDropdownOnChanged(draw))

// pageFilter.querySelector('.filter.filter__choice').addEventListener('click', Draw.filter(draw))
pageFilter.querySelector('.filter.filter__dimension').firstChild.dispatchEvent(new Event('change'))
pageFilter.querySelector('.filter.filter__choice').addEventListener('click', retrieveSpecficData(draw))
pageFilter.querySelector('.filter.filter__percent').addEventListener('click', percentageDropdownOnChanged)
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