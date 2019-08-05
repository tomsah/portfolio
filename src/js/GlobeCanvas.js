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

  d3GlobeCanvasAnimation = () => {
    let locations = [
        {"latitude": 51.5074, "longitude": 0.1278, 'town': 'London'},
        {"latitude": 40.463667, "longitude": -3.749220, 'town': 'Spain'},
        {"latitude": -9.189967, "longitude": -75.015152, 'town': 'Peru'},
        {"latitude": -1.831239, "longitude": -78.183406, 'town': 'Ecuador'},
        {"latitude": 37.090240, "longitude": -95.712891, 'town': 'USA'},
        {"latitude": 23.634501, "longitude": -102.552784, 'town': 'Mexico'},
        {"latitude": 20.593684, "longitude": 100.992541, 'town': 'India'},
        {"latitude": 15.870032, "longitude": 100.992541, 'town': 'Thailand'},
        {"latitude": -1.826847, "longitude": -80.752973, 'town': 'Montañita'},
        {"latitude": 0.505031, "longitude": -80.021354,'town': 'Mompiche'}

    ];

  const width = 500,
      height = 425,
      speed = 0.008,
      start = Date.now();

  const sphere = {type: "Sphere"};

  const projection = d3.geoOrthographic()
      .scale(height / 2.1)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      // .precision(.5);

  const graticule = d3.geoGraticule().step([7, 3]);

  const canvas = d3.select(".canvas-container").append("canvas")
      .attr("width", width)
      .attr("height", height);

  const context = canvas.node().getContext("2d");

  const path = d3.geoPath()
      .projection(projection)
      .context(context);

  d3.queue().await(load);

  function load(error, cities) {
    if (error) { console.log(error); }

    const grid = graticule();
    const outerArray = [];

   locations.forEach(function(el) {
      const innerArray = [+el.longitude, +el.latitude, el.town];
      outerArray.push(innerArray);
    });

    const points = {
      type: "MultiPoint",
      coordinates: outerArray
    };

    var cities =   outerArray.forEach(function(d) {
         context.fillText(
          d[2],
          projection(d)[0] ,
          projection(d)[1]
          );
       });


    d3.timer(function() {

      projection.rotate([speed * (Date.now() - start), -35, 0]);
      context.clearRect(0, 0, width, height);

      context.beginPath();
      path(grid);
      context.lineWidth = .5;
      context.strokeStyle = "rgba(119,119,119, 1)";
      context.stroke();


      context.beginPath();
      outerArray.forEach(function(d) {
        const coordinate = [d[0], d[1]];
        const center = [width / 2, height / 2];
        const gdistance =d3.geoDistance(coordinate,projection.invert(center));

        if(gdistance < 1.57079632679490) {
          context.fillText(
          d[2],
          projection(d)[0],
          projection(d)[1]
          );
        }
       });

       context.textAlign = "center";
       context.textBaseline = "bottom";

      //cities dot
      context.beginPath();
      path(points);
      context.fillStyle = "blue";
      context.fill();

      context.restore();
    })
  }

  d3.select(self.frameElement).style("height", (2*height) + "px");
  }


  render() {

    return (
      <div className="canvas-container"></div>
      )
  }

}

export default GlobeCanvas;