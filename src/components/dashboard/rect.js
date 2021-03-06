"use strict"; 

var React = require('react'); 
var d3 = require('d3'); 

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },

  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },

  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};


var Rect = React.createClass({
    mixins: [SetIntervalMixin], 

    getDefaultProps: function() {
        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        };
    },

    getInitialState: function() {
      return {
        milliseconds: 0,
        height: 0
      };
    },

    shouldComponentUpdate: function(nextProps) {
      return this.props.height !== this.state.height;
    },

    componentWillMount: function() {
      console.log('will mount');
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({milliseconds: 0, height: this.props.height});
    },

    componentDidMount: function() {
      this.setInterval(this.tick, 10);
    },

    tick: function(start) {
      this.setState({milliseconds: this.state.milliseconds + 10});
    },

    render: function() {
		var easyeasy = d3.ease('back-out');
		var height = this.state.height + (this.props.height - this.state.height) * easyeasy(Math.min(1, this.state.milliseconds / 1000));
		var y = this.props.height - height + this.props.y;

		return (
			<rect className="bar"
				height={height}
				y={y}
				width={this.props.width}
				x={this.props.x} >
			</rect>
			);
    }
});

module.exports = Rect; 