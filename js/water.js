  var mysite = "AGR";
  var elevationArray = new Array();
  var noElevation = 998877.000;
  $(document).ready(function() {
    $("#siteSelect").change(function() {
      $("#parameterSelect").empty();
      for (var i = 0; i < ARCFILDMP.length; i++) {
        if (ARCFILDMP[i].site == $("#siteSelect").val()) {
          for (var j = 0; j < ARCFILDMP[i].parameters.length; j++) {

            param = _.where(paramsLKP, {
              code: ARCFILDMP[i].parameters[j]  
            })[0];


            element = $("#parameterSelect");
            parameterString = param.code + "--" + param.name;
            parameterOption = new Option(parameterString, param.code);
            console.log("! " + parameterString + ", " + param.code);
            element.append(parameterOption);
          }
        }
      }
    });
    $("button").click(function() {
      myurl = 'http://www.usbr.gov/gp-bin/arcread.pl?jsonp=?';
      mysite = $("#siteSelect").val();
      $.getJSON(myurl, {
        st : mysite,
        by : "2010",
        bm : "1",
        bd : "1",
        ey : "2012",
        em : "11",
        ed : "3",
        pa : "FB"
      }, function(data) {
        elevationArray = new Array();
        //	console.log(data);
        for (var i = 0; i < data.SITE.DATA.length; i++) {
          var elevation = parseFloat(data.SITE.DATA[i].FB);
          //if( elevation < 2200 ) { alert(JSON.stringify(data.AGR[i])) }
          if ((elevation != noElevation) && (elevation != 0)) {
            var day = new Date(Date.parse(data.SITE.DATA[i].DATE));
            elevationArray.push({
              "day" : day,
              "elevation" : elevation
            });
          }
        }
        //		console.log(elevationArray);
        //			$("div").html(data.AGR[1].FB);
        $("#minDate").datepicker({
          minDate : -20,
          maxDate : "+1M +10D"
        });
        insertGraph();
      });
    });

    // load the site dropdown
    element = document.getElementById("siteSelect");
    for (var i = 0; i < ARCFILDMP.length; i++) {
      siteString = ARCFILDMP[i].name + " (" + ARCFILDMP[i].site + ")";
      siteOption = new Option(siteString, ARCFILDMP[i].site);

      element.appendChild(siteOption);
    }

    // Load the parameter dropdown
    element = document.getElementById("parameterSelect");
    for (var i = 0; i < 32; i++) {  // only want the top 32, arbitrarily chosen to decrapify the list
      parameterString = paramsLKP[i].code + "--" + paramsLKP[i].name;
      parameterOption = new Option(parameterString, paramsLKP[i].code);

      element.appendChild(parameterOption);
    }

    // Graph it
    insertGraph = function() {
        $("#graph").empty();

					var margin = {
						top : 20,
						right : 20,
						bottom : 30,
						left : 50
					}, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

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

					var svg = d3.select("#graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					x.domain(d3.extent(elevationArray, function(d) {
						return d.day;
					}));
					y.domain(d3.extent(elevationArray, function(d) {
						return d.elevation;
					}));

					svg.append("path").datum(elevationArray).attr("class", "area").attr("d", area);

					svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

					svg.append("g").attr("class", "y axis").call(yAxis).append("text")
					.attr("dy", ".71em").style("text-anchor", "end").text("Price ($)");
    }

  });


