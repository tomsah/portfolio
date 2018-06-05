import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import * as topojson from 'topojson';
import * as d3 from 'd3v4';
import {withFauxDOM} from 'react-faux-dom';
import { select } from 'd3-selection';
import imageGlobe from '../images/globe.png';

class Globe extends Component {

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

    const width = 500;
    const height = 425;
    const config = {
      speed: 0.008,
      verticalTilt: -35,
      horizontalTilt: 0
    }
    let locations = [
        {"latitude": 22, "longitude": 88, 'town': 'london'},
        {"latitude": 12.61315, "longitude": 38.37723, 'town': 'roubaix'},
        {"latitude": -30, "longitude": -58, 'town': 'sf'},
        {"latitude": -14.270972, "longitude": -170.132217, 'town': 'lima'},
        {"latitude": 28.033886, "longitude": 1.659626, 'town': 'paris'},
        {"latitude": 40.463667, "longitude": -3.74922, 'town': 'madrid'},
        {"latitude": 35.907757, "longitude": 127.766922,'town': 'rome'},
        {"latitude": 23.634501, "longitude": -102.552784, 'town': 'newyork'}
    ];
    const d3Globe = this.node;
    const svg = d3.select('svg').attr('width', width).attr('height', height);
    const markerGroup = svg.append('g');
    const projection = d3.geoOrthographic();
    const clip = projection.clipAngle( 90 + 1e-6);
    const precision = projection.precision(.7);
    const initialScale = projection.scale(200).translate([width/2, height/2]);
    const path = d3.geoPath().projection(projection);
    const center = [width/2, height/2];


    drawGlobe();
    drawGraticule();
    enableRotation();

    function drawGlobe() {
             svg.selectAll(".segment")
               .enter().append("path")
               .attr("class", "segment")
               .attr("d", path)
               .style("stroke", "#888")
               .style("stroke-width", "1px")
               .style("fill", (d, i) => '#e5e5e5')
               .style("opacity", ".6");
            drawMarkers();
    }

    function drawGraticule() {
      const graticule = d3.geoGraticule().step([7, 3]);
      svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("stroke", "#ccc");
    }

    function enableRotation() {
      d3.timer(function (elapsed) {
         projection.rotate([config.speed * elapsed - 120,
                            config.verticalTilt, config.horizontalTilt]);
      svg.selectAll("path").attr("d", path);
      drawMarkers();
      });
    }

    function drawMarkers() {
      const markers = markerGroup.selectAll('circle').data(locations);
      const markersText = markerGroup.selectAll('text').data(locations);
      const rectLabel = markerGroup.selectAll('rect').data(locations);
     // var bbox = markersText.getBBox();
     rectLabel
     .enter()
     .append('rect')
     .merge(rectLabel)
     .attr('class', 'rectlabels')
     .attr("x", d => projection([d.longitude, d.latitude])[0] )//- (d.width / 1.55)
     .attr("y", d => projection([d.longitude, d.latitude])[1] - 30)
     .attr( 'fill', 'black')
     .attr("width", function(d) {return d.width * 1.25 || 50; })
     .attr( "fill-opacity", 0 ).transition().delay(0.4)
     .attr('fill-opacity', d => {
       const coordinate = [d.longitude, d.latitude];
       const gdistance =d3.geoDistance(coordinate,projection.invert(center));
       return gdistance > 1.57 ? '0' : '1';
     });

      markersText
        .enter()
        .append('text')
        .merge(markersText)
        .text(function(d) {return d.town; })
        .style('font-size', '12px')
        .attr("x", d => projection([d.longitude, d.latitude])[0])
        .attr("y", d => projection([d.longitude, d.latitude])[1])
        .attr('class', 'svgtext')
        .attr('dy', '-10px')
        .attr("fill",'white')
        .style("text-anchor","middle")
        .attr("dominant-baseline", "text-after-edge")
        .attr( "fill-opacity", 0 ).transition().delay(0.4)
        .each(function(d) {
            d.width = this.getBBox().width;
            //console.log(d.width = this.getBBox().width);
         })
        .attr('fill-opacity', d => {
          const coordinate = [d.longitude, d.latitude],
                gdistance =d3.geoDistance(coordinate,projection.invert(center));
          return gdistance > 1.57 ? '0' : '1';
        });

      markers
        .enter()
        .append('circle')
        .merge(markers)
        .attr('cx', d => projection([d.longitude, d.latitude])[0])
        .attr('cy', d => projection([d.longitude, d.latitude])[1])
        .attr("fill", 'white')
        .attr( "fill-opacity", 0 ).transition().delay(0.8)
        .attr('fill-opacity', d => {
          const coordinate = [d.longitude, d.latitude],
                gdistance =d3.geoDistance(coordinate,projection.invert(center));
          return gdistance > 1.57 ? '0' : '1';
        })
      .attr('r', 4);


      markerGroup.each(function () {
        // this.append("rect");
        // console.log(this);
        this.parentNode.appendChild(this);
      });
    }
  }

  render() {

    return (
     <svg ref={node => this.node = node}></svg>
      )
  }

}

export default Globe;