/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(monthData) {

        this.tableElements = monthData.slice(); //

        this.teamData = monthData;


        this.cell = {
            "width": 500,
            "height": 500,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

    }


    createTable() {


        let thisClass = this
        thisClass.updateTable();

        d3.select("thead")
            .selectAll("td,th")
            .on("click", function() {
                thisClass.collapseList();
                let firstMonth = d3.select(this).classed("firstMonth")
                let secondMonth = d3.select(this).classed("secondMonth")
                let descSort = d3.select(this).classed("descending");

                let sortOn = d3.select(this).text();

                thisClass.tableElements.sort(function(m, n) {
                    let sign;

                    if (sortOn.substr(0,9) == "Revenue %") {
                        console.log(sortOn)
                        sign = (((n.value.Revenue[1].value -n.value.Revenue[0].value)/n.value.Revenue[0].value)  - ((m.value.Revenue[1].value -m.value.Revenue[0].value)/m.value.Revenue[0].value));
                    }
                    else if (sortOn.substr(0,8) == "Margin %") {
                        console.log(sortOn)
                        sign = (((n.value.Margin[1].value -n.value.Margin[0].value)/n.value.Margin[0].value)  - ((m.value.Margin[1].value -m.value.Margin[0].value)/m.value.Margin[0].value));
                    }
                    else if (sortOn.substr(0,6) == "Margin" && firstMonth) {
                        sign = (n.value.Margin[0].value - m.value.Margin[0].value);
                    } else if (sortOn.substr(0,7) == "Revenue" && firstMonth)  {
                        sign = (n.value.Revenue[0].value - m.value.Revenue[0].value);
                    } else if (sortOn.substr(0,6)=="Margin" && secondMonth) {
                        sign = (n.value.Margin[1].value - m.value.Margin[1].value);
                    } else if (sortOn.substr(0,7) == "Revenue" && secondMonth) {
                        sign = (n.value.Revenue[1].value - m.value.Revenue[1].value);
                    }

                     else if (firstMonth) {
                        sign = (n.value.Revenue[0].value - m.value.Revenue[0].value);
                    }
                    else if (secondMonth) {
                        sign = (n.value.Revenue[1].value - m.value.Revenue[1].value);
                    }
                    else if (sortOn.substr(0,14) == "Client/Project") {
                        if (descSort == true) {
                            if (n.key <= m.key)
                            {
                                return -1 ;
                            }
                            else
                            {
                                return 1;
                            }
                        }
                        else {
                            if (m.key <= n.key) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                        }
                    }


                    if (!descSort)
                        return sign;
                    else
                        return (sign * -1);

                });

                d3.select(this).classed("descending",!descSort);

                thisClass.updateTable();
            })}

    updateTable() {

        let months = [this.tableElements[0].value.Margin[0].key,this.tableElements[0].value.Margin[1].key]

        let currentmonths = d3.selectAll("#projectTable>thead")

        currentmonths
            .selectAll(".firstMonth,.secondMonth")
            .data(months)
            .text(function (d) {
                return d
            })




        let tab = d3.select("#projectTable>tbody")
            .selectAll("tr").data(this.tableElements)


            tab.exit().remove()

            tab = tab.enter().append("tr")
                .merge(tab)


        tab
            .on("mouseover",function (d) {
                d3.select(this).selectAll("th,td ").classed("trhover",true)
            })
            .on("mouseleave",function (d) {
                d3.select(this).selectAll("th,td").classed("trhover",false)
            })

        let rows = tab.selectAll("th")
            .data(function(d) {
                if(d.value.type=="project") {
                    return [{type: "project", vis: "text", value: d.key}]
                }
                else {
                    return [{type: "aggregate", vis: "text", value: d.key}]
                }
            })


        rows.exit().remove();

        rows = rows.enter().append("th")
            .merge(rows)

        let thisClass = this


        rows
            .text(function (d) {
                if(d.type == "project") {
                    return "> " + d.value
                }
                else{
                    return d.value
                }
            })
            .classed("aggregate",function (d) {
                return d.type == "aggregate"
            })
            .classed("project",function (d) {
                return d.type == "project"
            })
            .on("click",function (d) {
                thisClass.updateList(this.parentNode.rowIndex-2)
            })


        let cells = []
        let maxmar = Number.MIN_VALUE;
        let maxrev = Number.MIN_VALUE;
        let minmar = Number.MAX_VALUE;
        let minrev = Number.MAX_VALUE;
        rows = tab.selectAll("td")
            .data(function(d) {
                if(d.value.Margin[0].value > maxmar){
                    maxmar = d.value.Margin[0].value
                }
                if(d.value.Margin[1].value > maxmar){
                    maxmar = d.value.Margin[1].value
                }
                if(d.value.Margin[0].value < minmar){
                    minmar = d.value.Margin[0].value
                }
                if(d.value.Margin[1].value < minmar){
                    minmar = d.value.Margin[1].value
                }
                if(d.value.Revenue[0].value > maxrev){
                    maxrev = d.value.Revenue[0].value
                }
                if(d.value.Revenue[1].value > maxrev){
                    maxrev = d.value.Revenue[1].value
                }
                if(d.value.Revenue[0].value < minrev){
                    minrev = d.value.Revenue[0].value
                }
                if(d.value.Revenue[1].value < minrev){
                    minrev = d.value.Revenue[1].value
                }
                let cells = []
                if(d.value.type=="project" && d.key !="") {
                    cells.push({type: "project", vis: "revenue", value: d.value.Revenue[0].value,class:"odd"})
                    cells.push({type: "project", vis: "margin", value: d.value.Margin[0].value,class:"even"})
                    cells.push({type: "project", vis: "revenue", value: d.value.Revenue[1].value,class:"odd"})
                    cells.push({type: "project", vis: "margin", value: d.value.Margin[1].value,class:"even"})
                    cells.push({type: "project", vis: "revenuediff", value: (100*(d.value.Revenue[1].value-d.value.Revenue[0].value)/d.value.Revenue[0].value).toFixed(2),class:"odd"})
                    cells.push({type: "project", vis: "margindiff", value: (100*(d.value.Margin[1].value-d.value.Margin[0].value)/d.value.Margin[0].value).toFixed(2),class:"even"})
                }
                else if (d.key !=""){
                    cells.push({type: "aggregate", vis: "revenue", value: d.value.Revenue[0].value,class:"odd"})
                    cells.push({type: "aggregate", vis: "margin", value: d.value.Margin[0].value,class:"even"})
                    cells.push({type: "aggregate", vis: "revenue", value: d.value.Revenue[1].value,class:"odd"})
                    cells.push({type: "aggregate", vis: "margin", value: d.value.Margin[1].value,class:"even"})
                    cells.push({type: "aggregate", vis: "revenuediff", value: (100*(d.value.Revenue[1].value-d.value.Revenue[0].value)/d.value.Revenue[0].value).toFixed(2)+" %",class:"odd"})
                    cells.push({type: "aggregate", vis: "margindiff", value: (((100*(d.value.Margin[1].value-d.value.Margin[0].value)/d.value.Margin[0].value).toFixed(2)).toString())+" %",class:"even"})
                }
                    return cells
                }
            )


        let xMarginScale = d3.scaleLinear()
            .domain([minmar,maxmar])
            .range([this.cell.buffer,this.cell.width-this.cell.buffer*3])

        let xAxis =d3.axisBottom()
            .scale(xMarginScale)
            .ticks(4);

        let yRevenueScale = d3.scaleLinear()
            .domain([minrev,maxrev])
            .range([this.cell.buffer,this.cell.height-this.cell.buffer*3])

        let yAxis =d3.axisLeft()
            .scale(yRevenueScale)
            .ticks(5);

        let forAxis = d3.select(".view2>svg").append('g')
             .attr('transform', 'translate('+this.cell.buffer*2+',' +(this.cell.height-30)+')')
            .call(xAxis)
          //  .call(yAxis);

        d3.select(".view2>svg").append('g')
            .attr('transform', 'translate(100, 100)')
            .classed('y axis', true)
            .call(yAxis);



        rows.exit().remove();

        rows = rows.enter().append("td")
            .merge(rows)

        rows
            .classed("odd",function (d) {
                return d.class == "odd"
            })
            .classed("even",function (d) {
                return d.class == "even"
            })
            .on("click",function (d) {
                thisClass.updateList(this.parentNode.rowIndex-2)
            })







        let textout = rows.selectAll("text")
            .data(function(d) {
                return [d]; });

        textout.exit().remove();

        textout.attr("x",0)
            .attr("y",this.cell.height/2 + 4)
            .classed("node",true)
            .attr("height", this.cell.height )
            .text(function (d) {
                return d.value
            })

        textout.enter()
            .append("text")
            .attr("x",0)
            .attr("y",this.cell.height/2 + 3)
            .classed("node",true)

            .attr("height", this.cell.height )
            .text(function (d) {
                return d.value
            })

        tab = d3.select("#projectTable>tbody")
            .selectAll("tr").data(this.tableElements)



    }

    updateList(i) {
       

        if (this.tableElements[i].value.type == "project"){
            return
        }
        if( this.tableElements[i+1].value.type == "aggregate"){
            this.tableElements.splice.apply(this.tableElements, [i+1,0].concat(this.tableElements[i].value.projects));
        }
        else{
            this.tableElements.splice(i+1,this.tableElements[i].value.projects.length);
        }
        this.updateTable()
        
    }


    collapseList() {
        this.tableElements = this.tableElements.filter(function(d){
            return d.value.type != "project";
        })


    }


}
