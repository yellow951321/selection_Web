var d3 = require('d3')
const {findParentByDetail, } = require('../../../data/operation/draw')
const {map, getFromWord, } = require('../../../data/operation/mapping')
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

const drawHorizonBarChart = ()=>{
  var data = {
    labels: [
      'resilience', 'maintainability', 'accessibility',
      'uptime', 'functionality', 'impact'
    ],
    series: [
      {
        label: '2012',
        values: [4, 8, 15, 16, 23, 42]
      },
      {
        label: '2013',
        values: [12, 43, 22, 11, 73, 25]
      },
      {
        label: '2014',
        values: [31, 28, 14, 8, 15, 21]
      },]
  };

  var chartWidth       = 300,
      barHeight        = 20,
      groupHeight      = barHeight * data.series.length,
      gapBetweenGroups = 10,
      spaceForLabels   = 150,
      spaceForLegend   = 150;

  // Zip the series data together (first values, second values, etc.)
  var zippedData = [];
  for (var i=0; i<data.labels.length; i++) {
    for (var j=0; j<data.series.length; j++) {
      zippedData.push(data.series[j].values[i]);
    }
  }

  // Color scale
  // var color = d3.scale.category20();
  // var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

  var x = d3.scaleLinear()
      .domain([0, d3.max(zippedData)])
      .range([0, chartWidth]);

  var y = d3.scaleLinear()
      .range([chartHeight + gapBetweenGroups, 0]);

  var y = d3.scaleBand()
  .domain(data.map(d=>d.detail))
  .range([0,width])
  .round(.1,.3)
  .paddingInner(.5)
  .paddingOuter(.1)

  var yAxis = d3.axisLeft(y)
  .ticks(0)
  .tickFormat('')

  // Specify the chart area and dimensions
  var chart = d3.select(".chart")
      .attr("width", spaceForLabels + chartWidth + spaceForLegend)
      .attr("height", chartHeight);

  // Create bars
  var bar = chart.selectAll("g")
      .data(zippedData)
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
      });

  // Create rectangles of the correct width
  bar.append("rect")
      .attr("fill", function(d,i) { return color(i % data.series.length); })
      .attr("class", "bar")
      .attr("width", x)
      .attr("height", barHeight - 1);

  // Add text label in bar
  bar.append("text")
      .attr("x", function(d) { return x(d) - 3; })
      .attr("y", barHeight / 2)
      .attr("fill", "red")
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  // Draw labels
  bar.append("text")
      .attr("class", "label")
      .attr("x", function(d) { return - 10; })
      .attr("y", groupHeight / 2)
      .attr("dy", ".35em")
      .text(function(d,i) {
        if (i % data.series.length === 0)
          return data.labels[Math.floor(i/data.series.length)];
        else
          return ""});

  chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
        .call(yAxis);

  // Draw legend
  var legendRectSize = 18,
      legendSpacing  = 4;

  var legend = chart.selectAll('.legend')
      .data(data.series)
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
          var height = legendRectSize + legendSpacing;
          var offset = -gapBetweenGroups/2;
          var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
          var vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
      });

  legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', function (d, i) { return color(i); })
      .style('stroke', function (d, i) { return color(i); });

  legend.append('text')
      .attr('class', 'legend')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function (d) { return d.label; });
}

const drawBarChart = (dom,data,info)=>{
  var margin = {top: 80, right: 180, bottom: 80, left: 180},
  width = 2000 - margin.left - margin.right,
  height = 4000 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
  .domain([0,d3.max(data, (d) => d.value)])
  .range([0,width-500]);

  console.log(data.length)
  var y = d3.scaleBand()
  .domain(data.map(d=>d.detail))
  .range([0,(data.length > 60)? height-200:height/2])
  .round(.1,.3)
  .paddingInner(.5)
  .paddingOuter(.1)

  var xAxis = d3.axisBottom(x)
  .ticks(10)
  .tickFormat(d => d+'筆')

  var yAxis = d3.axisLeft(y)

  var svg = d3.select(dom).append("svg")
  .attr("height" , height + margin.top + margin.bottom)
  .attr("width" , width + margin.left + margin.right)
  .attr("preserveAspectRatio" , "xMidYMin")
  .attr("viewBox" , [-400, 0, width, height].join(" "))
  .append("g")
  .attr("transform", "translate(" + (margin.left) +  "," + margin.top + ")");

  svg.append("text")
    .attr("class", "title")
    .attr("y", y(data[0].name))
    .attr("x", -20)
    .text(info.campus);

  svg.append("g")
    .attr("class", "y axis")
    // .attr("transform", "translate(0," + (height-205) + ")")
    .call(yAxis)
  .selectAll(".tick text")
    // .call(wrap, y.bandwidth())

  // svg.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform","translate(0," + (height-205) + ")")
  //   .call(xAxis);

  const bar = svg.selectAll(".bar")
    .data(data)
  .enter().append('a')
    .attr("href", d=>{
      try{
        const detail_num = getFromWord(map,{detail: d.detail})
        return `/man/${info.id}/${info.year}/${info.type}/${info.campus}/${detail_num}`
      }
      catch(err){
        console.log(err)
      }
    })

  bar.append('rect')
    .attr("class", "bar")
    .attr("x", (d)=> 0 )
    .attr("width", d => x(d.value))
    .attr("y", d => y(d.detail))
    .attr("height",d => y.bandwidth())

  bar
  .append("text")
  .attr("class","label")
  .attr("x", d => x(d.value) - 3)
  .attr("y", d=> y(d.detail) + 0.5)
  .attr("fill","white")
  .attr("dy", ".7em")
  .text(d => d.value)
    // .on('click',()=>info.window.location=`/
    // .on('click',()=>info.window.location=`/man/${info.id}/${info.year}/${info.type}/${info.campus}`);
}

module.exports = drawBarChart