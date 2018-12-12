import './index.css';
import * as d3 from 'd3';

//Add event listner On page load
document.addEventListener('DOMContentLoaded', function(){
    
    
    var req = new XMLHttpRequest();
    req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    req.send();
    req.onload = function(){
        let json = JSON.parse(req.responseText);
        //Construct Bar Chart
        let dataset = json['data'];
        dataset = dataset.map((x) => [new Date(x[0].substring(0, 4), parseInt(x[0].substring(5, 7)) -1), x[1]]);
        let maxDate = d3.max(dataset.map((x) => x[0]))
            ,minDate = d3.min(dataset.map((x) => x[0]));
        const w = 800
            ,h = 500
            ,barWidth = w / dataset.length
            ,padding = 60;

        var tooltip = d3.select("#barChart").append("div")
                        .attr("id", "tooltip")
                        .style("opacity", 0);

        const xScale = d3.scaleTime()
                        .domain([minDate, maxDate])
                        .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (d) => d[1])])
                     .range([h - padding, padding]);

        const svg = d3.select("#barChart")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(d[0]))
            .attr("y", (d, i) => yScale(d[1]))
            .attr("width", barWidth)
            .attr("height", (d, i) => h - yScale(d[1]) - padding)
            .attr("fill", "navy")
            .attr("class", "bar")
            .attr("data-date", (d) => d[0].toISOString().substring(0,10))
            .attr("data-gdp" , (d) => d[1])
            .on("mouseover", function(d, i){
                tooltip.transition()
                    .duration(100)
                    .style('opacity', .95)
                    .style('top', yScale(d[1] + 100) + 'px')
                    .style('left', xScale(d[0]) + 'px')
                tooltip.html(`Date: ${d[0].toISOString().substring(0,10)}<br>GDP: ${d[1]} Billion`)
                    .attr('data-date', dataset[i][0].toISOString().substring(0,10));
            })
            .on("mouseout", function(d){
                tooltip.transition()
                    .duration(100)
                    .style('opacity', .0);
            });
            
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)
            .attr("id", "x-axis")
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);
    };
});