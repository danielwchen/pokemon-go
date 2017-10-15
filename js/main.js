/**
 * Created by Daniel on 10/10/17.
 */

console.log("updated12")

 var w = window,
 d = document,
 e = d.documentElement,
 g = d.getElementsByTagName('body')[0],
 x, y, ypos, ybot;

 checkWinStat()

function checkWinStat() {
  x = w.innerWidth || e.clientWidth || g.clientWidth;
  y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  ypos = w.scrollY;
}

$( window ).resize(function() {
  checkWinStat();
  scatterStatic.resize(x, y);
  scatter.resize(x, y);
});

var scatter;

checkWinStat();

scatterStatic = new Scatter("#vis", x, y);
scatter = new Scatter("#vis", x, y);

d3.graphScroll()
.graph(d3.selectAll('#graph'))
.container(d3.select('#container'))
.sections(d3.selectAll('#sections > div'))
.on('active', function(i){ 
  updateScatter(i);
})

d3.select("#x-form")
.on("change", function() { scatter.setX(d3.select("#x-form").property("value")); });

d3.select("#y-form")
.on("change", function() { scatter.setY(d3.select("#y-form").property("value")); });

d3.select("#c-form")
.on("change", function() { scatter.setC(d3.select("#c-form").property("value")); });



function updateScatter (ind) {
  if (ind == 0) {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');

  }
}