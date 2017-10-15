/**
 * Created by Daniel on 10/10/17.
 */

 console.log("updated19")

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
  scatterStatic.resize(0.9*x, y);
  scatter.resize(x, 0.9*y);
});

var scatter;

checkWinStat();

scatterStatic = new Scatter("#bg-vis", 0.9*x, y);
scatter = new Scatter("#vis", x, 0.9*y);

$( document ).ready(function() {
  d3.graphScroll()
  .graph(d3.selectAll('#graph'))
  .container(d3.select('#container'))
  .sections(d3.selectAll('#sections > div'))
  .on('active', function(i){
    console.log(i + 'th section active');
    updateScatter(i);
  })
});


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
    scatterStatic.pin();
    scatterStatic.pinType();
  } else if (ind == 1) {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');
    scatterStatic.pin(['Onix', 'Cloyster']);
    scatterStatic.pinType();
  } else if (ind == 2) {
    scatterStatic.setX('health');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');
    scatterStatic.pin(['Onix', 'Cloyster', 'Chansey']);
    scatterStatic.pinType();
  } else if (ind == 3) {
    scatterStatic.setX('health');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');
    scatterStatic.pin(['Cloyster', 'Chansey', 'Snorlax', 'Wigglytuff', 'Vaporeon']);
    scatterStatic.pinType();
  } else if (ind == 4) {
    scatterStatic.setX('health');
    scatterStatic.setY('attack');
    scatterStatic.setC('type');
    scatterStatic.pin(['Mewtwo', 'Magikarp']);
    scatterStatic.pinType();
  } else if (ind == 5) {
    scatterStatic.setX('health');
    scatterStatic.setY('attack');
    scatterStatic.setC('type');
    scatterStatic.pin(['Mewtwo', 'Magikarp', 'Gyarados']);
    scatterStatic.pinType();
  } else if (ind == 6) {
    scatterStatic.setX('cp'); //cp
    scatterStatic.setY('attack');
    scatterStatic.setC('type');
    scatterStatic.pin(['Mewtwo', 'Magikarp']);
    scatterStatic.pinType();
  } else if (ind == 7) {
    scatterStatic.setX('cp'); //cp
    scatterStatic.setY('attack');
    scatterStatic.setC('type');
    scatterStatic.pin();
    scatterStatic.pinType();
  } else if (ind == 8) {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');
    scatterStatic.pin();
    scatterStatic.pinType();
  } else if (ind == 9) {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');
    scatterStatic.pin();
    scatterStatic.pinType('Bug');
  } else if (ind == 10) {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');
    scatterStatic.pin();
    scatterStatic.pinType('Dragon');
  } else if (ind == 11) {
    scatterStatic.setX('health');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');
    scatterStatic.pin();
    scatterStatic.pinType('Normal');
  } else if (ind == 12) {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('evol');
    scatterStatic.pin();
    scatterStatic.pinType();
  } else if (ind == 13) {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('evol');
    scatterStatic.pin(['Metapod', 'Kakuna']);
    scatterStatic.pinType();
  } else if (ind == 14) {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('evol');
    scatterStatic.pin(['Onix', 'Cloyster']);
    scatterStatic.pinType();
  } else {
    scatterStatic.setX('attack');
    scatterStatic.setY('defense');
    scatterStatic.setC('type');
    scatterStatic.pin();
    scatterStatic.pinType();
  }


  
}