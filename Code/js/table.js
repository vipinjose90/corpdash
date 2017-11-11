/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(monthData) {

        //Maintain reference to the tree Object;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the monthData
        this.tableElements = monthData.slice(); //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = monthData;


        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

    }


    createTable() {

        // ******* TODO: PART V *******
        let thisClass = this
        // Set sorting callback for clicking on headers

        thisClass.updateTable();}



        updateTable() {


        let tab = d3.select("#projectTable>tbody")
            .selectAll("tr").data(this.tableElements)

            tab.exit().remove()

            tab = tab.enter().append("tr")
                .merge(tab)


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
                    return "x" + d.value
                }
                else{
                    return d.value
                }
            })
            .classed("aggregate",function (d) {
                return d.type == "aggregate"
            })
            .classed("game",function (d) {
                return d.type == "project"
            })
            .on("click",function (d) {
                thisClass.updateList(this.parentNode.rowIndex-2)
            })



        rows = tab.selectAll("td")
            .data(function(d) {
                let cells = []
                if(d.value.type=="game") {
                    cells.push({type: "game", vis: "text", value: d.value["Revenue"]})
                    cells.push({type: "game", vis: "text", value: d.value["Margin"]})
                }
                else{
                    cells.push({type: "aggregate", vis: "text", value: d.value["Revenue"]})
                    cells.push({type: "aggregate", vis: "text", value: d.value["Margin"]})
                }
                    return cells

                }
            )
            .on("click",function (d) {
                thisClass.updateList(this.parentNode.rowIndex-2)
            })



        rows.exit().remove();

        rows = rows.enter().append("td")
            .merge(rows)




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








        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
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

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        // ******* TODO: PART IV *******
        this.tableElements = this.tableElements.filter(function(d){
            return d.value.type != "project";
        })


    }


}
