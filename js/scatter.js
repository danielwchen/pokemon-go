/*
 *  Scatter - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _eventHandler    -- Event handler
 */

 Scatter = function(_parentElement, _winWidth, _winHeight) {

  this.parentElement = _parentElement;
  this.winWidth = _winWidth;
  this.winHeight = _winHeight;

  this.fin_data;
  this.x_labels;
  this.y_labels;
  this.opacities;

  this.x_stat = 'attack';
  this.y_stat = 'cp';

  // Type colors from http://www.epidemicjohto.com/t882-type-colors-hex-colors
  this.colors = ['#A8A77A','#EE8130','#6390F0','#F7D02C','#7AC74C',
  '#96D9D6','#C22E28','#A33EA1','#E2BF65','#A98FF3',
  '#F95587','#A6B91A','#B6A136','#735797','#6F35FC',
  '#705746','#B7B7CE','#D685AD'];
  

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
  vis.width = vis.winWidth - vis.margin.left - vis.margin.right;
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
    return d.name + "<br><img src=\"img/" + d.img + "\" height=\"60px\" width=\"auto\"><br>" + vis.x_stat + ": " + d[vis.x_stat] + "<br>" + vis.y_stat + ": " + d[vis.y_stat]; 
  });

  vis.svg.call(vis.tip);

  vis.x = d3.scaleLinear().range([0, vis.width]);
  vis.y = d3.scaleLinear().range([vis.height, 0]);
  vis.c = d3.scaleOrdinal()
            .range(vis.colors)
            .domain(["Normal","Fire", "Water", "Electric","Grass","Ice","Fighting","Poison","Ground",
              "Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"]);

  vis.x.domain([0, d3.max(vis.fin_data, function(d) { 
    return d[vis.x_stat]; 
  })]);

  vis.y.domain([0, d3.max(vis.fin_data, function(d) { 
    return d[vis.y_stat]; 
  })]);

  vis.xAxis = vis.svg.append("g")
  .attr("transform", "translate(0," + vis.height + ")")
  .call(d3.axisBottom(vis.x));

  vis.yAxis = vis.svg.append("g")
  .call(d3.axisLeft(vis.y));

  vis.xLabel = vis.svg
  .append("text")
  .attr("class", "x-label axis-label")
  .attr("x", vis.width)
  .attr("y", vis.height-6)
  .style("text-anchor", "end")
  .text(vis.x_stat);

  vis.yLabel = vis.svg
  .append("text")
  .attr("class", "y-label axis-label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  // .attr("transform", function(d,i) {
  //   return "translate(-10," + (vis.height / 2) + ")rotate(270)";
  // })
  .text(vis.y_stat);



  vis.dots = vis.svg.selectAll(".dots")
  .data(vis.fin_data)
  .enter().append("circle")
  .attr("class", "dots")
  .attr("r", 10)
  .attr("cx", function(d) { return vis.x(d[vis.x_stat]); })
  .attr("cy", function(d) { return vis.y(d[vis.y_stat]); })
  .attr("stroke-opacity", .7)
  .attr("fill-opacity", .2)
  .attr("stroke", function(d) { return vis.c(d.type1); })
  .attr("fill", function(d) {
    if (d.type2) { return vis.c(d.type2); } 
    else { return vis.c(d.type1); }
    })
  .attr("stroke-width", 3)
  .on("mouseover", function(d) { vis.tip.show(d); })
  .on("mouseout", function(d) { vis.tip.hide(d); });

  vis.legend = vis.svg.selectAll(".legend")
  .data(vis.c.domain())
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 30) + ")"; });

  vis.legend.append("rect")
  // .attr("class", "legend-rect")
  .attr("x", vis.width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .attr("stroke-opacity", .6)
  .attr("fill-opacity", .2)
  .style("fill", vis.c)
  .style("stroke", vis.c)
  .attr("stroke-width", 3)
  ;

  vis.legend.append("text")
  .attr("x", vis.width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d;})

  // vis.legend.exit().remove();

  vis.updateVis();
};

Scatter.prototype.updateVis = function() {
  var vis = this;

  vis.x.domain([0, d3.max(vis.fin_data, function(d) { 
    return d[vis.x_stat]; 
  })]);

  vis.y.domain([0, d3.max(vis.fin_data, function(d) { 
    return d[vis.y_stat]; 
  })]);

  vis.xAxis
  .call(d3.axisBottom(vis.x));

  vis.yAxis
  .call(d3.axisLeft(vis.y));

  vis.xLabel
  .text(vis.x_stat);

  vis.yLabel
  .text(vis.y_stat);

  vis.dots.transition().duration(500)
  .attr("cx", function(d) { return vis.x(d[vis.x_stat]); })
  .attr("cy", function(d) { return vis.y(d[vis.y_stat]); })


}

Scatter.prototype.resize = function(w, h) {
  var vis = this;

  vis.winWidth = w;
  vis.winHeight = h;

  console.log(vis.winWidth);
  console.log(vis.width + vis.margin.left + vis.margin.right);
  console.log(vis.width);

  vis.width = vis.winWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.winHeight - vis.margin.top - vis.margin.bottom;

  vis.svg
  .attr("width", vis.width + vis.margin.left + vis.margin.right)
  .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
  .attr("transform",
    "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.x.range([0, vis.width]);
  vis.y.range([vis.height, 0]);

  vis.xAxis
  .attr("transform", "translate(0," + vis.height + ")")
  // .call(d3.axisBottom(vis.x));

  // vis.yAxis
  // .call(d3.axisLeft(vis.y));

  vis.xLabel
  .attr("x", vis.width)
  .attr("y", vis.height-6);
  // .attr("transform", function(d,i) {
  //   return "translate(" + (vis.width / 2) + "," + vis.height + ")";
  // });

  vis.yLabel
  .attr("y", 6)
  .attr("dy", ".71em");
  // .attr("transform", function(d,i) {
  //   return "translate(-10," + (vis.height / 2) + ")rotate(270)";
  // });

  

  // draw legend colored rectangles
  vis.legend.selectAll("rect")
  // .attr("class", "legend-rect")
  .attr("x", vis.width - 18);

  // draw legend text
  vis.legend.selectAll("text")
  .attr("x", vis.width - 24);

  vis.updateVis();

}

Scatter.prototype.setX = function(stat) {
  var vis = this;

  vis.x_stat = stat;

  vis.updateVis();
}

Scatter.prototype.setY = function(stat) {
  var vis = this;

  vis.y_stat = stat;

  vis.updateVis();
}

Scatter.prototype.setSize = function(stat) {
  var vis = this;

  vis.size_stat = stat;

  vis.updateVis();
}

Scatter.prototype.setShape = function(stat) {
  var vis = this;

  vis.shape_stat = stat;

  vis.updateVis();
}