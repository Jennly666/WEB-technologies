//   data - исходный массив (например, buildings)
//   key - поле, по которому осуществляется группировка
function createArrGraph(data, key) {  
    groupObj = d3.group(data, d => d[key]);

    let arrGraph =[];
    for(let entry of groupObj) { // преобразовали массив объектов в массив значений высот для текущей группы.
        let minMax = d3.extent(entry[1].map(d => d['Высота'])); // возвращает массив [мин, макс]
        arrGraph.push({labelX : entry[0], values : minMax});
     }

    if (key === "Год") {
        arrGraph.sort((a, b) => +a.labelX - +b.labelX);
    }
    console.log(arrGraph);
     return arrGraph;
}

function drawGraph(data, keyX, heightType, chartType) {
    if (!heightType) {
        showError("Ошибка: выберите хотя бы одно значение по оси OY (Минимальная или Максимальная высота).");
        return;
    }

    // создаем массив для построения графика
    const arrGraph = createArrGraph(data, keyX);
    
    let svg = d3.select("svg")  
    svg.selectAll('*').remove();

   // создаем словарь с атрибутами области вывода графика
   attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
   }
       
    // создаем шкалы преобразования и массив высот
    const [scX, scY, heights] = createAxis(svg, arrGraph, attr_area, heightType);
    
    // рисуем график в зависимости от типа
    if (chartType === "scatter") {
        createChart(svg, heights, scX, scY, attr_area, "red");
    } else if (chartType === "histogram") {
        createHistogram(svg, heights, scX, scY, attr_area, "red", heightType);
    }
}

function createAxis(svg, data, attr_area, heightType) {
    // массив высот с полями labelX, height, type
    let heights = [];
    data.forEach(d => {
        if (heightType === "max" || heightType === "both") {
            heights.push({ labelX: d.labelX, height: d.values[1], type: "max" });
        }
        if (heightType === "min" || heightType === "both") {
            heights.push({ labelX: d.labelX, height: d.values[0], type: "min" });
        }
    });

    // Создаем массив allHeights для определения шкалы Y
    let allHeights = heights.map(d => d.height);
    // находим интервал значений, которые нужно отложить по оси OY 
    // максимальное и минимальное значение и максимальных высот по каждой стране
    const [min, max] = d3.extent(allHeights);
    //Нашли мин и макс максимальных высот зданий по всем странам для оси OY.

    // функция интерполяции значений на оси
    // по оси ОХ текстовые значения
     let scaleX = d3.scaleBand() //создает шкалу категориальную
                    .domain(data.map(d => d.labelX)) //область значений ["ОАЭ", "Польша", ..]
                    .range([0, attr_area.width - 2 * attr_area.marginX])
                    .padding(0.1);
     //преобразует название страны в позицию на оси OX
                    
     let scaleY = d3.scaleLinear() // линейная шкала для чисел
                    .domain([min * 0.85, max * 1.1 ]) //область значений
                    .range([attr_area.height - 2 * attr_area.marginY, 0]);     
    //преобразует высоту в координату Y на SVG-полотне.          
     
     // создание осей
    let axisX = d3.axisBottom(scaleX); // горизонтальная 
    let axisY = d3.axisLeft(scaleY); // вертикальная

    // отрисовка осей в SVG-элементе
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, 
                                      ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
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
        .attr("cy", d => scaleY(d.height))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", d => d.type === "min" ? "blue" : color);
}

function createHistogram(svg, data, scaleX, scaleY, attr_area, color, heightType) {
    // Определяем ширину столбца
    const barWidth = scaleX.bandwidth();

    // Отрисовка столбцов
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => {
            const x = scaleX(d.labelX);
            if (heightType === "both") {
                return d.type === "min" ? x + (barWidth / 2) : x; // Минимальные справа, максимальные слева
            } else {
                return x; // Для "min" или "max" — начало полосы
            }
        })
        .attr("y", d => scaleY(d.height))
        .attr("width", d => {
            if (heightType === "both") return barWidth / 2; // Половина полосы для каждого типа
            return barWidth; // Полная полоса для "min" или "max"
        })
        .attr("height", d => attr_area.height - 2 * attr_area.marginY - scaleY(d.height))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", d => d.type === "min" ? "blue" : color);
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