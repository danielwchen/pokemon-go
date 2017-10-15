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
  this.c_stat = 'type';

  // Type colors from http://www.epidemicjohto.com/t882-type-colors-hex-colors
  this.c_range = {type:['#A8A77A','#EE8130','#6390F0','#F7D02C','#7AC74C',
                        '#96D9D6','#C22E28','#A33EA1','#E2BF65','#A98FF3',
                        '#F95587','#A6B91A','#B6A136','#735797','#6F35FC',
                        '#705746','#B7B7CE','#D685AD'],
                  evol:['#F7D02C','#A6B91A','#C22E28','#6F35FC'],
                  lege:['#B7B7CE','#F95587']};
  this.c_domain = {type:["Normal","Fire", "Water", "Electric","Grass",
                         "Ice","Fighting","Poison","Ground","Flying",
                         "Psychic","Bug","Rock","Ghost","Dragon",
                         "Dark","Steel","Fairy"],
                   evol:["First", "Second","Third","Legendary"],
                   lege:["Nonlegendary","Legendary"] }
  

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
  vis.margin = {top: 20, right: 80, bottom: 20, left: 40};
  vis.width = vis.winWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.winHeight - vis.margin.top - vis.margin.bottom - 40;

  vis.svgparent = d3.select(vis.parentElement).append("svg")
  .attr("width", vis.width + vis.margin.left + vis.margin.right)
  .attr("height", vis.height + vis.margin.top + vis.margin.bottom)

  vis.svg = vis.svgparent.append("g")
  .attr("transform",
    "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .style('z-index', '999999999')
  .html(function(d) { 
    var tmp;
    if (d.type2) {tmp = d.type2;} else {tmp = "None";}
    return d.name + "<br><img src=\"img/" + d.img + "\" height=\"60px\" width=\"auto\"><br>" + vis.x_stat + ": " + d[vis.x_stat] + "<br>" 
    + vis.y_stat + ": " + d[vis.y_stat] + "<br>T1: " + d.type1 + "<br>T2: " + tmp; 
  });

  vis.svg.call(vis.tip);

  vis.x = d3.scaleLinear().range([0, vis.width]);
  vis.y = d3.scaleLinear().range([vis.height, 0]);
  vis.c = d3.scaleOrdinal()
            .range(vis.c_range[vis.c_stat])
            .domain(vis.c_domain[vis.c_stat]);

  vis.x.domain([0, d3.max(vis.fin_data, function(d) { 
    return d[vis.x_stat];
  })+20]);

  vis.y.domain([0, d3.max(vis.fin_data, function(d) { 
    return d[vis.y_stat];
  })+20]);

  vis.xAxis = vis.svg.append("g")
  .attr("transform", "translate(0," + vis.height + ")")
  .call(d3.axisBottom(vis.x).tickPadding(10));

  vis.yAxis = vis.svg.append("g")
  .call(d3.axisLeft(vis.y).tickSizeInner(-vis.height).tickPadding(10));


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
  .text(vis.y_stat);

  // vis.legend = vis.svg.selectAll(".legend")
  // .data(vis.c.domain())
  // .enter().append("g")
  // .attr("class", "legend")
  // .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 15) + ")"; });

  // vis.legend.append("rect")
  // .attr("class", "legend-rect")
  // .attr("x", vis.width + 36)
  // .attr("width", 18)
  // .attr("height", 18)
  // .attr("stroke-opacity", .6)
  // .attr("fill-opacity", .2)
  // .style("fill", vis.c)
  // .style("stroke", vis.c)
  // .attr("stroke-width", 3);

  // vis.legend.append("text")
  // .attr("x", vis.width + 28)
  // .attr("y", 9)
  // .attr("dy", ".35em")
  // .style("text-anchor", "end")
  // .text(function(d) { return d;});

  vis.initLegend();

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

  vis.updateVis();
};

Scatter.prototype.updateVis = function() {
  var vis = this;

  vis.xAxis
  .call(d3.axisBottom(vis.x).tickSizeInner(-vis.height).tickPadding(10));

  vis.yAxis
  .call(d3.axisLeft(vis.y).tickSizeInner(-vis.width).tickPadding(10));

  vis.xLabel
  .text(vis.x_stat);

  vis.yLabel
  .text(vis.y_stat);

  // vis.legend_rect.enter().append("rect")
  // .attr("class", "legend-rect")
  // .attr("x", vis.width + 36)
  // .attr("y", function(d,i) { return i*20+15; })
  // .attr("width", 18)
  // .attr("height", 18)
  // .attr("stroke-opacity", .6)
  // .attr("fill-opacity", .2)
  // .style("fill", vis.c)
  // .style("stroke", vis.c)
  // .attr("stroke-width", 3);

  // vis.legend_rect.exit().remove();

  // vis.legend_text.enter().append("text")
  // .attr("class", "legend-text")
  // .attr("x", vis.width + 28)
  // .attr("y", function(d,i) {return i*20+15+9; })
  // .attr("dy", ".35em")
  // .style("text-anchor", "end")
  // .text(function(d) { return d;});

  // vis.legend_text.exit().remove();


  vis.dots.transition().duration(500)
  .attr("stroke", function(d) { 
    if (vis.c_stat == 'type') {
      return vis.c(d.type1); 
    } else {
      return vis.c(d[vis.c_stat])
    }
  })
  .attr("fill", function(d) {
    if (vis.c_stat == 'type') {
      if (d.type2) { return vis.c(d.type2); } 
      else { return vis.c(d.type1); }
    } else {
      return vis.c(d[vis.c_stat])
    }
  })
  .attr("cx", function(d) { return vis.x(d[vis.x_stat]); })
  .attr("cy", function(d) { return vis.y(d[vis.y_stat]); })


}

Scatter.prototype.resize = function(w, h) {
  var vis = this;

  vis.winWidth = w;
  vis.winHeight = h;

  vis.width = vis.winWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.winHeight - vis.margin.top - vis.margin.bottom - 40;

  vis.svgparent
  .attr("width", vis.width + vis.margin.left + vis.margin.right)
  .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

  vis.x.range([0, vis.width]);
  vis.y.range([vis.height, 0]);

  vis.xAxis
  .attr("transform", "translate(0," + vis.height + ")")

  vis.xLabel
  .attr("x", vis.width)
  .attr("y", vis.height-6);

  vis.yLabel
  .attr("y", 6)
  .attr("dy", ".71em");


  // vis.legend.selectAll("rect")
  // .attr("x", vis.width + 36);

  // vis.legend.selectAll("text")
  // .attr("x", vis.width + 28);

  vis.legend_rect
  .attr("x", vis.width + 36);

  vis.legend_text
  .attr("x", vis.width + 28);



  vis.updateVis();

}

Scatter.prototype.setX = function(stat) {
  var vis = this;

  vis.x_stat = stat;

  vis.x.domain([0, d3.max(vis.fin_data, function(d) { 
    return d[vis.x_stat]; 
  })+20]);


  vis.updateVis();
}

Scatter.prototype.setY = function(stat) {
  var vis = this;

  vis.y_stat = stat;

  vis.y.domain([0, d3.max(vis.fin_data, function(d) { 
    return d[vis.y_stat]; 
  })+20]);

  vis.updateVis();
}

Scatter.prototype.setC = function(stat) {
  var vis = this;

  vis.c_stat = stat;

  vis.c = d3.scaleOrdinal()
            .range(vis.c_range[vis.c_stat])
            .domain(vis.c_domain[vis.c_stat]);

  vis.updateVis();
}

Scatter.prototype.pin = function(pokemon) {
  var vis = this;

  if (pokemon) {
    vis.dots.transition().duration(80)
    .attr("stroke-opacity",function(d) {
      if(pokemon.includes(d.name)) {
        return 0.8;
      } else {
        return 0.1;
      }
    })
    .attr("fill-opacity",function(d) {
      if(pokemon.includes(d.name)) {
        return 0.8;
      } else {
        return 0.1;
      }
    });
  } else {vis.dots.transition().duration(80)
    .attr("stroke-opacity",0.6)
    .attr("fill-opacity",0.2);
  }

  vis.updateVis();
}

Scatter.prototype.pinType = function(type) {
  var vis = this;

  if (type) {
    vis.dots.transition().duration(80)
    .attr("stroke-opacity",function(d) {
      if(d.type1 == type || d.type2 == type) {
        return 0.8;
      } else {
        return 0.1;
      }
    })
    .attr("fill-opacity",function(d) {
      if(d.type1 == type || d.type2 == type) {
        return 0.8;
      } else {
        return 0.1;
      }
    });
  } else {vis.dots.transition().duration(80)
    .attr("stroke-opacity",0.6)
    .attr("fill-opacity",0.2);
  }

  vis.updateVis();
}


Scatter.prototype.initLegend = function() {
  var vis = this;


  this.c_range = {type:['#A8A77A','#EE8130','#6390F0','#F7D02C','#7AC74C',
                        '#96D9D6','#C22E28','#A33EA1','#E2BF65','#A98FF3',
                        '#F95587','#A6B91A','#B6A136','#735797','#6F35FC',
                        '#705746','#B7B7CE','#D685AD'],
                  evol:['#F7D02C','#A6B91A','#C22E28','#6F35FC'],
                  lege:['#B7B7CE','#F95587']};
  this.c_domain = {type:["Normal","Fire", "Water", "Electric","Grass",
                         "Ice","Fighting","Poison","Ground","Flying",
                         "Psychic","Bug","Rock","Ghost","Dragon",
                         "Dark","Steel","Fairy"],
                   evol:["First", "Second","Third","Legendary"],
                   lege:["Nonlegendary","Legendary"] }

  vis.legend_rect1 = vis.svg.selectAll(".legend-rect1")
  .data(vis.c_domain.type)
  .enter().append("rect")
  .attr("class", "legend-rect1")
  .attr("x", vis.width + 36)
  .attr("y", function(d,i) { return i*20+15; })
  .attr("width", 18)
  .attr("height", 18)
  .attr("stroke-opacity", .6)
  .attr("fill-opacity", .2)
  .style("fill", function(d,i) {
    return vis.c_range.type[i];
  })
  .style("stroke", function(d,i) {
    return vis.c_range.type[i];
  })
  .attr("stroke-width", 3);

  vis.legend_text1 = vis.svg.selectAll(".legend-text1")
  .data(vis.c_domain.type)
  .enter().append("text")
  .attr("class", "legend-text1")
  .attr("x", vis.width + 28)
  .attr("y", function(d,i) {return i*20+15+9; })
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d;});

  vis.legend_rect2 = vis.svg.selectAll(".legend-rect2")
  .data(vis.c_domain.evol)
  .enter().append("rect")
  .attr("class", "legend-rect2")
  .attr("x", vis.width + 36)
  .attr("y", function(d,i) { return i*20+15; })
  .attr("width", 18)
  .attr("height", 18)
  .attr("stroke-opacity", .6)
  .attr("fill-opacity", .2)
  .style("fill", function(d,i) {
    return vis.c_range.evol[i];
  })
  .style("stroke", function(d,i) {
    return vis.c_range.evol[i];
  })
  .attr("stroke-width", 3);

  vis.legend_text2 = vis.svg.selectAll(".legend-text2")
  .data(vis.c_domain.evol)
  .enter().append("text")
  .attr("class", "legend-text2")
  .attr("x", vis.width + 28)
  .attr("y", function(d,i) {return i*20+15+9; })
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d;});

  vis.legend_rect3 = vis.svg.selectAll(".legend-rect3")
  .data(vis.c_domain.lege)
  .enter().append("rect")
  .attr("class", "legend-rect3")
  .attr("x", vis.width + 36)
  .attr("y", function(d,i) { return i*20+15; })
  .attr("width", 18)
  .attr("height", 18)
  .attr("stroke-opacity", .6)
  .attr("fill-opacity", .2)
  .style("fill", function(d,i) {
    return vis.c_range.lege[i];
  })
  .style("stroke", function(d,i) {
    return vis.c_range.lege[i];
  })
  .attr("stroke-width", 3);

  vis.legend_text3 = vis.svg.selectAll(".legend-text3")
  .data(vis.c_domain.lege)
  .enter().append("text")
  .attr("class", "legend-text3")
  .attr("x", vis.width + 28)
  .attr("y", function(d,i) {return i*20+15+9; })
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d;});
}