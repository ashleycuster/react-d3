/*
 *
 * This code was modified from the example found at http://bl.ocks.org/kerryrodden/7090426
 * which is covered by the Apache v2.0 License. A copy of this license is as follows:
 *    --- BEGIN ---
 *    Copyright 2013 Google Inc. All Rights Reserved.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 *  --- END ---
 * Developers: Do not remove this notification or license.
 */

"use strict"; 

var React = require('react'); 
var d3 = require('d3'); 
var _ = require('lodash');

// Mapping of step names to colors.
var colors = {
  "fruit": "#5687d1",
  "berry": "#7b615c",
  "food": "#de783b",
  "vegetable": "#6ab975",
  "green": "#a173d1",
  "red": "#bbbbbb"
};

var arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx; })
            .innerRadius(function(d) { return Math.sqrt(d.y); })
            .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });



var Path = React.createClass({
  propTypes: {
    height: React.PropTypes.number.isRequired, 
    width: React.PropTypes.number.isRequired,
    radius: React.PropTypes.number, 
    arcData: React.PropTypes.object.isRequired
  },

    getDefaultProps: function () { 
      return {
        arc: arc
      };
    },

    render: function() {
      console.log('path arcData: ');
      console.log(this.props.arcData);
      // var display = this.state.nodes.depth ? null : "none";
      // var fill = colors[this.props.arcsJson.name]; 
      if (this.props.arcData.array.length < 1) {
        return (<g></g>);
      }
      else {
        return (
          <g width={this.props.width} height={this.props.height} transform={"translate(" + this.props.width / 2 + "," + this.props.height / 2 + ")"}>
            { this.props.arcData.array.map(this.renderPaths) }
          </g>
        );
      }
    }, 

    renderPaths: function (node) {
      var props = {
        display: node.depth ? null : "none", 
        d: this.props.arc(node), 
        "fill-rule": "evenodd", 
        fillOpacity: 1, 
        fill: colors[node.name]
      };
      return (
        <path {...props}></path>
      );
    }
});

module.exports = Path; 

            // display={this.props.arcsJson.depth ? null : "none"}
            // d={this.props.arc(this.props.arcsArray)}
            // fill-rule={"evenodd"}
            // fill={fill}
            // fillOpacity={1} 

          // <path
          //   display={this.state.json.depth ? null : "none"}
          //   d={this.state.arc}
          //   fill-rule={"evenodd"}
          //   fill={fill}
          //   fillOpacity={1} >
          // </path>