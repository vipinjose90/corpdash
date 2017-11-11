/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor(teamData) {
        this.tableElements = teamData;
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300.

        let treemap = d3.tree().size([800,300]);

        //Create a root for the tree using d3.stratify();
        let root = d3.stratify()
            .id(function(d) { return d.id; })
            .parentId(function(d) {
                if (d.ParentGame != "") {
                    return treeData[d.ParentGame].id;
                }
                else
                    return null
            })
            (treeData);

        treemap(root)

        //Add nodes and links to the tree.
         let g = d3.select("#tree")
            .attr("transform", "translate(" + 100 + "," + 100 + ")")
        let links = g.selectAll("path")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .classed("link", true)
            .classed("selected",false)
            .attr("d", function(d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

        let nodes = g.selectAll("circle")
            .data(root.descendants())
            .enter().append("g")
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; })
            .attr("class", function(d) {
                if(d.data.Wins == "1"){
                    return "winner node"
                }
                else{
                    return "node"
                }});

        nodes.append("circle")
            .attr("r", 5)

        nodes.append("text")
            .text(function(d) { return d.data.Team; })
            .attr("x", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 2.5)
            .style("text-anchor", function(d) {
                return d.children ? "end" : "start"; });


    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(table,row) {


        // ******* TODO: PART VII *******
        this.tableElements = table
        this.clearTree();
        let thisTable = this.tableElements
        let paths = d3.select("#tree").selectAll("path")
        if (thisTable[row].value.type == "aggregate") {

                paths.each(function (d) {
                    if (d.data.Team == thisTable[row].key && d.data.Wins == "1") {
                        d3.select(this).classed("selected", true);
                    }
                });
        } else {
            paths.each(function (d) {

                if (d.data.Team == thisTable[row].value.Opponent && d.data.Opponent == thisTable[row].key)
                    d3.select(this).classed("selected", true);

                if (d.data.Team == thisTable[row].key && d.data.Opponent == thisTable[row].value.Opponent)
                    d3.select(this).classed("selected", true);
                });
        }
        let textAll = d3.select("#tree").selectAll("text")

        if (thisTable[row].value.type == "aggregate") {

            textAll.each(function (d) {
                if (d.data.Team == thisTable[row].key && d.data.Wins == "1") {
                    d3.select(this).classed("selectedLabel", true);
                }
            });
        } else {
            textAll.each(function (d) {
                if (d.data.Team == thisTable[row].value.Opponent && d.data.Opponent == thisTable[row].key)
                    d3.select(this).classed("selectedLabel", true);

                if (d.data.Team == thisTable[row].key && d.data.Opponent == thisTable[row].value.Opponent)
                    d3.select(this).classed("selectedLabel", true);
            });
        }


    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
        d3.select("#tree")
            .selectAll(".selected,.selectedLabel")
            .classed("selected",false)
            .classed("selectedLabel",false)
    }
}
