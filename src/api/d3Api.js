"use strict"; 

var d3 = require('d3'); 
var _ = require('lodash');

var arcsJson = require('./d3Data').arcsJson; 
var arcsArray = require('./d3Data').arcsArray; 
var arcData = {json: {}, array: []};

var _clone = function(item) {
	return JSON.parse(JSON.stringify(item)); //return cloned copy so that the item is passed by value instead of by reference
};

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
var _buildHierarchy = function (csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
      // Not yet at the end of the sequence; move down the tree.
      var foundChild = false;
      for (var k = 0; k < children.length; k++) {
        if (children[k]["name"] === nodeName) {
          childNode = children[k];
          foundChild = true;
          break;
        }
      }
      // If we don't already have a child node for this branch, create it.
      if (!foundChild) {
        childNode = {"name": nodeName, "children": []};
        children.push(childNode);
      }
      currentNode = childNode;
    }
    else {
    // Reached the end of the sequence; create a leaf node.
    childNode = {"name": nodeName, "size": size};
    children.push(childNode);
    }
    }
  }
  return root;
};


var D3Api = {

	createNodes: function (radius) {
		var getData = function (successCallback) {
			// Use d3.text and d3.csv.parseRows so that we do not need to have a header
			// row, and can receive the csv as an array of arrays.
			d3.text("data/sample.csv", function(text) {
				var newArcData = { json: {}, array: [] };
				var csv = d3.csv.parseRows(text);
				var json = _buildHierarchy(csv);

				var partition = d3.layout.partition()
		    		.size([2 * Math.PI, radius * radius])
		    		.value(function(d) { return d.size; });

		    	// For efficiency, filter nodes to keep only those large enough to see.
		    	var nodes = partition.nodes(json)
		    		.filter(function(d) {
		    		return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
				});

		    	newArcData.json = json; 
		    	newArcData.array = nodes; 

		    	successCallback(newArcData);
			});
		};

		getData(function (newArcData) {
			console.log('getData data'); 
	    	console.log(newArcData);
			arcData.json = newArcData.json; 
			arcData.array = newArcData.array;
		});
	},

	getArcData: function () {
    	return _clone(arcData);
    }
};

module.exports = D3Api; 