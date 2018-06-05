import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import * as topojson from 'topojson';
// import * as d3 from 'd3-geo';
// import d3Geo from 'd3-geo';
import {withFauxDOM} from 'react-faux-dom';
import { select } from 'd3-selection';
import imageGlobe from '../images/globe.png';

class Globe2 extends Component {

  constructor(props) {
    super(props);
    this.d3GlobeAnimation.bind(this);
  }

  componentDidMount () {
    this.d3GlobeAnimation();
  }

  // componentDidUpdate () {
  //   this.d3GlobeAnimation();
  // }

  //svg
  d3GlobeAnimation = () => {
    var width = 960,
      height = 500;

    const config = {
      speed: 0.008,
      verticalTilt: -35,
      horizontalTilt: 0
    }

    var rotate = [.001, 0],
      velocity = [.013, 0],
      time = Date.now();

    const center = [width/2, height/2];

    var centroid = d3.geo.path()
      .projection(function(d) { return d; })
      .centroid;

    var projection = d3.geo.orthographic()
        .scale(200)
        .clipAngle(90 + 1e-6)
        .precision(.7);

    var path = d3.geo.path()
        .projection(projection);

    var graticule = d3.geo.graticule().step([7, 3]);

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    var graticuleLine =  svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style('stroke-opacity', '0.5')
        .style("stroke", "grey");


    svg.append("circle")
        .attr("class", "graticule-outline")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr('fill', 'transparent')
        .style('stroke', 'white')
        .style('stroke-width', '.5px')
        .style('stroke-opacity', '0.5')
        .attr("r", projection.scale());

      var cities = createCities();

      var cityPoints = svg.append("g").attr("class", "points")
           .selectAll("path").data(cities)
           .enter().append("path")
           .attr("class", "cityPoint")
           .attr('fill', 'white')
           .attr("d", path);

        svg.append("g")
            .attr("class", "label_background")
            .selectAll("rect").data(cities)
            .enter().append("rect")
            .attr("class", "label")
            .attr({x: 0, y: -11, height: 12})
            .attr("width", function(d,i) { return i === 0 ? 40 : 69;})
            .style("fill", "yellow")
            //.style("opacity", 0.5);

        svg.append("g").attr("class","labels")
            .selectAll("text").data(cities)
            .enter().append("text")
            .attr("class", "label")
            .attr("text-anchor", "start")
            .style('font-size', '12px')
            .text(function(d) { return d.properties.name })


        position_labels();
        //debugger;
        rotateGlobe();
        //drawGraticule();
        //shrinkGlobe();

      function createCities() {
          var cities =  [
                { "type": "Feature", "properties": { "name": "Munich"  },
                    "geometry": { "type": "Point", "coordinates": [ 11.581981, 48.135125 ] } },
                { "type": "Feature", "properties": { "name": "San Antonio"  },
                    "geometry": { "type": "Point", "coordinates": [ -98.5, 29.4167 ] } },
                { "type": "Feature", "properties": { "name": "Melbourne"  },
                "geometry": { "type": "Point", "coordinates": [ 144.963056, -37.813611,  ] } }
                ];
         return cities;
      }

      function position_labels() {
          var centerPos = projection.invert([width/2,height/2]);
          var arc = d3.geo.greatArc();

          svg.selectAll(".label")
            .attr("transform", function(d) {
              var loc = projection(d.geometry.coordinates),
                x = loc[0],
                y = loc[1];
              var offset = 5;
              return "translate(" + (x+offset) + "," + (y-2) + ")"
            })
            // .attr( "fill-opacity", 0 ).transition().delay(0.4)
            // .style("fill-opacity",function(d) {
            //   var d = arc.distance({source: d.geometry.coordinates, target: centerPos});
            //   return (d > 1.57) ? '0' : '1';
            // })
            .style("display",function(d) {
              var d = arc.distance({source: d.geometry.coordinates, target: centerPos});
              return (d > 1.57) ? 'none' : 'inline';
            });
        }

      function rotateGlobe() {
         d3.timer(function(elapsed) {
            var dt = Date.now() - time;
           projection.rotate([config.speed * elapsed - 120,                config.verticalTilt,config.horizontalTilt]);
            redraw();
        });
      }

      // function shrinkGlobe() {
      //   redrawTransition(2500);
      // // projection.scale(200);
      //   // redrawTransition(2500);
      // }

      function redraw() {
            graticuleLine.attr("d", path);
            cityPoints.attr("d", path);
            position_labels();
      }

      function redrawTransition(mSeconds) {
        projection.scale(50);
        graticule.transition().duration(mSeconds).attr("d", path);
        cityPoints.attr("d", path);
        position_labels();
      }


  }

  render() {

    return (
     <svg ref={node => this.node = node}></svg>
      )
  }

}

export default Globe2;