var d3 = require('d3')
const {findParentByDetail, } = require('../../../data/operation/draw')
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split("").reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      line.pop();
      tspan.text(line.join(" "));
      line = [word];
      tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
    }
  });
}

const drawBarChart = (dom,data,info)=>{
  var margin = {top: 80, right: 180, bottom: 80, left: 180},
  width = 1500 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

  var x = d3.scaleBand()
  .domain(data.map(d=>d.detail))
  .range([0, width])
  .round(.1,.3)
  .paddingInner(.5)
  .paddingOuter(.1)

  var y = d3.scaleLinear()
  .domain([0,d3.max(data, (d) => d.value)])
  .range([height, 0]);

  var xAxis = d3.axisBottom(x)

  var yAxis = d3.axisLeft(y)
  .ticks(10)
  .tickFormat(d => d+'筆')

  var svg = d3.select(dom).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("text")
    .attr("class", "title")
    .attr("x", x(data[0].name))
    .attr("y", -20)
    .text(info.campus);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height-5) + ")")
    .call(xAxis)
  .selectAll(".tick text")
    .call(wrap, x.bandwidth())

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  const bar = svg.selectAll(".bar")
    .data(data)
  .enter().append('a')
    .attr("href", d=>{
      try{
        const result = findParentByDetail(d.detail)
        return `/man/${info.id}/content/${info.year}/${info.type}/${info.campus}/${result.dimension}/${result.item}/${d.detail}`
      }
      catch(err){
        console.log(err)
      }
    })
    .append('rect')
    .attr("class", "bar")
    .attr("x", (d)=> x(d.detail) )
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.value))
    .attr("height",d => height - y(d.value) )
    // .on('click',()=>info.window.location=`/
    // .on('click',()=>info.window.location=`/man/${info.id}/${info.year}/${info.type}/${info.campus}`);
}

module.exports = drawBarChart