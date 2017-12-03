function updatePPMWalk(data, prev, curr, vert, horiz, client, project){
	var table = [];
	
	temp = {'id':'Anlst', 'prev_off':0, 'curr_off':0, 'prev_on':0, 'curr_on':0, 'on_diff':0, 'off_diff':0}; table.push(temp);
	temp = {'id':'Assoc', 'prev_off':0, 'curr_off':0, 'prev_on':0, 'curr_on':0, 'on_diff':0, 'off_diff':0}; table.push(temp);
	temp = {'id':'Sr Assoc', 'prev_off':0, 'curr_off':0, 'prev_on':0, 'curr_on':0, 'on_diff':0, 'off_diff':0}; table.push(temp);
	temp = {'id':'Manager', 'prev_off':0, 'curr_off':0, 'prev_on':0, 'curr_on':0, 'on_diff':0, 'off_diff':0}; table.push(temp);
	temp = {'id':'Sr Mgr', 'prev_off':0, 'curr_off':0, 'prev_on':0, 'curr_on':0, 'on_diff':0, 'off_diff':0}; table.push(temp);
	temp = {'id':'Director', 'prev_off':0, 'curr_off':0, 'prev_on':0, 'curr_on':0, 'on_diff':0, 'off_diff':0}; table.push(temp);
	temp = {'id':'Subcon', 'prev_off':0, 'curr_off':0, 'prev_on':0, 'curr_on':0, 'on_diff':0, 'off_diff':0}; table.push(temp);
	
	data.forEach(function (d, i) {
		if(d.Month==curr && d.Vertical.match(vert) && d.Horizontal.match(horiz) && d.Client.match(client) && d['Project Id'].match(project)){
			if(d['Onsite/Offshore']=='Onsite') table[getGrade(d.Grade)].curr_on += parseInt(d.Count);
			else table[getGrade(d.Grade)].curr_off += parseInt(d.Count);
		}
		if(d.Month==prev && d.Vertical.match(vert) && d.Horizontal.match(horiz) && d.Client.match(client) && d['Project Id'].match(project)){
			if(d['Onsite/Offshore']=='Onsite') table[getGrade(d.Grade)].prev_on += parseInt(d.Count);
			else table[getGrade(d.Grade)].prev_off += parseInt(d.Count);
		}
    });
	
	var min, max;
	for(var i=0; i<7; i++){
		table[i].on_diff = table[i].curr_on - table[i].prev_on;
		table[i].off_diff = table[i].curr_off - table[i].prev_off;
	}
	console.log(table);
	
	//Plot onsite variation
	min = Number.MAX_VALUE;
	max = Number.MIN_VALUE;
	for(var i=0; i<7; i++){
		if(min > table[i].on_diff) min = table[i].on_diff;
		if(max < table[i].on_diff) max = table[i].on_diff;
	}
	
	//Draw the chart
	var ymax = 300;
	var xmax = 300;
	
	//Set yScale
	var range;
	if(min < 0) range = max - min;
	else range = max;
	
	console.log(min, max, range);
	
	var xScale = d3.scaleLinear().domain([0, 420]).range([0, xmax-5]);
	var yScale = d3.scaleLinear().domain([min, max]).range([1,55]);
	var hScale = d3.scaleLinear().domain([0, range]).range([1,55]);
	
	var pplwalk = d3.select('#onsite');
	pplwalk = pplwalk.selectAll('rect').data(table);
	pplwalk = pplwalk.enter().append('rect').merge(pplwalk);		
	
	pplwalk.attr('x', function(d,i){ return xScale(i*60); })
		.attr('y', function (d, i) { if(d.on_diff>0) return yScale(0); return yScale(d.on_diff);})
		.attr('transform', 'translate(' + 5 + ',' + 110 +') scale(1,-1)')
		.attr('width', function (d) { return xScale(50); })
		.attr('height', function(d){ return hScale(Math.abs(d.on_diff)); })
		.classed('bars', true);
	
	pplwalk.classed('incr', false);
	pplwalk.classed('drop', false);
	pplwalk.classed('incr', true);
	pplwalk.filter(function(d){ return d.on_diff<0}).classed('drop', true);	
	
	pplwalk = d3.select('#PplWalkLabel').selectAll('text').data(table);
	pplwalk = pplwalk.enter().append('text').merge(pplwalk);					
	pplwalk.text(function(d){ return d.on_diff})
		.attr('transform', function(d,i){ 
			var t = 106-yScale(d.on_diff);
			if(d.on_diff<0) t = 106 - yScale(0);
			
			return 'translate(' + (xScale(i*60)+30) + ',' + t +')'})
		.classed('label2', true)
		.attr('text-anchor','end');
		
	//Offshore Chart	
	min = Number.MAX_VALUE;
	max = Number.MIN_VALUE;
	for(var i=0; i<7; i++){
		if(min > table[i].off_diff) min = table[i].off_diff;
		if(max < table[i].off_diff) max = table[i].off_diff;
	}
	
	//Draw the chart
	ymax = 280;
	xmax = 300;
	
	//Set yScale
	var range;
	if(min < 0) range = max - min;
	else range = max;
	
	console.log(table);
	console.log(min, max, range);
	
	xScale = d3.scaleLinear().domain([0, 420]).range([0, xmax-5]);
	yScale = d3.scaleLinear().domain([min, max]).range([1,55]);
	hScale = d3.scaleLinear().domain([0, range]).range([1,55]);
	
	pplwalk = d3.select('#offshore');
	pplwalk = pplwalk.selectAll('rect').data(table);
	pplwalk = pplwalk.enter().append('rect').merge(pplwalk);		
	
	pplwalk.attr('x', function(d,i){ return xScale(i*60); })
		.attr('y', function (d, i) { if(d.off_diff>0) return yScale(0); return yScale(d.off_diff);})
		.attr('transform', 'translate(' + 5 + ',' + 210 +') scale(1,-1)')
		.attr('width', function (d) { return xScale(50); })
		.attr('height', function(d){ return hScale(Math.abs(d.off_diff)); })
		.classed('bars', true);
	
	pplwalk.classed('incr', false);
	pplwalk.classed('drop', false);
	pplwalk.classed('incr', true);
	pplwalk.filter(function(d){ return d.off_diff<0}).classed('drop', true);

	pplwalk = d3.select('#offlabel').selectAll('text').data(table);
	pplwalk = pplwalk.enter().append('text').merge(pplwalk);					
	pplwalk.text(function(d){ return d.off_diff})
		.attr('transform', function(d,i){ 
			var t = 205-yScale(d.off_diff);
			if(d.off_diff<0) t = 205 - yScale(0);
			console.log('Hi');
			return 'translate(' + (xScale(i*60)+30) + ',' + t +')'})
		.classed('label2', true)
		.attr('text-anchor','end');	
	
	//ASSIGN THE LABEL
	revwalk = d3.select('#PplWalkId').selectAll('text').data(table);
	revwalk = revwalk.enter().append('text').merge(revwalk);					
	revwalk.text(function(d){ return d.id})
		.attr('transform', function(d,i){ return 'translate(' + (xScale(i*60)+25) + ',' + (ymax-45) +')' + ' rotate(-60)'})
		.classed('label2', true)
		.attr('text-anchor','end');
}

function getGrade(grade){
	if(grade=='Analyst') return 0;
	if(grade=='Associate') return 1;
	if(grade=='Senior Associate') return 2;
	if(grade=='Manager') return 3;
	if(grade=='Senior Manager') return 4;
	if(grade=='Director') return 5;
	if(grade=='Contractor') return 6;
}