function createArrGraph(data, key) {
    const groupObj = d3.group(data, d => d[key]);

    let arrGraph = [];
    for (let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d['Ёмкость АКБ']));
        arrGraph.push({ labelX: entry[0], values: minMax });
    }

    if (key === "Выпуск, г") {
        arrGraph.sort((a, b) => +a.labelX - +b.labelX);
    }
    return arrGraph;
}

function drawGraph(data, keyX, heightType, chartType) {
    if (!heightType) {
        showError("Ошибка: выберите хотя бы одно значение по оси OY (Минимальная или Максимальная ёмкость).");
        return;
    }

    const arrGraph = createArrGraph(data, keyX);

    let svg = d3.select("svg");
    svg.selectAll('*').remove();

    const attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    };

    const [scX, scY, heights] = createAxis(svg, arrGraph, attr_area, heightType);

    if (chartType === "scatter") {
        createChart(svg, heights, scX, scY, attr_area, "red");
    } else if (chartType === "histogram") {
        createHistogram(svg, heights, scX, scY, attr_area, "red", heightType);
    } else if (chartType === "line") {
        createLineChart(svg, heights, scX, scY, attr_area, "red");
    }
}

function createAxis(svg, data, attr_area, heightType) {
    let heights = [];
    data.forEach(d => {
        if (heightType === "max" || heightType === "both") {
            heights.push({ labelX: d.labelX, capacity: d.values[1], type: "max" });
        }
        if (heightType === "min" || heightType === "both") {
            heights.push({ labelX: d.labelX, capacity: d.values[0], type: "min" });
        }
    });

    let allHeights = heights.map(d => d.capacity);
    const [min, max] = d3.extent(allHeights);

    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.1);

    let scaleY = d3.scaleLinear()
        .domain([min * 0.85, max * 1.1])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    let axisX = d3.axisBottom(scaleX);
    let axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY, heights];
}

function createChart(svg, data, scaleX, scaleY, attr_area, color) {
    const r = 4;

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", d => scaleY(d.capacity))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", d => d.type === "min" ? "blue" : color);
}

function createHistogram(svg, data, scaleX, scaleY, attr_area, color, heightType) {
    const barWidth = scaleX.bandwidth();

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => {
            const x = scaleX(d.labelX);
            if (heightType === "both") {
                return d.type === "min" ? x + (barWidth / 2) : x;
            } else {
                return x;
            }
        })
        .attr("y", d => scaleY(d.capacity))
        .attr("width", d => {
            if (heightType === "both") return barWidth / 2;
            return barWidth;
        })
        .attr("height", d => attr_area.height - 2 * attr_area.marginY - scaleY(d.capacity))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", d => d.type === "min" ? "blue" : color);
}

function createLineChart(svg, data, scaleX, scaleY, attr_area, color) {
    const groupedData = d3.group(data, d => d.type);

    const lineGenerator = d3.line()
        .x(d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .y(d => scaleY(d.capacity));

    groupedData.forEach((values, type) => {
        svg.append("path")
            .datum(values)
            .attr("fill", "none")
            .attr("stroke", type === "min" ? "blue" : color)
            .attr("stroke-width", 2)
            .attr("d", lineGenerator)
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`);
    });
}

function showError(message) {
    d3.select("#error-container").selectAll("*").remove();
    d3.select("#error-container")
        .append("div")
        .attr("id", "error-message")
        .style("color", "red")
        .style("margin-top", "10px")
        .style("font-size", "14px")
        .text(message);
}

function handleCheckboxChange() {
    const anyChecked = document.querySelectorAll('input[name="yAxis"]:checked').length > 0;
    if (anyChecked) {
        d3.select("#error-container").selectAll("*").remove();
    }
}