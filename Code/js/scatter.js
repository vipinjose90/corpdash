class Scatter {

    constructor() {

        this.cell = {
            "width": 600,
            "height": 600,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

    }

    tooltip_render(tooltip_data) {
        let text = "<h3 class ="  + this.chooseClass(tooltip_data.type)+" >" + tooltip_data.name ;
            text = text + " ("+tooltip_data.year+")"

        text += "</h3>"
        text +=  "Margin: " + tooltip_data.margin +" %";
        text += "<br/>"
        text = text + "<small style=\"color:grey\"><li> MoM Change: " + tooltip_data.marchange + "% </li></small>"
        text +=  "Revenue: " + tooltip_data.revenue;
        text += "<br/>"
        text = text + "<small style=\"color:grey\"><li> MoM Change: " + tooltip_data.revchange + " % </li></small>"
        return text;
    }


    chooseClass (type) {
        if (type == "aggregate") {
            return "aggregate";
        }
        else if (type == "project") {
            return "project";
        }

    }

    createTree(monthData) {

        this.tableElements = monthData.slice();

        let projects = this.tableElements.filter(function (d) {
            return d.value.type == "project"
        })

        this.projectflag = false
        if(projects.length != 0){
            this.tableElements = projects
            this.projectflag = true
        }


        let circleData = []


        let thisClass = this
        for (let elem of thisClass.tableElements) {
            if (thisClass.monthFlag != "second") {
                circleData.push({
                    "elem": "one",
                    "name": elem.key,
                    "margin": (100*(elem.value.Margin[0].value/elem.value.Revenue[0].value)).toFixed(1),
                    "year": elem.value.Margin[0].key,
                    "revenue": elem.value.Revenue[0].value,
                    "type": elem.value.type,
                    "revchange": (100 * (elem.value.Revenue[1].value - elem.value.Revenue[0].value) / elem.value.Revenue[0].value).toFixed(2),
                    "marchange": (100*(elem.value.Margin[1].value/elem.value.Revenue[1].value-elem.value.Margin[0].value/elem.value.Revenue[0].value)).toFixed(2)
                })
            }
            if (thisClass.monthFlag != "first") {
                circleData.push({
                    "elem": "two",
                    "name": elem.key,
                    "margin": (100*(elem.value.Margin[1].value/elem.value.Revenue[1].value)).toFixed(1),
                    "year": elem.value.Margin[1].key,
                    "revenue": elem.value.Revenue[1].value,
                    "type": elem.value.type,
                    "revchange": (100 * (elem.value.Revenue[1].value - elem.value.Revenue[0].value) / elem.value.Revenue[0].value).toFixed(2),
                    "marchange": (100*(elem.value.Margin[1].value/elem.value.Revenue[1].value-elem.value.Margin[0].value/elem.value.Revenue[0].value)).toFixed(2)
                })
            }
        }

        this.circleUpdateData = circleData

        this.updateScatter(circleData)


    }

    updateScatter(circleData) {

        this.circleUpdateData = circleData
        let transition_speed = 1500;
        let thisClass = this
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function () {
                return [0, 140];
            })
            .html((d) => {
                /* populate data in the following format */

                /*
                * pass this as an argument to the tooltip_render function then,
                * return the HTML content returned from that method.
                * */
                return thisClass.tooltip_render(d);
                // return "<p>Works</p>";
            });


        let maxmar = Number.MIN_VALUE;
        let maxrev = Number.MIN_VALUE;
        let minmar = Number.MAX_VALUE;
        let minrev = Number.MAX_VALUE;

        for (let elem of circleData) {
            if (elem.margin > maxmar) {
                maxmar = parseFloat(elem.margin)
            }
            if (elem.margin < minmar) {
                minmar = parseFloat(elem.margin)
            }
            if (elem.revenue > maxrev) {
                maxrev = elem.revenue
            }
            if (elem.revenue < minrev) {
                minrev = elem.revenue
            }
            console.log(elem.margin)
        }

        console.log(minmar)
        console.log(maxmar)

        this.xMarginScale = d3.scaleLinear()
            .domain([minmar-10 , maxmar+10])
            .range([this.cell.buffer * 3.5, this.cell.width])

        this.xAxis = d3.axisBottom()
            .scale(thisClass.xMarginScale)
            .ticks(5);

        this.yRevenueScale = d3.scaleLinear()
            .domain([minrev - 10000, maxrev + 10000])
            .range([this.cell.height - 20, 0])

        this.yAxis = d3.axisLeft()
            .scale(thisClass.yRevenueScale)
            .ticks(5);

        let marginColorScale1 = d3.scaleLinear()
            .domain([minmar, maxmar])
            .range(['#fee8c8', '#e34a33'])

        let marginColoreScale2 = d3.scaleLinear()
            .domain([minmar, maxmar])
            .range(['#ece7f2', '#2b8cbe'])


        d3.select(".view2>svg").selectAll(".xaxis")
            .html("")
        let graph = d3.select(".view2>svg").selectAll(".xaxis").data(["nil"])

        graph.exit().remove()

        let container = graph.enter().append("g")
            .merge(graph)

        let xLine = container
            .attr('transform', 'translate(' + 0 + ',' + (this.cell.height - 20) + ')')
            .classed("xaxis", true)
            .transition()
            .duration(transition_speed)
            .call(thisClass.xAxis)


        if (thisClass.monthFlag != "second") {


            let color = d3.scaleOrdinal()
                .domain(["1450"])
                .range(["#e34a33", "#fee8c8", "#fdbb84"]);

            let legend = container
                .append("g")
                .selectAll("g")
                .data(color.range())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function (d, i) {
                    var height = 20;
                    var x = i * height;
                    var y = 0;
                    return 'translate(' + x + ',' + y + ')';
                });

            legend.append('rect')
                .style("opacity", 0)
                .transition()
                .duration(transition_speed)
                .style("opacity", 1)
                .attr('x', 100)
                .attr('y', 50)
                .attr('width', 20)
                .attr('height', 20)
                .style('fill', color)
                .style('stroke', color);

            let text1 = container.append('text')
                .attr('x', 223)
                .attr('y', 65)
                .classed("legend", true)
                .style("opacity", 0)
                .transition()
                .duration(transition_speed)
                .style("opacity", 1)
                .text(function (d) {
                    return "Previous Month";
                });

        }


    if (thisClass.monthFlag != "first") {

        let color2 = d3.scaleOrdinal()
            .domain(["1450"])
            .range(["#2b8cbe", "#ece7f2", "#a6bddb"]);

        let legend2 = container
            .append("g")
            .selectAll("g")
            .data(color2.range())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = 20;
                var x = i * height;
                var y = 0;
                return 'translate(' + x + ',' + y + ')';
            });

        legend2.append('rect')
            .style("opacity", 0)
            .transition()
            .duration(transition_speed)
            .style("opacity", 1)
            .attr('x', 400)
            .attr('y', 50)
            .attr('width', 20)
            .attr('height', 20)
            .style('fill', color2)
            .style('stroke', color2);

        container.append('text')
            .attr('x', 520)
            .attr('y', 65)
            .classed("legend", true)
            .style("opacity", 0)
            .transition()
            .duration(transition_speed)
            .style("opacity", 1)
            .text(function (d) {
                return "Current Month";
            });

    }


        graph = d3.select(".view2>svg"). selectAll(".yaxis").data(["nil"])

        graph.exit().remove()

        container = graph.enter().append("g")
            .merge(graph)

        container
            .attr('transform','translate('+(this.cell.buffer*5)+','+0+')')
            .classed('yaxis', true)
            .transition()
            .duration(transition_speed)
            .call(thisClass.yAxis);

        d3.select(".view2>svg").append("text")
            .attr("transform", "translate("+ (this.cell.width/2) +","+(this.cell.height+20)+")")
            .attr("text-anchor", "middle")
            .style("opacity",0)
            .transition()
            .duration(transition_speed)
            .style("opacity",1)
            .text("Margin (%)");

        d3.select(".view2>svg").append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this.cell.buffer) +","+(this.cell.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .style("opacity",0)
            .transition()
            .duration(transition_speed)
            .style("opacity",1)
            .text("Revenue");

        let circles =  d3.select(".view2>svg")
            .selectAll("circle")
            .data(circleData)


        circles.exit().remove();

        circles = circles.enter().append("circle")
            .merge(circles)



        circles
            .transition()
            .duration(transition_speed)
            .attr("cx",function (d) {
                return thisClass.xMarginScale(d.margin)
            })
            .attr("cy",function (d) {
                return thisClass.yRevenueScale(d.revenue)
            })
            .attr("fill",function (d) {
                if(d.elem == "one"){
                    return marginColorScale1(d.margin)
                }
                else{
                    return marginColoreScale2(d.margin)
                }
            })
            .attr("stroke",function (d) {
                return "black"
            })


            circles
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .classed("agrregateCircle",function (d) {
                return d.type == "aggregate"

            })
            .classed("projectCircle",function (d) {
                return d.type == "project"

            })




        let svg1 = d3.select(".view2>svg")
        let idleTimeout,
            idleDelay = 350;

        let brushArray = []
        let brush = d3.brush().extent([[(this.cell.buffer*5),-this.cell.height],[this.cell.width,0]]).on("end", function () {
            d3.selectAll(".d3-tip")
                .html("")
                .attr("style","")
                .classed("d3-tip",false)

            let currentSelection = d3.event.selection;
            circleData.forEach(function (d,i) {
                // console.log("margin:",thisClass.xMarginScale(d.margin))
                // console.log(currentSelection[0][0])
                // console.log(currentSelection[1][0])
                // console.log("revenue:",thisClass.yRevenueScale(d.revenue))
                // console.log(currentSelection[0][1])
                // console.log(currentSelection[1][1])
                if((thisClass.xMarginScale(d.margin) >= currentSelection[0][0] && thisClass.xMarginScale(d.margin) <= currentSelection[1][0])
                && (thisClass.yRevenueScale(d.revenue) <= (thisClass.cell.height-20 - Math.abs(currentSelection[1][1])) && thisClass.yRevenueScale(d.revenue) >= (thisClass.cell.height-20 - Math.abs(currentSelection[0][1])))){
                    brushArray.push(d)
                }
            })



            thisClass.updateScatter(brushArray)
        });

        //brush.extent([[140, 180], [110, 125]]);

        d3.select(".view2>svg>.xaxis").append("g")
            .attr("class", "brush")
            .call(brush);


        let vis = d3.select(document.body)
            .append('svg')
            .attr('width', 10)
            .attr('height', 10)
            .append('g')
            .attr('transform', 'translate(20, 20)')
            .call(tip)




    }



    idled() {
        this.idleTimeout = null;
    }


    updateConnect(key,type) {

        if(this.monthFlag == "first" || this.monthFlag =="second"){
            return
        }

        let thisClass = this
        let brushKeys
        d3.select(".view2>svg")
            .selectAll("circle")
            .classed("dim",function (d) {

                if(thisClass.projectflag ==true && type == "aggregate"){
                    return false
                }
                if(d.name != key && ((thisClass.projectflag ==false) || (thisClass.projectflag ==true && d.type == "project"))){
                    return true
                }

            })

        let circleMap = thisClass.circleUpdateData.map(function (d) {
            return d.name
        })

        //console.log(circleMap)

        for (let elem of this.tableElements){
            // if (elem.key == key && circleMap.indexOf(key)>=0){

            let valset = circleMap.filter(function (d) {
                return d == key
            })

            if (valset.length<=1){
                return
            }

            if (elem.key == key ){
                let mar0 = thisClass.xMarginScale(100*(elem.value.Margin[0].value/elem.value.Revenue[0].value))
                let mar1 = thisClass.xMarginScale(100*(elem.value.Margin[1].value/elem.value.Revenue[1].value))
                let rev0 = thisClass.yRevenueScale(elem.value.Revenue[0].value)
                let rev1 = thisClass.yRevenueScale(elem.value.Revenue[1].value)


                let text1 = d3.select(".view2>svg").append("text")
                text1
                    .attr("x",function () {
                        if(mar0>thisClass.cell.width - 0){
                            return mar0-200
                        }
                        else{
                            return mar0 + 10
                        }
                    })
                    .attr("y",function () {
                        if (Math.abs(rev0-rev1) <20){
                            if(rev0 < rev1){
                                return rev0 -10
                            }
                            else{
                                return rev0+10
                            }
                        }
                        else
                            return rev0
                    })
                    .html("(Prev) Margin:"+(100*(elem.value.Margin[0].value/elem.value.Revenue[0].value)).toFixed((1)) + "% | " + "Revenue:"+elem.value.Revenue[0].value)
                    .classed("label",true)

                let text2 = d3.select(".view2>svg").append("text")
                text2
                    .attr("x",function () {
                        if(mar1<280){
                            return mar1+290
                        }
                        else{
                            return mar1 - 10
                        }
                    })
                    .attr("y",function () {
                        if (Math.abs(rev1-rev0) <20){
                            if(rev1 < rev0){
                                return rev1 -10
                            }
                            else{
                                return rev1+10
                            }
                        }
                        else
                            return rev1
                    })
                    .html("(Current) Margin:"+(100*(elem.value.Margin[1].value/elem.value.Revenue[1].value))  + " | " + "Revenue:"+elem.value.Revenue[1].value)
                    .attr("style",function () {
                        if(mar1>1){
                            return "text-anchor:end"
                        }
                    })
                    .classed("label",true)


                let newLine = d3.select(".view2>svg").append("path")
                newLine.attr("d","M "+thisClass.xMarginScale(100*(elem.value.Margin[0].value/elem.value.Revenue[0].value))+" "+rev0+
                    "L "+thisClass.xMarginScale(100*(elem.value.Margin[1].value/elem.value.Revenue[1].value))+" "+rev1)
                    .classed("link", true)





            }
        }
        //this.createTree()

    }

    idled() {
        this.idleTimeout = null;
    }



    clearConnect(){
        d3.select(".view2>svg")
            .selectAll(".link,.dim")
            .classed("link",false)
            .classed("dim",false)

        d3.select(".view2>svg")
            .selectAll(".label")
            .html("")
    }


    filterMonth(inMonth){
        if(inMonth == "first"){
            this.monthFlag = "first"
        }

        else if(inMonth == "second"){
            this.monthFlag = "second"
        }
        else{
            this.monthFlag = "both"
        }
        this.createTree(this.tableElements)
    }


}
