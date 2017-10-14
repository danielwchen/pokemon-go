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
  vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
  vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
  vis.height = vis.winHeight - vis.margin.top - vis.margin.bottom;

  vis.svg = d3.select(vis.parentElement).append("svg")
  .attr("width", vis.width + vis.margin.left + vis.margin.right)
  .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .style('z-index', '999999999')
  .html(function(d) { 
    return d.name + "<br><img src=\"img/" + d.img + "\" height=\"60px\" width=\"auto\">"; 
  });

  vis.svg.call(vis.tip);

  vis.x = d3.scaleLinear().range([0, width]);
  vis.y = d3.scaleLinear().range([height, 0]);

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

  
  vis.setX(0);
  vis.setY(0);

  // Add the scatterplot
  svg.selectAll("dot")
  .data(vis.fin_data)
  .enter().append("circle")
  .attr("r", 5)
  .attr("cx", function(d) { return vis.x(d.cp); })
  .attr("cy", function(d) { return vis.y(d.attack); })
  .attr("fill-opacity", 0)
  .attr("stroke", "black")
  .attr("stroke-width", 3)
  .on("mouseover", function(d) {
    vis.tip.show(d);
  })
  .on("mouseout", function(d) {
    vis.tip.hide;
  });

}

Scatter.prototype.resize = function(winHeight) {
  var vis = this;

  vis.winHeight = winHeight;

  vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
  vis.height = vis.winHeight - vis.margin.top - vis.margin.bottom;

  vis.svg
  .attr("width", width + vis.margin.left + vis.margin.right)
  .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
  .attr("transform",
    "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.x.range([0, vis.width]);
  vis.y.range([vis.height, 0]);

  vis.updateVis();

}

Scatter.prototype.setX = function(ind) {
  var vis = this;

  vis.x.domain([0, d3.max(vis.fin_data, function(d) { 
    return d.cp; 
  })]);

}

Scatter.prototype.setY = function(ind) {
  var vis = this;

  vis.y.domain([0, d3.max(vis.fin_data, function(d) { 
    return d.attack; 
  })]);

}

// Scatter.prototype.getColor = function(num) {
//   var vis = this;

//   return vis.colors[num];
// }

// Scatter.prototype.updateInd = function(ind) {
//   var vis = this;

//   vis.currInd = ind;

//   vis.updateVis();
  
// }