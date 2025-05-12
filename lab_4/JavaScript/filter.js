let correspond = {
    "Модель": "model",
    "Тип": "tip",
    "Номер модели": "modelNumber",
    "Выпуск, г": ["yearFrom", "yearTo"],
    "Ёмкость АКБ": ["capacityFrom", "capacityTo"],
    "Вес, г": ["weightFrom", "weightTo"]
};

let dataFilter = (dataForm) => {
    let dictFilter = {};
    for (let j = 0; j < dataForm.elements.length; j++) {
        let item = dataForm.elements[j];
        let valInput = item.value;
        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        } else if (item.type === "number") {
            if (valInput !== "") {
                valInput = Number(valInput);
            } else {
                valInput = item.id.includes("From") ? -Infinity : Infinity;
            }
        }
        dictFilter[item.id] = valInput;
    }
    return dictFilter;
};

let filterTable = (data, idTable, dataForm) => {
    let datafilter = dataFilter(dataForm);
    filteredIphones = data.filter(item => {
        let result = true;
        for (let key in item) {
            let val = item[key];
            if (typeof val === 'string') {
                val = val.toLowerCase();
                result &&= val.indexOf(datafilter[correspond[key]] || '') !== -1;
            } else if (typeof val === 'number') {
                let [fromKey, toKey] = correspond[key] || [];
                let fromValue = datafilter[fromKey] !== undefined ? datafilter[fromKey] : -Infinity;
                let toValue = datafilter[toKey] !== undefined ? datafilter[toKey] : Infinity;
                result &&= val >= fromValue && val <= toValue;
            }
        }
        return result;
    });
    clearTable(idTable);
    createTable(filteredIphones, idTable);
    // Перестраиваем график после фильтрации
    const graphForm = document.getElementById('graphSettings');
    const keyX = graphForm.querySelector('input[name="xAxis"]:checked').value;
    const yAxis = Array.from(graphForm.querySelectorAll('input[name="yAxis"]:checked')).map(input => input.value);
    let heightType = yAxis.length === 0 ? null : yAxis.length === 1 ? yAxis[0] : "both";
    const chartType = graphForm.querySelector('select[name="chartType"]').value;
    drawGraph(filteredIphones, keyX, heightType, chartType);
};

let clearFilter = (idTable, dataForm) => {
    dataForm.reset();
    resetSort(idTable, document.getElementById('sort'));
    filteredIphones = iphones;
};

document.addEventListener('DOMContentLoaded', () => {
    const clearButton = document.getElementById('clearFiltersButton');
    const findButton = document.getElementById('findButton');
    const form = document.getElementById('filter');
    const tableId = 'iphoneTable';
    
    if (clearButton) {
        clearButton.addEventListener('click', () => clearFilter(tableId, form));
    }
    if (findButton) {
        findButton.addEventListener('click', () => filterTable(iphones, tableId, form));
    }
});