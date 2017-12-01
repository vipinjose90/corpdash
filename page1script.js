//Set the month circles
var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
d3.select('#Month').selectAll('circle').data(month).enter().append('circle')
	.attr('cx', function(d,i){return i*90+10;})
	.attr('cy', function(d) {return 15})
	.attr('r', 7)
	.classed('normal', 'true')
	.on('click', function(){ d3.select('#Month').selectAll('circle').classed('selected', false);
							 d3.select(this).classed('selected', true); });

d3.select('#Month').selectAll('text').data(month).enter().append('text')
	.attr('x', function(d,i){return i*90;})
	.attr('y', function(d) {return 40})
	.text(function(d){return d})
	.classed('label2', true);
	
var data = [];
var associate_data = [];

d3.csv("Associate.csv", function (error, csvData) {   
	 setAssociateData(csvData);
});

d3.csv("Summary.csv", function (error, csvData) {   
	 setData(csvData);
});

function setData(value){
	this.data = value;
	updateTable(this.data, 'Jan', 'Feb');
	updateWalks(this.data, "Jan", "Feb", ".*", ".*", ".*", ".*");
}

function setAssociateData(value){
	this.associate_data = value;
}

function updateTable(data, prev, curr){
	console.log(data[0]);
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

	 var tableValues = [];
	 var prevRev, currRev, prevMargin, currMargin;
	 
	 for(var i=0; i<7; i++){
		 var temp = [];
		 for(var j=0; j<6; j++){
			 var duplex = {'revenue':0, 'margin':0, 'color':0};
			 currRev = VH[i][j];
			 duplex.Revenue = currRev;
			 
			 currMargin = VH_Margin[i][j]/VH[i][j]*100;
			 duplex.Margin = currMargin;
			 
			 prevRev = VH_prev[i][j];
			 prevMargin = VH_prevMargin[i][j]/VH_prev[i][j]*100;
			 
			 if(currRev > prevRev) duplex.color += 2;
			 if(currMargin > prevMargin) duplex.color += 1;
			 
			 temp.push(duplex);
		 }
		 
		 tableValues.push(temp);
	 }

	var Maindata = this.data;
	var currMonth, prevMonth;
	var vertical;
	
	currMonth = 'Feb';
	prevMonth = 'Jan';
	
	//Horizontal
	d3.select('#Horizontal').selectAll('th')
	  .on('click', function(d,i) {updateWalks(Maindata, prevMonth, currMonth, '.*', i-1, '.*', '.*');});
		
	//BFS
	vertical = d3.select('#BFS');
	vertical.select('th').on('click', function() {updateWalks(Maindata, prevMonth, currMonth, 'BFS', '.*', '.*', '.*')});
	vertical.selectAll("td").data(tableValues[0])
			.enter().append('td')
			.text(function(d) { return '$'+d.Revenue.toFixed(2)+'\xa0\xa0\xa0'+d.Margin.toFixed(1)+'%'})
			.on('click', function(d,i){ updateWalks(Maindata, prevMonth, currMonth, 'BFS', i, '.*', '.*'); });
		
	//Healthcare	
	vertical = d3.select('#Healthcare');
	vertical.select('th').on('click', function() {updateWalks(Maindata, prevMonth, currMonth, 'Healthcare', '.*', '.*', '.*')});
	vertical.selectAll("td").data(tableValues[1])
			.enter().append('td')
			.text(function(d) { return '$'+d.Revenue.toFixed(2)+'\xa0\xa0\xa0'+d.Margin.toFixed(1)+'%'})
			.on('click', function(d,i){ updateWalks(Maindata, prevMonth, currMonth, 'Healthcare', i, '.*', '.*'); });
			
	//Technology	
	vertical = d3.select('#Technology');
	vertical.select('th').on('click', function() {updateWalks(Maindata, prevMonth, currMonth, 'Technology', '.*', '.*', '.*')});
	vertical.selectAll("td").data(tableValues[2])
			.enter().append('td')
			.text(function(d) { return '$'+d.Revenue.toFixed(2)+'\xa0\xa0\xa0'+d.Margin.toFixed(1)+'%'})
			.on('click', function(d,i){ updateWalks(Maindata, prevMonth, currMonth, 'Technology', i, '.*', '.*'); });
	
	//Manlog	
	vertical = d3.select('#Manlog');
	vertical.select('th').on('click', function() {updateWalks(Maindata, prevMonth, currMonth, 'Manlog', '.*', '.*', '.*')});
	vertical.selectAll("td").data(tableValues[3])
			.enter().append('td')
			.text(function(d) { return '$'+d.Revenue.toFixed(2)+'\xa0\xa0\xa0'+d.Margin.toFixed(1)+'%'})
			.on('click', function(d,i){ updateWalks(Maindata, prevMonth, currMonth, 'Manlog', i, '.*', '.*'); });
	
	//Retail	
	vertical = d3.select('#Retail');
	vertical.select('th').on('click', function() {updateWalks(Maindata, prevMonth, currMonth, 'Retail', '.*', '.*', '.*')});
	vertical.selectAll("td").data(tableValues[4])
			.enter().append('td')
			.text(function(d) { return '$'+d.Revenue.toFixed(2)+'\xa0\xa0\xa0'+d.Margin.toFixed(1)+'%'})
			.on('click', function(d,i){ updateWalks(Maindata, prevMonth, currMonth, 'Retail', i, '.*', '.*'); });
			
	//Others	
	vertical = d3.select('#Others');
	vertical.select('th').on('click', function() {updateWalks(Maindata, prevMonth, currMonth, 'Others', '.*', '.*', '.*')});
	vertical.selectAll("td").data(tableValues[5])
			.enter().append('td')
			.text(function(d) { return '$'+d.Revenue.toFixed(2)+'\xa0\xa0\xa0'+d.Margin.toFixed(1)+'%'})
			.on('click', function(d,i){ updateWalks(Maindata, prevMonth, currMonth, 'Others', i, '.*', '.*'); });
			
	//Total	
	vertical = d3.select('#Total');
	vertical.select('th').on('click', function(d,i) {updateWalks(Maindata, prevMonth, currMonth, '.*', '.*', '.*', '.*')});
	vertical.selectAll('td').data(tableValues[6])
			.enter().append('td')
			.text(function(d) { return '$'+d.Revenue.toFixed(2)+'\xa0\xa0\xa0'+d.Margin.toFixed(1)+'%'})
			.on('click', function(d,i){ updateWalks(Maindata, prevMonth, currMonth, '.*', i, '.*', '.*'); });	

	d3.select('#summary').selectAll('td').filter(function(d) {return d.color==0}).classed('type1', true);			
	d3.select('#summary').selectAll('td').filter(function(d) {return d.color==1}).classed('type2', true);			
	d3.select('#summary').selectAll('td').filter(function(d) {return d.color==2}).classed('type3', true);			
	d3.select('#summary').selectAll('td').filter(function(d) {return d.color==3}).classed('type4', true);			
}

function updateWalks(data, prev, curr, vert, horiz, client, project){
	associate_data = this.associate_data;
	
	if(horiz==0) horiz = 'QA';
	else if(horiz==1) horiz = 'SAP';
	else if(horiz==2) horiz = 'HCM';
	else if(horiz==3) horiz = 'Analytics';
	else if(horiz==4) horiz = 'Cloud';
	else horiz = '.*';
	
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