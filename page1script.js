rev_actuals = [27,26,28,31,29,31,31,34, 32,33,34,32];
rev_budget = [28,28,29,30,31,32,32,33,34,34,35,35];

margin_actuals = [35,34,33,36,32,37,35,32,39,38,36,37]; 
margin_budget = [36,37,32,38,39,41,38,37,39,39,40, 40];
month_label = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var width = 400;
var height = 400;

var svg = d3.select("#RTrend");
var xScale = d3.scaleLinear()
    		   .domain([0, 720])
			   .range([0, 350]);
			   
var yScale = d3.scaleLinear()
    		   .domain([0, 40])
			   .range([10, 325]);
			   
var yAxisScale = d3.scaleLinear()
				   .domain([40,0])
				   .range([10, 325])
				   .nice();
						   
var yAxis = d3.axisLeft();
yAxis.scale(yAxisScale);
d3.select("#yAxis")
	.attr("transform", "translate(" + 40 + "," + 0 +") scale(1,1)")
	.call(yAxis);			   
					
let bars = svg.selectAll("rect").data(rev_actuals);
bars = bars.enter().append("rect").merge(bars);					
bars.attr("x", function(d,i){ return xScale(i*60); })
	.attr("y", function (d, i) { return 25; })
	.attr("transform", "translate(" + 50 + "," + 350 +") scale(1,-1)")
	.attr("width", function (d) { return xScale(50); })
	.attr("height", function(d){ return yScale(d); })
	.classed("bars", true)
	.append("svg:title")
    .text(function(d, i) { return "A: $ " + rev_actuals[i] + " M\nB: $ " + rev_budget[i] + " M"; });

let budget = d3.select("#Budgets").selectAll("rect").data(rev_budget);
budget = budget.enter().append("rect").merge(budget);					
budget.attr("x", function(d,i){ return xScale(i*60); })
	.attr("y", function (d) { return yScale(d); })
	.attr("transform", "translate(" + 50 + "," + 350 +") scale(1,-1)")
	.attr("width", function (d) { return xScale(50); })
	.attr("height", function(d){ return 10; })
	.style("fill", "#021618");	
	
let month = d3.select("#xAxis").selectAll("text").data(month_label);
month = month.enter().append("text").merge(month);					
month.attr("x", function(d,i){ return xScale(i*60);})
	.attr("y", function (d, i) { return 0; })
	.attr("transform", "translate(" + 50 + "," + 350 +") scale(1,1)")
	.attr("width", function (d) { return xScale(50); })
	.attr("height", function(d){ return 50; })
	.text(function(d){return d})
	.classed("label", true);	
	
//Margin Trends	
svg = d3.select("#MTrend");
xScale = d3.scaleLinear()
    		   .domain([0, 720])
			   .range([0, 350]);
			   
yScale = d3.scaleLinear()
    	   .domain([0, 45])
		   .range([10, 325]);
			   
yAxisScale = d3.scaleLinear()
			   .domain([45,0])
			   .range([10, 325])
			   .nice();
						   
yAxis = d3.axisLeft();
yAxis.scale(yAxisScale);
d3.select("#MyAxis")
	.attr("transform", "translate(" + 40 + "," + 0 +") scale(1,1)")
	.call(yAxis);			   
					
bars = svg.selectAll("rect").data(margin_actuals);
bars = bars.enter().append("rect").merge(bars);					
bars.attr("x", function(d,i){ return xScale(i*60); })
	.attr("y", function (d, i) { return 25; })
	.attr("transform", "translate(" + 50 + "," + 350 +") scale(1,-1)")
	.attr("width", function (d) { return xScale(50); })
	.attr("height", function(d){ return yScale(d); })
	.classed("bars", true)
	.append("svg:title")
    .text(function(d, i) { return "A: " + margin_actuals[i] + " %\nB: " + margin_budget[i] + " %"; });

budget = d3.select("#MBudgets").selectAll("rect").data(margin_budget);
budget = budget.enter().append("rect").merge(budget);					
budget.attr("x", function(d,i){ return xScale(i*60); })
	.attr("y", function (d) { return yScale(d); })
	.attr("transform", "translate(" + 50 + "," + 350 +") scale(1,-1)")
	.attr("width", function (d) { return xScale(50); })
	.attr("height", function(d){ return 10; })
	.style("fill", "#021618");	
	
month = d3.select("#MxAxis").selectAll("text").data(month_label);
month = month.enter().append("text").merge(month);					
month.attr("x", function(d,i){ return xScale(i*60);})
	.attr("y", function (d, i) { return 0; })
	.attr("transform", "translate(" + 50 + "," + 350 +") scale(1,1)")
	.attr("width", function (d) { return xScale(50); })
	.attr("height", function(d){ return 50; })
	.text(function(d){return d})
	.classed("label", true);
	
//Populate the table
var VH = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0]
];

d3.csv("Summary.csv", function (error, csvData) {   
	 var sum = 0;
     csvData.forEach(function (d, i) {
         VH[getIndex(d.Vertical)][getIndex(d.Horizontal)] += parseFloat(d.Revenue)/1000000;
     });	

	console.log(VH[0]);			
	
	d3.select("#BFS")
	.selectAll("td").data(VH[0])
	.enter().append("td")
	.text(function(d) { return '$ '+d.toFixed(2) + ' M'})
	.classed("value", true);
	
	d3.select("#Healthcare")
	.selectAll("td").data(VH[1])
	.enter().append("td")
	.text(function(d) { return '$ '+d.toFixed(2) + ' M'})
	.classed("value", true);
	
	d3.select("#Technology")
	.selectAll("td").data(VH[2])
	.enter().append("td")
	.text(function(d) { return '$ '+d.toFixed(2) + ' M'})
	.classed("value", true);
	
	d3.select("#Manlog")
	.selectAll("td").data(VH[3])
	.enter().append("td")
	.text(function(d) { return '$ '+d.toFixed(2) + ' M'})
	.classed("value", true);
	
	d3.select("#Retail")
	.selectAll("td").data(VH[4])
	.enter().append("td")
	.text(function(d) { return '$ '+d.toFixed(2) + ' M'})
	.classed("value", true);
	
	d3.select("#Others")
	.selectAll("td").data(VH[5])
	.enter().append("td")
	.text(function(d) { return '$ '+d.toFixed(2) + ' M'})
	.classed("value", true);
});	

function getIndex(s){
	if(s=="BFS") return 0;
	if(s=="Healthcare") return 1;
	if(s=="Technology") return 2;
	if(s=="Manlog") return 3;
	if(s=="Retail") return 4;
	if(s=="Others") return 5;
	
	if(s=="QA") return 0;
	if(s=="SAP") return 1;
	if(s=="HCM") return 2;
	if(s=="Analytics") return 3;
	if(s=="Cloud") return 4;
}