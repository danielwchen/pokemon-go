/*
 *  Scatter - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _eventHandler    -- Event handler
 */

 Scatter = function(_parentElement, _currInd, _winHeight) {

  this.parentElement = _parentElement;
  this.currInd = _currInd;
  this.winHeight = _winHeight;

  this.fin_data;
  this.x_labels;
  this.y_labels;
  this.opacities;
  this.colors;

  this.bottomoffset = 120;

  this.initVis();
};

Scatter.prototype.initVis = function() {

  var vis = this;

  vis.width = $(vis.parentElement).width();
  vis.height = vis.winHeight;

  vis.svg = d3.select(vis.parentElement).append("svg")
  .attr("width", vis.width)
  .attr("height", vis.height);

  d3.queue()
  .defer(d3.csv, "data/finalpokemon.csv")
  .await(function(error, data) {
    vis.wrangleData(data);
  });

};

Scatter.prototype.wrangleData = function(data) {
  var vis = this;


  data.forEach(function(d) {
    d.id = +d.id;
    d.attack = +d.attack;
    d.defense = +d.defense;
    d.health = +d.health;
    d.cp = +d.cp;
  })

  vis.fin_data = data;

  vis.createVis();

};

Scatter.prototype.createVis = function() {
  var vis = this;

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(vis.parentElement).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain([0, d3.max(vis.fin_data, function(d) { return d.cp; })]);
  y.domain([0, d3.max(vis.fin_data, function(d) { return d.attack; })]);

  // Add the scatterplot
  svg.selectAll("dot")
  .data(vis.fin_data)
  .enter().append("circle")
  .attr("r", 5)
  .attr("cx", function(d) { return x(d.cp); })
  .attr("cy", function(d) { return y(d.attack); })
  .attr("fill", "none")
  .attr("stroke", "black");

  // Add the X Axis
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y));


};

Scatter.prototype.updateVis = function() {
  var vis = this;

  

}

Scatter.prototype.resize = function() {
  var vis = this;

  vis.width = $(vis.parentElement).width();
  vis.svg.attr("width",vis.width);

  vis.updateVis;

}

Scatter.prototype.getOpacity = function(num) {
  var vis = this;


  return 1;
}

Scatter.prototype.getXPosition = function(num) {
  var vis = this;

  return vis.positions[num];
}

Scatter.prototype.getYPosition = function(num) {
  var vis = this;

  return vis.positions[num];
}

Scatter.prototype.getColor = function(num) {
  var vis = this;

  return vis.colors[num];
}

Scatter.prototype.updateInd = function(ind) {
  var vis = this;

  vis.currInd = ind;

  vis.updateVis();
  
}