let createSortArr = (sortForm) => {
    let sortArr = [];
    let sortSelects = sortForm.getElementsByTagName('select');
    for (let i = 0; i < sortSelects.length; i++) {   
        let keySort = sortSelects[i].value;
        if (keySort == 0) break;
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push({column: keySort - 1, order: desc});
    }
    return sortArr;
};

let sortTable = (idTable, sortForm) => {
    let sortArr = createSortArr(sortForm);
    if (sortArr.length === 0) return false;
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    let headerRow = rowData.shift();
    rowData.sort((first, second) => {
        for (let i in sortArr) {
            let key = sortArr[i].column;
            let order = sortArr[i].order;
            let firstValue = first.cells[key].innerHTML;
            let secondValue = second.cells[key].innerHTML;
            if (key === 3 || key === 4 || key === 5) { // Выпуск, Ёмкость, Вес
                firstValue = Number(firstValue);
                secondValue = Number(secondValue);
            }
            if (firstValue > secondValue) return order ? -1 : 1;
            else if (firstValue < secondValue) return order ? 1 : -1;
        }
        return 0;
    });
    clearTable(idTable);
    table.appendChild(headerRow);
    rowData.forEach(row => table.appendChild(row));
    return true;
};

let resetSort = (idTable, sortForm) => {
    let sortSelects = sortForm.getElementsByTagName('select');
    for (let i = 0; i < sortSelects.length; i++) {
        sortSelects[i].value = '0';
        if (i > 0) sortSelects[i].disabled = true;
    }
    let checkboxes = sortForm.getElementsByTagName('input');
    for (let checkbox of checkboxes) {
        if (checkbox.type === 'checkbox') checkbox.checked = false;
    }
    const filterForm = document.getElementById('filter');
    clearTable(idTable);
    filterTable(iphones, idTable, filterForm);
};