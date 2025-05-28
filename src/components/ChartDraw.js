import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

const ChartDraw = (props) => {
    const chartRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const svg = d3.select(chartRef.current);      
        setWidth(parseFloat(svg.style('width')));
        setHeight(parseFloat(svg.style('height')));
    }); 

    const margin = {
        top: 10, 
        bottom: 60, 
        left: 40, 
        right: 10
    };
    
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    const preparedData = useMemo(() => {
        let result = [];
        props.data.forEach(d => {
            if (props.oy[0]) {
                result.push({ 
                    labelX: d.labelX, 
                    height: d.values[1], 
                    type: "max" 
                });
            }
            if (props.oy[1]) {
                result.push({ 
                    labelX: d.labelX, 
                    height: d.values[0], 
                    type: "min" 
                });
            }
        });
        return result;
    }, [props.data, props.oy]);

    const [min, max] = useMemo(() => {
        const heights = preparedData.map(d => d.height);
        return d3.extent(heights);
    }, [preparedData]);

    const scaleX = useMemo(() => {
        return d3
            .scaleBand()
            .domain(props.data.map(d => d.labelX))
            .range([0, boundsWidth])
            .padding(0.1);
    }, [props.data, boundsWidth]);

    const scaleY = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([min * 0.85, max * 1.1])
            .range([boundsHeight, 0]);
    }, [boundsHeight, min, max]);

    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();
        
        const xAxis = d3.axisBottom(scaleX);     
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-30)");

        const yAxis = d3.axisLeft(scaleY);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);
        
        if (props.chartType === "scatter") {
            drawScatterChart(svg, preparedData, scaleX, scaleY, margin);
        } else if (props.chartType === "histogram") {
            drawHistogram(svg, preparedData, scaleX, scaleY, margin, props.oy);
        }

    }, [scaleX, scaleY, preparedData, props.chartType, props.oy]); 

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg ref={chartRef}> </svg>
        </div>
      )
}

function drawScatterChart(svg, data, scaleX, scaleY, margin) {
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", d => {
            const offset = d.type === "min" ? 2 : 0;
            return scaleY(d.height) + offset;
        })
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .style("fill", d => d.type === "min" ? "blue" : "red");
}

function drawHistogram(svg, data, scaleX, scaleY, margin, oy) {
    const barWidth = scaleX.bandwidth();
    const showBoth = oy[0] && oy[1];

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => {
            const x = scaleX(d.labelX);
            return showBoth && d.type === "min" ? 
                x + (barWidth / 2) : x;
        })
        .attr("y", d => scaleY(d.height))
        .attr("width", showBoth ? (barWidth / 2) : barWidth)
        .attr("height", (d) => parseFloat(svg.style("height")) - margin.top - margin.bottom - scaleY(d.height))
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .style("fill", d => d.type === "min" ? "blue" : "red");
}

export default ChartDraw;