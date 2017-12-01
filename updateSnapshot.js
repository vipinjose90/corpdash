function updateSnapshot(table){
	var data, row;
	var rowNames = ['#Revenue', '#Salary', '#Contractors', '#Licenses', '#Travel', '#Margin'];
	
	for(var i=0; i<5; i++){
		data = [table[i].prev, table[i].curr, (table[i].curr - table[i].prev), (table[i].curr - table[i].prev)/table[i].prev*100];
		row = d3.select(rowNames[i]);
		row = row.selectAll('td').data(data);
		row = row.enter().append('td').merge(row);
		
		row.text(function(d, i) { if(i==3) return (d.toFixed(1)+'%'); return d.toFixed(2)});
		row.style('text-align', 'right');
	}
	
	var prev = table[5].prev/table[0].prev*100;
	var curr = table[5].curr/table[0].curr*100;
	
	data = [prev, curr, curr-prev, (curr-prev)];
	row = d3.select(rowNames[i]);
	row = row.selectAll('td').data(data);
	row = row.enter().append('td').merge(row);
		
	row.text(function(d, i) { return (d.toFixed(1)+'%');});
	row.style('text-align', 'right');
}