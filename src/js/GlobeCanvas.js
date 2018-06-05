import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import * as topojson from 'topojson';
import * as d3 from 'd3v4';
import {withFauxDOM} from 'react-faux-dom';
import { select } from 'd3-selection';

class GlobeCanvas extends Component {

  constructor(props) {
    super(props);
    this.d3GlobeCanvasAnimation.bind(this);
  }

  componentDidMount () {
    this.d3GlobeCanvasAnimation();
  }

  // componentDidUpdate () {
  //   this.d3GlobeCanvasAnimation();
  // }

  d3GlobeCanvasAnimation = () => {
    let data = [
        {"latitude": 22, "longitude": 88, 'town': 'london'},
        {"latitude": 12.61315, "longitude": 38.37723, 'town': 'roubaix'},
        {"latitude": -30, "longitude": -58, 'town': 'sf'},
        {"latitude": -14.270972, "longitude": -170.132217, 'town': 'lima'},
        {"latitude": 28.033886, "longitude": 1.659626, 'town': 'paris'},
        {"latitude": 40.463667, "longitude": -3.74922, 'town': 'madrid'},
        {"latitude": 35.907757, "longitude": 127.766922,'town': 'rome'},
        {"latitude": 23.634501, "longitude": -102.552784, 'town': 'newyork'}
    ];

    var width = 500,
        height = 425;
    var radius = height / 2 - 5,
        scale = radius,
        velocity = .02;
    var projection = d3.geoOrthographic()
        .translate([width / 2, height / 2])
        .scale(scale)
        .clipAngle(90);
    var canvas = d3.select(".canvas-container").append("canvas")
        .attr("width", width)
        .attr("height", height);
    var context = canvas.node().getContext("2d");
    var path = d3.geoPath()
        .projection(projection)
        .context(context);

    var graticule = d3.geoGraticule().step([7, 3]);
    var grid = graticule();

    d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json", function(error, world) {
      if (error) throw error;
      var land = topojson.feature(world, world.objects.land);

      d3.timer(function(elapsed) {

        context.clearRect(0, 0, width, height);
        projection.rotate([velocity * elapsed, 0]);
        context.beginPath();
        // path(land);
        context.fill();
        context.beginPath();


        context.beginPath();
        path(grid);
        context.lineWidth = .5;
        context.strokeStyle = "rgba(119,119,119, 1)";
        context.stroke();

      });
    });



    d3.select(self.frameElement).style("height", height + "px");
  }


  render() {

    return (
      <div className="canvas-container"></div>
      )
  }

}

export default GlobeCanvas;