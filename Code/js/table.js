/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(monthData) {

        this.tableElements = monthData.slice(); //

        this.teamData = monthData;


        this.cell = {
            "width": 600,
            "height": 600,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

    }


    createTable() {


        let thisClass = this
        thisClass.updateTable();

        d3.select(".view2")
            .selectAll("#button3")
            .on("click", function() {
                thisClass.tableElements = thisClass.teamData.slice()
                thisClass.createTable()
            })



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

        let transition_speed = 1500

        this.scat = new Scatter()
        this.scat.createTree(this.tableElements);


        d3.select(".view2")
            .selectAll("#button1")
            .on("click", function() {
                thisClass.scat.filterMonth("first")
            })

        d3.select(".view2")
            .selectAll("#button2")
            .on("click", function() {
                thisClass.scat.filterMonth("second")
            })

        d3.select(".view2")
            .selectAll("#button4")
            .on("click", function() {
                thisClass.scat.filterMonth("both")
            })


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

        //console.log(this.tableElements)

            tab.exit().remove()

            tab = tab.enter().append("tr")
                .merge(tab)


        tab
            .on("mouseover",function (d) {
                thisClass.scat.updateConnect(d.key,d.value.type)
                d3.select(this).selectAll("th,td ").classed("trhover",true)

            })
            .on("mouseleave",function (d) {
                d3.select(this).selectAll("th,td").classed("trhover",false)
                thisClass.scat.clearConnect()
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

        rows
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

        rows = tab.selectAll("td")
            .data(function(d) {
                let cells = []
                if(d.value.type=="project" && d.key !="") {
                    cells.push({type: "project", vis: "revenue",year:"current", value: d.value.Revenue[0].value,class:"odd"})
                    cells.push({type: "project", vis: "margin",year:"current", value: d.value.Margin[0].value,class:"even"})
                    cells.push({type: "project", vis: "revenue",year:"prev", value: d.value.Revenue[1].value,class:"odd"})
                    cells.push({type: "project", vis: "margin",year:"prev", value: d.value.Margin[1].value,class:"even"})
                    cells.push({type: "project", vis: "revenuediff",year:"", value: (100*(d.value.Revenue[1].value-d.value.Revenue[0].value)/d.value.Revenue[0].value).toFixed(2),class:"odd"})
                    cells.push({type: "project", vis: "margindiff",year:"", value: (100*(d.value.Margin[1].value-d.value.Margin[0].value)/d.value.Margin[0].value).toFixed(2),class:"even"})
                }
                else if (d.key !=""){
                    cells.push({type: "aggregate", vis: "revenue",year:"current", value: d.value.Revenue[0].value,class:"odd"})
                    cells.push({type: "aggregate", vis: "margin",year:"current", value: d.value.Margin[0].value,class:"even"})
                    cells.push({type: "aggregate", vis: "revenue",year:"prev", value: d.value.Revenue[1].value,class:"odd"})
                    cells.push({type: "aggregate", vis: "margin",year:"prev", value: d.value.Margin[1].value,class:"even"})
                    cells.push({type: "aggregate", vis: "revenuediff",year:"", value: (100*(d.value.Revenue[1].value-d.value.Revenue[0].value)/d.value.Revenue[0].value).toFixed(2)+" %",class:"odd"})
                    cells.push({type: "aggregate", vis: "margindiff",year:"", value: (((100*(d.value.Margin[1].value-d.value.Margin[0].value)/d.value.Margin[0].value).toFixed(2)).toString())+" %",class:"even"})
                }
                    return cells
                }
            )



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
            .attr("height", this.cell.height )
            .text(function (d) {
                return d.value
            })

        textout
            .classed("node",true)

        textout.enter()
            .append("text")
            .attr("x",0)
            .attr("y",this.cell.height/2 + 3)
            .attr("height", this.cell.height )
            .text(function (d) {
                return d.value
            })

        textout
            .classed("node",true)

    }

    updateList(i) {


        if (this.tableElements[i].value.type == "project"){
            return
        }
        if( this.tableElements[i+1] == undefined){
            this.scat.clearConnect()
            this.tableElements.splice.apply(this.tableElements, [i+1,0].concat(this.tableElements[i].value.projects));
        }

        else if( this.tableElements[i+1].value.type == "aggregate" ){
            this.scat.clearConnect()
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
