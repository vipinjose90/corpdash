


// /**
//  * Loads in month.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
d3.csv("data/Summary.csv", function (error, monthData) {

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */

        // ******* TODO: PART I *******
        let projectData =
                        d3.nest()
                            .key(function (d) {
                                return d.Client;
                            })
                            .rollup(function (leaves) {
                                let out1 = {
                                    "Margin":
                                        d3.nest()
                                            .key(function (d) {
                                                return d["Month"]
                                            })
                                            .rollup(function (low) {
                                                    return d3.sum(low, function (l) {
                                                        return parseFloat(l["Margin"])
                                                    })
                                                })
                                            .entries(leaves),
                                    "Revenue":
                                        d3.nest()
                                            .key(function (d) {
                                                return d["Month"]
                                            })
                                            .rollup(function (low) {
                                                return d3.sum(low, function (l) {
                                                    return parseFloat(l["Revenue"])
                                                })
                                            })
                                            .entries(leaves),


                                    "type": "aggregate",
                                    "projects":
                                        d3.nest()
                                            .key(function (d) {
                                                return d["Project Name"];
                                            })
                                            .rollup(function (lowest) {
                                                        let out2 = {
                                                            "Margin":
                                                                d3.nest()
                                                                    .key(function (d) {
                                                                        return d["Month"]
                                                                    })
                                                                    .rollup(function (lowest) {
                                                                        return d3.sum(lowest, function (l) {
                                                                            return parseFloat(l["Margin"])
                                                                        })
                                                                    })
                                                                    .entries(lowest),
                                                            "Revenue":
                                                                d3.nest()
                                                                    .key(function (d) {
                                                                        return d["Month"]
                                                                    })
                                                                    .rollup(function (lowest) {
                                                                        return d3.sum(lowest, function (l) {
                                                                            return parseFloat(l["Revenue"])
                                                                        })
                                                                    })
                                                                    .entries(lowest),
                                                            "type": "project"
                                            }
                                                        return out2
                                            }).entries(leaves)

                                }
                                return out1

                })
                .entries(monthData);

        //console.log(projectData)




        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(projectData);

        table.createTable();


});

// ********************** END HACKER VERSION ***************************
