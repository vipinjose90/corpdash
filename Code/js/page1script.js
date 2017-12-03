//Set the month circles

var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
d3.select('#Month').selectAll('circle').data(month).enter().append('circle')
	.attr('cx', function(d,i){return i*90+10;})
	.attr('cy', function(d) {return 15})
	.attr('r', 7)
	.classed('normal', 'true')
	.on('click', function(d,i){ d3.select('#Month').selectAll('circle').classed('selected', false);
							 d3.select('#snapshot').selectAll('circle').classed('selected2', false);
							 d3.select(this).classed('selected', true);
							 setMonth(i);});

d3.select('#Month').selectAll('text').data(month).enter().append('text')
	.attr('x', function(d,i){return i*90;})
	.attr('y', function(d) {return 40})
	.text(function(d){return d})
	.classed('label2', true);
	
var data = [];
var associate_data = [];
var prev = 'Jan';
var curr = 'Feb';

d3.csv("Code/data/Associate.csv", function (error, csvData) {
	 setAssociateData(csvData);
});

d3.csv("Code/data/Summary.csv", function (error, csvData) {
	 setData(csvData);
});


function setMonth(i){
	var prev, curr;
	var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	if(i==0){
		prev = month[0];
		curr = month[1];
	}
	else{ 
		prev = month[i-1];
		curr = month[i];
	}
	
	this.prev = prev;
	this.curr = curr;
	
	document.getElementById('#Prev').innerHTML = prev;
	document.getElementById('#Curr').innerHTML = curr;

	console.log(prev, curr);
	updateTable(this.data, prev, curr);
	update(9,9);
}

function setData(value){
	this.data = value;
	updateTable(this.data, this.prev, this.curr);
	updateWalks(this.data, this.prev, this.curr, ".*", ".*", ".*", ".*");
    createProjectLevelView(this.prev,this.curr,'all','all');
}

function setAssociateData(value){
	this.associate_data = value;
	updatePPMWalk(this.associate_data, this.prev, this.curr, '.*', '.*', '.*', '.*');
}

function updateTable(data, prev, curr){
	console.log(data[0], prev, curr);
	//Populate the table
	var VH = [[0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0]];
	var VH_Margin = [[0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0]];
	var VH_prev = [[0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0]];
	var VH_prevMargin = [[0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0]];
	var t;
	
	data.forEach(function (d, i) {
		if(d.Month==curr){	
			t = parseFloat(d.Revenue)/1000000;
			VH[getIndex(d.Vertical)][getIndex(d.Horizontal)] += t;
			VH[getIndex(d.Vertical)][5] += t;
			VH[6][getIndex(d.Horizontal)] += t;
			VH[6][5] += t;
			
			t = parseFloat(d.Margin)/1000000;
			VH_Margin[getIndex(d.Vertical)][getIndex(d.Horizontal)] += t;
			VH_Margin[getIndex(d.Vertical)][5] += t;
			VH_Margin[6][getIndex(d.Horizontal)] += t;
			VH_Margin[6][5] += t;
		}
		
		if(d.Month==prev){	
			t = parseFloat(d.Revenue)/1000000;
			//console.log(d);
			VH_prev[getIndex(d.Vertical)][getIndex(d.Horizontal)] += t;
			VH_prev[getIndex(d.Vertical)][5] += t;
			VH_prev[6][getIndex(d.Horizontal)] += t;
			VH_prev[6][5] += t;
			
			t = parseFloat(d.Margin)/1000000;
			VH_prevMargin[getIndex(d.Vertical)][getIndex(d.Horizontal)] += t;
			VH_prevMargin[getIndex(d.Vertical)][5] += t;
			VH_prevMargin[6][getIndex(d.Horizontal)] += t;
			VH_prevMargin[6][5] += t;
		}
     });

	 console.log(VH);
	 console.log(VH_Margin);
	 
	 var tableValues = [];
	 var circledata = [];
	 var max = -1;
	 var prevRev, currRev, prevMargin, currMargin;
	 
	 for(var i=0; i<7; i++){
		 var temp = [];
		 for(var j=0; j<6; j++){
			 var duplex = {'Revenue':0, 'Margin':0, 'color':0, 'x':i, 'y':j};
			 currRev = VH[i][j];
			 duplex.Revenue = currRev;
			 
			 currMargin = VH_Margin[i][j]/VH[i][j]*100;
			 duplex.Margin = currMargin;
			 
			 prevRev = VH_prev[i][j];
			 prevMargin = VH_prevMargin[i][j]/VH_prev[i][j]*100;
			 
			 if(currRev > prevRev) duplex.color += 2;
			 if(currMargin > prevMargin) duplex.color += 1;
			 
			 temp.push(duplex);
			 if(i!=6 && j!=5){
				circledata.push(duplex); 
				max = Math.max(max, currRev);
			 } 
		 }
		 
		 tableValues.push(temp);
	 }
	
	var Maindata = this.data;
	var vertical;
	
	console.log(tableValues);
	
	var radScale = d3.scaleLinear().domain([0, max]).range([4, 10]);
	var xScale = d3.scaleLinear().domain([0, 5]).range([80, 470]);
	var yScale = d3.scaleLinear().domain([0, 4]).range([80, 270]);	
	
	//Plot the circles
	var plot = d3.select('#snapshot');
	plot = plot.selectAll('circle').data(circledata);
	plot = plot.enter().append('circle').merge(plot);		
	
	plot.attr('cx', function(d,i){ return xScale(d.x); })
		.attr('cy', function (d, i) { return yScale(d.y); })
		.attr('r', function (d) { return radScale(d.Revenue) })
		.on('click', function(d) {
			update(d.x,d.y);
			d3.select('#snapshot').selectAll('circle').classed('selected2', false);
			d3.select(this).classed('selected2', true);
		 });
	
	plot.classed('type1', false);
	plot.classed('type2', false);
	plot.classed('type3', false);
	plot.classed('type4', false);
	
	plot.filter(function(d){return d.color==0}).classed('type1', true);
	plot.filter(function(d){return d.color==1}).classed('type2', true);
	plot.filter(function(d){return d.color==2}).classed('type3', true);
	plot.filter(function(d){return d.color==3}).classed('type4', true);	
	
	//Draw the vertical bars
	var vertData = [];
	var vert = ['Banking', 'HealthCare', 'Technology', 'Manlog', 'Retail', 'Others'];
	max = -1;
	for(var i=0; i<6; i++){
		vertData.push(tableValues[i][5]);
		max = Math.max(max, tableValues[i][5].Revenue);	
	}	
	
	plot = d3.select('#vertbars');
	plot = plot.selectAll('rect').data(vertData);
	plot = plot.enter().append('rect').merge(plot);	
	var widthScale = d3.scaleLinear().domain([0, max]).range([1, 8]);		
	
	plot.attr('x', function(d,i){ return xScale(i)-widthScale(d.Revenue)/2; })
		.attr('y', function (d, i) { return 80; })
		.attr('width', function (d) { return widthScale(d.Revenue) })
		.attr('height', function(d) {return 190})
		.on('click', function(d,i){update(i,'*')});	
	
	plot.classed('bar1', false);
	plot.classed('bar2', false);
	plot.classed('bar3', false);
	plot.classed('bar4', false);
	
	plot.filter(function(d){return d.color==0}).classed('bar1', true);
	plot.filter(function(d){return d.color==1}).classed('bar2', true);
	plot.filter(function(d){return d.color==2}).classed('bar3', true);
	plot.filter(function(d){return d.color==3}).classed('bar4', true);
		
	plot = d3.select('#vertbars');
	plot = plot.selectAll('text').data(vert);
	plot = plot.enter().append('text').merge(plot);
	
	plot.attr('transform', function(d,i) {return 'translate(' + xScale(i) + ',' + 60 + ') rotate(-30)'})
		.text(function(d){return d})
		.classed('label2', true)
		.on('click', function(d,i){update(i,'*')});
		
	//Draw the horizontal bars
	var horzData = [];
	var horz = ['QA', 'SAP', 'HCM', 'Analytics', 'Cloud'];
	
	max = -1;
	for(var i=0; i<5; i++){
		horzData.push(tableValues[6][i]);
		max = Math.max(max, tableValues[6][i].Revenue);	
	}	
	
	plot = d3.select('#horzbars');
	plot = plot.selectAll('rect').data(horzData);
	plot = plot.enter().append('rect').merge(plot);	
	var widthScale = d3.scaleLinear().domain([0, max]).range([1, 8]);		
	
	plot.attr('x', function(d,i){ return 80 })
		.attr('y', function (d, i) { return yScale(i)-widthScale(d.Revenue)/2; })
		.attr('width', function (d) { return 390 })
		.attr('height', function(d) {return widthScale(d.Revenue)})
		.on('click', function(d,i){update('*',i)});		
	
	plot.classed('bar1', false);
	plot.classed('bar2', false);
	plot.classed('bar3', false);
	plot.classed('bar4', false);
	
	plot.filter(function(d){return d.color==0}).classed('bar1', true);
	plot.filter(function(d){return d.color==1}).classed('bar2', true);
	plot.filter(function(d){return d.color==2}).classed('bar3', true);
	plot.filter(function(d){return d.color==3}).classed('bar4', true);
	
	plot = d3.select('#horzbars');
	plot = plot.selectAll('text').data(horz);
	plot = plot.enter().append('text').merge(plot);
	
	plot.attr('transform', function(d,i) {return 'translate(' + 5 + ',' + (yScale(i)+5) + ')'})
		.text(function(d){return d})
		.classed('label2', true)
		.on('click', function(d,i){update('*',i)});
}

function update(vert, horiz){	
	
	if(vert==0) vert = 'BFS';
	else if(vert==1) vert = 'Healthcare';
	else if(vert==2) vert = 'Technology';
	else if(vert==3) vert = 'Manlog';
	else if(vert==4) vert = 'Retail';
	else if(vert==5) vert = 'Others';
	else vert = '.*';
	
	if(horiz==0) horiz = 'QA';
	else if(horiz==1) horiz = 'SAP';
	else if(horiz==2) horiz = 'HCM';
	else if(horiz==3) horiz = 'Analytics';
	else if(horiz==4) horiz = 'Cloud';
	else horiz = '.*';
	
	prev = this.prev;
	curr = this.curr;
	
	console.log(vert, horiz);
	d3.select('#snapshot').selectAll('circle').classed('selected2', false);
	updateRevWalk(this.data, prev, curr, vert, horiz, '.*', '.*');
	updateMarginWalk(this.data, prev, curr, vert, horiz, '.*', '.*');
	updatePPMWalk(this.associate_data, prev, curr, vert, horiz, '.*', '.*');

	if(vert=='.*') vert = 'all';
	if(horiz=='.*') horiz = 'all';
    createProjectLevelView(this.prev,this.curr,vert,horiz);
}

function updateWalks(data, prev, curr, vert, horiz, client, project){
	associate_data = this.associate_data;
	
	if(horiz==0) horiz = 'QA';
	else if(horiz==1) horiz = 'SAP';
	else if(horiz==2) horiz = 'HCM';
	else if(horiz==3) horiz = 'Analytics';
	else if(horiz==4) horiz = 'Cloud';
	else horiz = '.*';
	
	prev = this.prev;
	curr = this.curr;
	
	updateRevWalk(data, prev, curr, vert, horiz, client, project);
	updateMarginWalk(data, prev, curr, vert, horiz, client, project);
	updatePPMWalk(associate_data, prev, curr, vert, horiz, client, project);
}

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