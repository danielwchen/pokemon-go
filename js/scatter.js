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
  this.colors = ['#A8A77A','#EE8130','#6390F0','#F7D02C','#7AC74C',
  '#96D9D6','#C22E28','#A33EA1','#E2BF65','#A98FF3',
  '#F95587','#A6B91A','#B6A136','#735797','#6F35FC',
  '#705746','#B7B7CE','#D685AD']
  ;

    // Normal Type: A8A77A
    // Fire Type:  EE8130
    // Water Type:  6390F0
    // Electric Type:  F7D02C
    // Grass Type:  7AC74C
    // Ice Type:  96D9D6
    // Fighting Type:  C22E28
    // Poison Type:  A33EA1
    // Ground Type:  E2BF65
    // Flying Type:  A98FF3
    // Psychic Type:  F95587
    // Bug Type:  A6B91A
    // Rock Type:  B6A136
    // Ghost Type:  735797
    // Dragon Type:  6F35FC
    // Dark Type:  705746
    // Steel Type:  B7B7CE
    // Fairy Type:  D685AD
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
  .attr("r", 10)
  .attr("cx", function(d) { return vis.x(d.cp); })
  .attr("cy", function(d) { return vis.y(d.attack); })
  .attr("fill-opacity", 0)
  .attr("stroke", function(d) {
    return getColor(d.type1);
  })
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

Scatter.prototype.getColor = function(type) {
  var vis = this;

  if (type == "Normal") {
    return vis.colors[0];
  } else if (type == "Fire") {
    return vis.colors[1];
  } else if (type == "Water") {
    return vis.colors[2];
  } else if (type == "Electric") {
    return vis.colors[3];
  } else if (type == "Grass") {
    return vis.colors[4];
  } else if (type == "Ice") {
    return vis.colors[5];
  } else if (type == "Fighting") {
    return vis.colors[6];
  } else if (type == "Poison") {
    return vis.colors[7];
  } else if (type == "Ground") {
    return vis.colors[8];
  } else if (type == "Flying") {
    return vis.colors[9];
  } else if (type == "Psychic") {
    return vis.colors[10];
  } else if (type == "Bug") {
    return vis.colors[11];
  } else if (type == "Rock") {
    return vis.colors[12];
  } else if (type == "Ghost") {
    return vis.colors[13];
  } else if (type == "Dragon") {
    return vis.colors[14];
  } else if (type == "Dark") {
    return vis.colors[15];
  } else if (type == "Steel") {
    return vis.colors[16];
  } else if (type == "Fairy") {
    return vis.colors[17];
  } else {
    return "black";
  }
}

// Scatter.prototype.updateInd = function(ind) {
//   var vis = this;

//   vis.currInd = ind;

//   vis.updateVis();
  
// }