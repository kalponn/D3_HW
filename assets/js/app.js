// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn"t empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and height of the browser window.
  //var svgWidth = window.innerWidth;
  //var svgHeight = window.innerHeight;
  //console.log(svgWidth * 2);
  
  var svgWidth = 960;
  var svgHeight = 500;
  
 var margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 100
 };


  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;
  
  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
	
  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


	
  // Read CSV
  csvfile = "assets/data/data.csv"

  d3.csv(csvfile).then(function(healthData) {  
 
 //the values are all in strings , need to do type conversion for poverty and healthcare
    healthData.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });   

  // Create a linear scale for the horizontal axis.
    var xScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.poverty)-1, d3.max(healthData, d => d.poverty)+ 1])
	.range([0,width]) ; 

    // Create a linear scale for the vertical axis.
    var yScale = d3.scaleLinear()
	.domain([d3.min(healthData, d => d.healthcare)-1, d3.max(healthData, d => d.healthcare)+2])
	.range([height,0])
	  
    // create axes
    var xAxis = d3.axisBottom(xScale).ticks(10);
    var yAxis = d3.axisLeft(yScale).ticks(12);
    

  
    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    
     // Circles
   var circles = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx",d => xScale(d.poverty))
      .attr("cy",d => yScale(d.healthcare))
      .attr("r",'10')
	  .attr("class", "stateCircle")        

      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
      .append('title') // Tooltip
      .text(function (d) { return d.state +
                           '\n In Poverty : ' + d.poverty + '%' +
                           '\n Lacks Healthcare : ' + d.healthcare + '%'})

	 // Create the text for each circle */
        
	var circletext = chartGroup.selectAll("text")
	           .data(healthData)
		       .enter()
		       .append("text")
			   .attr("class", "stateText")
               .attr("font-size", 5)
               .attr("dx", d => xScale(d.poverty))
               .attr("dy", d => yScale(d.healthcare))
               .text(function(d) {
                return d.abbr;
                })
	
	
    // text label for the x axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left  + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Lacks Healthcare(%)");  

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top })`)
      .attr("class", "axisText")
      .style("text-anchor", "middle")
      .text("In Poverty(%) ");
	  
    
  
      	
  });
};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
