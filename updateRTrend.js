function updateRTrend(){
	rev_actuals = [27,26,28,31,29,31,31,34, 32,33,34,32];
	rev_budget = [28,28,29,30,31,32,32,33,34,34,35,35];

	margin_actuals = [35,34,33,36,32,37,35,32,39,38,36,37]; 
	margin_budget = [36,37,32,38,39,41,38,37,39,39,40, 40];
	month_label = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	var width = 400;
	var height = 400;

	var svg = d3.select("#Actuals");
	var xScale = d3.scaleLinear()
				   .domain([0, 720])
				   .range([0, 270]);
				   
	var yScale = d3.scaleLinear()
				   .domain([0, 40])
				   .range([0, 180]);
				   
	var yAxisScale = d3.scaleLinear()
					   .domain([40,0])
					   .range([0, 180])
					   .nice();
							   
	var yAxis = d3.axisLeft();
	yAxis.scale(yAxisScale);
	d3.select("#yAxis")
		.attr("transform", "translate(" + 30 + "," + 0 +") scale(1,1)")
		.call(yAxis)
		.classed("label", true);			   
						
	let bars = svg.selectAll("rect").data(rev_actuals);
	bars = bars.enter().append("rect").merge(bars);					
	bars.attr("x", function(d,i){ return xScale(i*60); })
		.attr("y", function (d, i) { return 20; })
		.attr("transform", "translate(" + 30 + "," + 200 +") scale(1,-1)")
		.attr("width", function (d) { return xScale(50); })
		.attr("height", function(d){ return yScale(d); })
		.classed("bars", true)
		.append("svg:title")
		.text(function(d, i) { return "A: $ " + rev_actuals[i] + " M\nB: $ " + rev_budget[i] + " M"; });

	let budget = d3.select("#Budgets").selectAll("rect").data(rev_budget);
	budget = budget.enter().append("rect").merge(budget);					
	budget.attr("x", function(d,i){ return xScale(i*60); })
		.attr("y", function (d) { return yScale(d)+18; })
		.attr("transform", "translate(" + 30 + "," + 200 +") scale(1,-1)")
		.attr("width", function (d) { return xScale(50); })
		.attr("height", function(d){ return 2; })
		.style("fill", "#021618");	
		
	let month = d3.select("#xAxis").selectAll("text").data(month_label);
	month = month.enter().append("text").merge(month);					
	month.attr("x", function(d,i){ return xScale(i*60);})
		.attr("y", function (d, i) { return 0; })
		.attr("transform", "translate(" + 30 + "," + 195 +") scale(1,1)")
		.attr("width", function (d) { return xScale(50); })
		.attr("height", function(d){ return 30; })
		.text(function(d){return d})
		.classed("label", true);	
}