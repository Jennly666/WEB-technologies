let filteredIphones = iphones;

let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

let setSortSelect = (arr, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));
    for (let i in arr) {
        sortSelect.append(createOption(arr[i], Number(i) + 1));
    }
}

let setSortSelects = (data, dataForm) => { 
    let head = Object.keys(data);
    let allSelect = dataForm.getElementsByTagName('select');
    
    for (let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if (j > 0) {
            allSelect[j].disabled = true;
        }
    }
}

let changeNextSelect = (nextSelectId, prevSelects) => {
    let nextSelect = document.getElementById(nextSelectId);

    if (prevSelects.some(sel => sel.value == '0')) {
        nextSelect.disabled = true;
        nextSelect.value = '0';
        document.getElementById(nextSelectId + 'Desc').checked = false;
        return;
    }

    nextSelect.disabled = false;
    nextSelect.innerHTML = prevSelects[0].innerHTML;

    for (let sel of prevSelects) {
        if (sel.value != '0') {
            let opt = nextSelect.querySelector(`option[value="${sel.value}"]`);
            if (opt) {
                nextSelect.removeChild(opt);
            }
        }
    }

    nextSelect.value = '0';
    document.getElementById(nextSelectId + 'Desc').checked = false;
}

document.addEventListener("DOMContentLoaded", function() {
    createTable(iphones, 'iphoneTable');
    setSortSelects(iphones[0], document.getElementById('sort'));
    const firstSelect = document.getElementById('fieldsFirst');
    const secondSelect = document.getElementById('fieldsSecond');
    
    firstSelect.addEventListener('change', function() {
        changeNextSelect('fieldsSecond', [firstSelect]);
        changeNextSelect('fieldsThird', [firstSelect, secondSelect]);
    });
    
    secondSelect.addEventListener('change', function() {
        changeNextSelect('fieldsThird', [firstSelect, secondSelect]);
    });
    
    const sortForm = document.getElementById('sort');
    const sortButton = sortForm.querySelector('input[value="Сортировать"]');
    sortButton.addEventListener('click', function() {
        sortTable('iphoneTable', sortForm);
    });

    const resetSortButton = sortForm.querySelector('input[value="Сбросить сортировку"]');
    resetSortButton.addEventListener('click', function() {
        resetSort('iphoneTable', sortForm);
    });

    document.querySelector('input[name="yAxis"][value="min"]').addEventListener("change", handleCheckboxChange);
    document.querySelector('input[name="yAxis"][value="max"]').addEventListener("change", handleCheckboxChange);

    // Обработчик кнопки построения графика
    const buildButton = document.getElementById('buildGraph');
    buildButton.addEventListener('click', function() {
        const graphForm = document.getElementById('graphSettings');
        const keyX = graphForm.querySelector('input[name="xAxis"]:checked').value;
        const yAxis = Array.from(graphForm.querySelectorAll('input[name="yAxis"]:checked')).map(input => input.value);
        let heightType = yAxis.length === 0 ? null : yAxis.length === 1 ? yAxis[0] : "both";
        const chartType = graphForm.querySelector('select[name="chartType"]').value;

        drawGraph(filteredIphones, keyX, heightType, chartType);
    });

    drawGraph(filteredIphones, "Модель", "max", "scatter");
});