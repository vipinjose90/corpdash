


// /**
//  * Loads in month.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
d3.csv("data/JanuaryData.csv", function (error, monthData) {

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */

        // ******* TODO: PART I *******
        let projectData = d3.nest()
            .key(function (d) {
                return d.Client;
            })
            .rollup(function (leaves) {
                let out1 = {
                    "Margin":d3.sum(leaves,function(l){return parseFloat(l["Margin"])}),
                    "Revenue":d3.sum(leaves,function(l){
                        return parseFloat(l[" Revenue "])}),
                    "type": "aggregate",
                    "projects":
                        d3.nest()
                            .key(function (d) {
                                return d["Project Name"];
                            })
                            .rollup(function (lowleaves) {
                                return {
                                    "Margin": d3.sum(lowleaves, function (l) {
                                        return parseFloat(l["Margin"])
                                    }),
                                    "Revenue": d3.sum(lowleaves, function (l) {
                                        return parseFloat(l[" Revenue "])
                                    }),
                                    "type": "project",
                                }})
                            .entries(leaves)

                }
                return out1
            })
            .entries(monthData);


        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(projectData);

        table.createTable();
        table.updateTable();


});

// ********************** END HACKER VERSION ***************************
