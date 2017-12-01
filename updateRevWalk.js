function updateRevWalk(data, prev, curr, vert, horiz, client, project){
	var last_rev = 0;
	var curr_rev = 0;
	
	var tutd = 0;
	var billdays = 0;
	var adj = 0;
	var title = '';
	
	var values = [];
	var temp = {'id': prev, 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'TUTD', 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'Billdays', 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'One-time', 'start':0, 'val':0}; values.push(temp);
	temp = {'id':'Balance', 'start':0, 'val':0}; values.push(temp);
	temp = {'id': curr, 'start':0, 'val':0}; values.push(temp);
	
	if(vert!='.*') title += (vert + ' ');
	if(horiz!='.*') title += (horiz + ' ');
	if(client!='.*') title += (client + ' ');
	if(project!='.*') title += project;
	
	console.log(title);
	d3.select('#RWDisplay').text(function(){ return title});
		
	data.forEach(function (d, i) {
		if(d.Vertical.match(vert) && d.Horizontal.match(horiz) && d.Client.match(client) && d['Project Id'].match(project)){
			if(d.Month==curr){
				values[5].val += parseFloat(d.Revenue)/1000000;
				if(d.Comment=='TUTD') values[1].val += parseFloat(d.Revenue)/1000000;
				if(d.Comment=='Adjustments') values[3].val += parseFloat(d.Revenue)/1000000;
				if(d.Comment=='Billdays') values[2].val += parseFloat(d.Revenue)/1000000;
			}
			if(d.Month==prev) values[0].val += parseFloat(d.Revenue)/1000000;
		}
    });
	
	values[4].val = values[5].val - (values[0].val + values[1].val + values[2].val + values[3].val);
	var min;
	
	//Sort the values
	for(var i=1; i<5; i++){
		min = i;
		for(var j=i; j<5; j++){
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
	
	for(var i=2; i<5; i++){
		if(values[i-1].val>0 && values[i].val>0) values[i].start = Math.abs(values[i-1].start + values[i-1].val);
		if(values[i-1].val<0 && values[i].val<0) values[i].start = Math.abs(values[i-1].start + values[i].val);
		else values[i].start = values[i-1].start;
	}
	
	var max = (values[0].val>values[5].val)? values[0].val : values[5].val;
	var ymax = 250;
	var xmax = 200;
	
	var xScale = d3.scaleLinear().domain([0, 360]).range([0, xmax-5]);
	var yScale = d3.scaleLinear().domain([0, max]).range([1, 120]);
	
	var revwalk = d3.select('#RevWalk');
	revwalk = revwalk.selectAll('rect').data(values);
	revwalk = revwalk.enter().append('rect').merge(revwalk);		
	
	revwalk.attr('x', function(d,i){ return xScale(i*60); })
		.attr('y', function (d, i) { return yScale(d.start); })
		.attr('transform', 'translate(' + 5 + ',' + (ymax-50) +') scale(1,-1)')
		.attr('width', function (d) { return xScale(50); })
		.attr('height', function(d){ return yScale(Math.abs(d.val)); })
		.classed('bars', true);
	
	revwalk.filter(function(d,i){ return i>0&&i<5}).classed('incr', true);
	revwalk.filter(function(d){ return d.val<0}).classed('drop', true);	
	
	revwalk = d3.select('#RevWalkId').selectAll('text').data(values);
	revwalk = revwalk.enter().append('text').merge(revwalk);					
	revwalk.text(function(d){ return d.id})
		.attr('transform', function(d,i){ return 'translate(' + (xScale(i*60)+20) + ',' + (ymax-45) +')' + ' rotate(-60)'})
		.classed('label', true)
		.attr('text-anchor','end');
		
	revwalk = d3.select('#RevWalkLabel').selectAll('text').data(values);
	revwalk = revwalk.enter().append('text').merge(revwalk);					
	revwalk.attr('transform', function(d,i){ 
				var t = (ymax-50-10)-yScale(d.start+Math.abs(d.val));
				return 'translate(' + (xScale(i*60)+5) + ',' + t +')';
			})
		   .text(function(d){ return d.val.toFixed(2);})
		   .classed('label', true);
}
