/**
 * Created by Daniel on 7/27/17.
 */

console.log("updated10")

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
  scatter.resize(y);
});

var scatter;

checkWinStat();


scatter = new Scatter("#vis", y);


d3.graphScroll()
.graph(d3.selectAll('#graph'))
.container(d3.select('#container'))
.sections(d3.selectAll('#sections > div'))
.on('active', function(i){ 
  console.log(i + 'th section active');
})


d3.select("#x-form")
  .on("change", function() {

    scatter.setX(d3.select("#x-form").property("value"))

  });

d3.select("#y-form")
  .on("change", function() {

    scatter.setY(d3.select("#x-form").property("value"))

  });

d3.select("#size-form")
  .on("change", function() {
  });

d3.select("#shape-form")
  .on("change", function() {
  });