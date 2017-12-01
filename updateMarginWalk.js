function updateMarginWalk(data, prev, curr, vert, horiz, client, project){
	var last_margin = 0;
	var curr_margin = 0;
	
	var comp = 0;
	var subcon = 0;
	var travel = 0;
	var license = 0;
	var title = '';
	
	if(vert!='.*') title += (vert + ' ');
	if(horiz!='.*') title += (horiz + ' ');
	if(client!='.*') title += (client + ' ');
	if(project!='.*') title += project;
	
	var prevRev = 0;
	var currRev = 0;
	var table = [];
	temp = {'id': 'Revenue', 'prev':0, 'curr':0, 'diff':0, 'percent':0 }; table.push(temp);
	temp = {'id': 'Compensation', 'prev':0, 'curr':0, 'diff':0, 'percent':0}; table.push(temp);
	temp = {'id': 'Contractor', 'prev':0, 'curr':0, 'diff':0, 'percent':0}; table.push(temp);
	temp = {'id': 'License', 'prev':0, 'curr':0, 'diff':0, 'percent':0}; table.push(temp);
	temp = {'id': 'Travel', 'prev':0, 'curr':0, 'diff':0, 'percent':0}; table.push(temp);
	temp = {'id': 'Margin', 'prev':0, 'curr':0, 'diff':0, 'percent':0}; table.push(temp);
	
	d3.select('#MWDisplay').text(function(){ return title});
	data.forEach(function (d, i) {
		if(d.Month==curr && d.Vertical.match(vert) && d.Horizontal.match(horiz) && d.Client.match(client) && d["Project Id"].match(project)){
			table[0].curr += parseFloat(d.Revenue)/1000000;
			table[1].curr += parseFloat(d['Compensation'])/1000000;
			table[2].curr += parseFloat(d['Travel Expense'])/1000000;
			table[3].curr += parseFloat(d['Software Licenses'])/1000000;
			table[4].curr += parseFloat(d['Subcontracting Costs'])/1000000;
			table[5].curr += parseFloat(d['Margin'])/1000000;
		}
		if(d.Month==prev && d.Vertical.match(vert) && d.Horizontal.match(horiz) && d.Client.match(client) && d["Project Id"].match(project)){
			table[0].prev += parseFloat(d.Revenue)/1000000;
			table[1].prev += parseFloat(d['Compensation'])/1000000;
			table[2].prev += parseFloat(d['Travel Expense'])/1000000;
			table[3].prev += parseFloat(d['Software Licenses'])/1000000;
			table[4].prev += parseFloat(d['Subcontracting Costs'])/1000000;
			table[5].prev += parseFloat(d['Margin'])/1000000;
		}
    });
	
	var prevMargin = table[5].prev;
	var prevPercent = prevMargin/table[0].prev;
	var cumdiff = 0;
	
	//Update the snapshot financials
	updateSnapshot(table);
	
	//Compute the percentage difference
	for(var i=0; i<6; i++){
		table[i].diff = table[i].curr - table[i].prev;
		if(i>0) table[i].diff = table[i].diff * -1;
		
		cumdiff += table[i].diff;
		table[i].percent = (prevMargin + cumdiff)/table[0].curr;
		table[i].diff = (table[i].percent - prevPercent)*100;
		prevPercent = table[i].percent;
	}
	
	//Create the array for values
	var values = [];
	var temp = {'id': prev, 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'Revenue', 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'Salary', 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'Subcon', 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'Travel', 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'License', 'start':0, 'val':0}; values.push(temp);
	temp = {'id': curr, 'start':0, 'val':0}; values.push(temp);
	
	values[0].start = 0; values[0].val = 100*table[5].prev/table[0].prev;
	values[6].start = 0; values[6].val = 100*table[5].curr/table[0].curr;	
	
	for(var i=1; i<6; i++){
		values[i].val = table[i-1].diff;
	}
	
	//Sort the values
	var min;
	for(var i=1; i<6; i++){
		min = i;
		for(var j=i; j<6; j++){
			if(values[min].val > values[j].val)
				min = j;
		}
		
		var temp = values[min];
		values[min] = values[i];
		values[i] = temp;
	}
	
	//Set start values
	if(values[1].val < 0) values[1].start = values[0].val+values[1].val;
	else values[1].start = values[0].val;
	
	if(values[0].val < 0) values[0].start = values[0].val;
	if(values[6].val < 0) values[6].start = values[6].val;
	
	for(var i=2; i<6; i++){
		if(values[i-1].val>0 && values[i].val>0) values[i].start = (values[i-1].start + values[i-1].val);
		else if(values[i-1].val<0 && values[i].val<0) values[i].start = (values[i-1].start + values[i].val);
		else values[i].start = values[i-1].start;
	}
	
	var lowest = values[0].start, highest = Math.abs(values[0].val);
	for(var i=1; i<=6; i++){
		if(lowest > values[i].start) lowest = values[i].start;
		if(highest < values[i].val) highest = values[i].val;
	}
	
	console.log(values);
	console.log(lowest);
	console.log(highest);
	var range = highest - lowest;
	
	//Draw the chart
	var ymax = 250;
	var xmax = 200;
	
	var xScale = d3.scaleLinear().domain([0, 420]).range([0, xmax-5]);
	var yScale = d3.scaleLinear().domain([lowest, highest]).range([1, 120]);
	var hScale = d3.scaleLinear().domain([0, range]).range([1,120]);
	
	var revwalk = d3.select('#MarginWalk');
	revwalk = revwalk.selectAll('rect').data(values);
	revwalk = revwalk.enter().append('rect').merge(revwalk);		
	
	revwalk.attr('x', function(d,i){ return xScale(i*60); })
		.attr('y', function (d, i) { return yScale(d.start); })
		.attr('transform', 'translate(' + 5 + ',' + (ymax-50) +') scale(1,-1)')
		.attr('width', function (d) { return xScale(50); })
		.attr('height', function(d){ return hScale(Math.abs(d.val)); })
		.classed('bars', true);
	
	revwalk.classed('incr', false);
	revwalk.classed('drop', false);
	revwalk.filter(function(d,i){ return i>0&&i<6}).classed('incr', true);
	revwalk.filter(function(d){ return d.val<0}).classed('drop', true);	
	
	revwalk = d3.select('#MarginWalkId').selectAll('text').data(values);
	revwalk = revwalk.enter().append('text').merge(revwalk);					
	revwalk.text(function(d){ return d.id})
		.attr('transform', function(d,i){ return 'translate(' + (xScale(i*60)+20) + ',' + (ymax-45) +')' + ' rotate(-60)'})
		.classed('label', true)
		.attr('text-anchor','end');
		
	revwalk = d3.select('#MarginWalkLabel').selectAll('text').data(values);
	revwalk = revwalk.enter().append('text').merge(revwalk);					
	revwalk.attr('transform', function(d,i){ 
				var t = (ymax-50-10)-yScale(d.start+Math.abs(d.val));
				return 'translate(' + (xScale(i*60)+5) + ',' + t +')';
			})
		   .text(function(d){ return d.val.toFixed(1)+'%';})
		   .classed('label', true);
}
