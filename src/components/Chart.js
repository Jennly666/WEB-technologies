import * as d3 from "d3";
import { useState, useEffect } from "react";
import ChartDraw from './ChartDraw.js';

const Chart = (props) => {
  const [ox, setOx] = useState("Страна");
  const [oy, setOy] = useState([true, false]); // [max, min]
  const [chartType, setChartType] = useState("scatter");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {        
    event.preventDefault();
    const oyValues = [
        event.target["oy"][0].checked, 
        event.target["oy"][1].checked
    ];
    
    if (!oyValues[0] && !oyValues[1]) {
        setError("Выберите хотя бы одно значение по оси OY");
    }
    
    setOx(event.target["ox"].value); 
    setOy(oyValues);
    setChartType(event.target["chartType"].value);
  }

  const handleOyChange = (index) => (event) => {
    if (error && event.target.checked) {
      const newOy = [...oy];
      newOy[index] = event.target.checked;
      setOy(newOy);
    }
    setError("");
  };

  const createArrGraph = (data, key) => {
    const groupObj = d3.group(data, (d) => d[key]);
    let arrGraph = [];
    for (let entry of groupObj) {
      let minMax = d3.extent(entry[1].map((d) => d['Высота']));
      arrGraph.push({ labelX: entry[0], values: minMax });
    }
    if (key === "Год") {
      arrGraph.sort((a, b) => +a.labelX - +b.labelX);
    }
    return arrGraph;
  };

  return (
    <>
      <h4>Визуализация</h4>
      <form onSubmit={handleSubmit}>
        <p>Значение по оси OX:</p>
        <div>
          <input
            type="radio"
            name="ox"
            value="Страна"
            defaultChecked={ox === "Страна"}
          />
          Страна
          <br />
          <input type="radio" name="ox" value="Год" />
          Год
        </div>

        <p>Значение по оси OY:</p>
        <div>
          <input type="checkbox" name="oy" defaultChecked={oy[0] === true} onChange={handleOyChange(0)}/>
          Максимальная высота
          <br />
          <input type="checkbox" name="oy" onChange={handleOyChange(1)}/>
          Минимальная высота
        </div>

        <p>Тип диаграммы:</p>
        <div>
          <select name="chartType" defaultValue="scatter">
            <option value="scatter">Точечная диаграмма</option>
            <option value="histogram">Гистограмма</option>
          </select>
        </div>

        <p>
          <button type="submit">Построить</button>
        </p>
      </form>

    <p className="error-message">{error}</p>

      <ChartDraw
        data={createArrGraph(props.data, ox)}
        oy={oy}
        chartType={chartType}
      />
    </>
  );
};

export default Chart;