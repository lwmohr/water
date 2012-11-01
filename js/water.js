var elevationArray = new Array();
var elevationArrayGraph = new Array();
var minDate, maxDate, maxDays, minDateGraph, maxDateGraph;
var currentDate = new Date();
var noElevation = 998877.000;

// go get the data
getData = function() {
	elevationArray = new Array();
	myurl = 'http://www.usbr.gov/gp-bin/arcread.pl?jsonp=?';
	mysite = $("#siteSelect").val();
	myparam = $("#parameterSelect").val();
	$("#inprogress").show();
	$.getJSON(myurl, {
		"st" : mysite,
		"by" : "1940",  // get earliest year
		"bm" : "1",
		"bd" : "1",
		"ey" : currentDate.getFullYear(),
		"em" : currentDate.getMonth() + 1,
		"ed" : currentDate.getDate(),
		"pa" : myparam
	}, function(data) {
    keys = _.keys(data.SITE.DATA[0]);  // Date, FB? LZ?
    key = keys[1];

		for (var i = 0; i < data.SITE.DATA.length; i++) {
			elevation = parseFloat(data.SITE.DATA[i][key]);
			if ((elevation != noElevation) && (elevation > 0)) {
				day = new Date(Date.parse(data.SITE.DATA[i].DATE));
				elevationArray.push({
					"day" : day,
					"elevation" : elevation
				});
			}
		}
		if (elevationArray.length > 0) {
			$("#noData").hide();
		} else {
			$("#noData").show();
		}
		minDate = elevationArray[0].day;
		maxDate = elevationArray[elevationArray.length - 1].day;
		maxDays = Math.floor((maxDate.getTime() - minDate.getTime()) / 86400000);
		minDateGraph = minDate;
		maxDateGraph = maxDate;
		elevationArrayGraph = elevationArray.slice(0);
		$("#inprogress").hide();
		showDateSlider();
		insertGraph();

	});
}
//set up the date slider
showDateSlider = function() {

	$(function() {
		$("#slider-range").slider({
			range : true,
			//min : elevationArray[0].day.getTime(),
			max : maxDays,
			values : [0, maxDays],
			slide : function(event, ui) {
				$("#dateRange").val(addToMinDate(ui.values[0]) + " - " + addToMinDate(ui.values[1]));
				minDateGraph = new Date(minDate);
				maxDateGraph = new Date(minDate);
				minDateGraph.setDate(minDateGraph.getDate() + ui.values[0]);
				maxDateGraph.setDate(maxDateGraph.getDate() + ui.values[1]);
				updateRange(insertGraph);
			}
		});
		$("#dateRange").val(addToMinDate($("#slider-range").slider("values", 0)) + " - " + addToMinDate($("#slider-range").slider("values", 1)));
	});
	$("#dateSliderDiv").show();

}
//calculate date from slider value
addToMinDate = function(daysToAdd) {
	slideDate = new Date(minDate);
	slideDate.setDate(slideDate.getDate() + daysToAdd);
	return $.datepicker.formatDate('M d, yy', slideDate);
}
// callback messings
updateRange = function(callback) {
	elevationArrayGraph = new Array();
	elevationArrayGraph = _.filter(elevationArray, function(arr) {
		if (arr.day >= minDateGraph && arr.day <= maxDateGraph) {
			return arr;
		}
	});

	callback();
}
// create and append svg graph
insertGraph = function() {
	$("#graph").empty();

	var margin = {
		top : 20,
		right : 20,
		bottom : 30,
		left : 50
	}, width = $("#graph").width() - margin.left - margin.right, height = $(document).height() - margin.top - margin.bottom - 125;

	var parseDate = d3.time.format("%d-%b-%y").parse;

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

	var area = d3.svg.area().x(function(d) {
		return x(d.day);
	}).y0(height).y1(function(d) {
		return y(d.elevation);
	});

	var svg = d3.select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	x.domain(d3.extent(elevationArrayGraph, function(d) {
		return d.day;
	}));
	y.domain(d3.extent(elevationArrayGraph, function(d) {
		return d.elevation;
	}));

	svg.append("path").datum(elevationArrayGraph).attr("class", "area").attr("d", area);
	svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
	svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("dy", ".71em").style("text-anchor", "end").text("Elev.");
}

$(document).ready(function() {

	// when the site dropdown changes, update the parameters.
	$("#siteSelect").change(function() {
		$dropdown = $(this);
		$parameters = $("#parameterSelect");
		selectedSite = $dropdown.val();
		if ($parameters.val() == "NONE") {
			$dropdown.hide();
			$("#selectSpan").hide();

			validParameters = _.find(ARCFILDMP, function(site) {
				if (site.site == selectedSite) {
					siteString = site.name + " (" + site.site + ")";
					return site;
				}
			});

			$("#parameterSelectLabel").text(siteString);
			$("#parameterSelectLabel").show();
			$parameters.empty();

			_.each(validParameters.parameters, function(element, index) {
				_.find(paramsLKP, function(element2) {
					if (element == element2.code) {
						parameterString = element2.code + "--" + element2.name;
						option = $('<option>').val(element2.code).text(parameterString);
						$parameters.append(option);
						return true;
					}
				});
			});

		}
		getData();
	});

	// when the parameter dropdown changes, update the sites.
	$("#parameterSelect").change(function() {
		$dropdown = $(this);
		$sites = $("#siteSelect");
		selectedParam = $dropdown.val();
		$dropdown.hide();
		$("#selectSpan").hide();

		validSites = _.filter(ARCFILDMP, function(site) {
			if (_.contains(site.parameters, selectedParam)) {
				return site;
			}
		});

		_.find(paramsLKP, function(element) {
			if (selectedParam == element.code) {
				parameterString = element.code + "--" + element.name;
				return true;
			}
		});
		$("#siteSelectLabel").text(parameterString);
		$("#siteSelectLabel").show();
		$("#siteSelect").empty();

		option = $('<option>').val("NONE").text("--Select Site--");
		$sites.append(option);

		_.each(validSites, function(element, index) {
			siteString = element.name + " (" + element.site + ")";
			option = $('<option>').val(element.site).text(siteString);
			$sites.append(option);
		});

	});

	$(window).resize(function() {
		insertGraph();
	});
	$("#parameterSelect").trigger('change');

});

