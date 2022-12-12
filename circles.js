/* Now let's trigger each node to animate in its own time, so it feels more natural */

/* Let's import d3 */
// var script = document.createElement('script');
// script.src = 'https://d3js.org/d3.v4.min.js';
// document.head.appendChild(script);



function generateOpacityValues(n, variability, threshold) {
  var values = [];
  for (var i = 0; i < n; i++) {
    values.push(1 - Math.pow(i / n, 2));
  }
  var finalValues = [];
  for (var i = 0; i < n; i++) {
    finalValues.push(Math.random() * (1 - values[i] * variability) + values[i] * variability);
  }
  return finalValues.map(function(d) {
    return d < threshold ? 0.2 : d;
  });
}

var svg = d3.select('body').append('svg')
  .attr('width', '100%')
  .attr('height', '100%');



// var svgWidth = svg.node().getBoundingClientRect().width;
// var svgHeight = svg.node().getBoundingClientRect().height;
//
// var windowWidth = window.innerWidth;
// var windowHeight = window.innerHeight;
//
// var scaleFactor = Math.min(windowWidth / svgWidth, windowHeight / svgHeight);
//
// svg.attr('transform', 'scale(' + scaleFactor / 2 + ')');


window.addEventListener('resize', function() {
  var svgWidth = svg.node().getBoundingClientRect().width;
  var svgHeight = svg.node().getBoundingClientRect().height;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var scaleFactor = Math.min(windowWidth / svgWidth, windowHeight / svgHeight);
  svg.attr('transform', 'scale(' + scaleFactor  + ')');
  console.log('resizing');
});

var N = 200;
var nodes = d3.range(N).map(function(d) {
  return {
    id: d
  };
});
var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-1))
  .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return 1;
  }))
  .force('x', d3.forceX().strength(0.01))
  .force('y', d3.forceY().strength(0.01))
  .alphaDecay(1)
  .on('tick', ticked);
function ticked() {
  var u = svg.selectAll('circle')
    .data(nodes);
  u.enter()
    .append('circle')
    .attr('r', 4)
    .attr('fill', 'white')
    .merge(u)
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    })
    .attr('fill-opacity', function(d) {
      return generateOpacityValues(N, 0.01, 0.01)[d.id];
    });
  u.exit().remove();
}
function animate() {
  var newOpacityValues = generateOpacityValues(N, 0.01, 0.01);
  var u = svg.selectAll('circle')
    .data(nodes);
  u.enter()
    .append('circle')
    .attr('r', 4)
    .attr('fill', 'white')
    .merge(u)
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    })
    .transition()
    .duration(500)
    .delay(function(d) {
      return Math.random() * 500;
    })
    .attr('fill-opacity', function(d) {
      return newOpacityValues[d.id];
    });
  u.exit().remove();
  setTimeout(animate, 500);
}
animate();
svg.transition()
  .duration(2000)
  .attr('opacity', 1);
