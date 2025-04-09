/*формируем массив для сортировки по уровням вида 
  (в нашем случае в форме два уровня сортировки):
   [
    {column: номер столбца, по которому осуществляется сортировка, 
     order: порядок сортировки (true по убыванию, false по возрастанию)
    },
    {column: номер столбца, 
     order: порядок сортировки
    }
   ]
*/

let createSortArr = (data) => {
    let sortArr = [];
    
    let sortSelects = data.getElementsByTagName('select');
    
    for (let i = 0; i < sortSelects.length; i++) {   
       // получаем номер выбранной опции
        let keySort = sortSelects[i].value;
        // в случае, если выбрана опция Нет, заканчиваем формировать массив
        if (keySort == 0) {
            break;
        }
        // получаем номер значение флажка для порядка сортировки
        // имя флажка сформировано как имя поля SELECT и слова Desc
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push(
          {column: keySort - 1, 
           order: desc}
        ); 
    }
    return sortArr; 
};

let sortTable = (idTable, data) => {
    
    // формируем управляющий массив для сортировки
    let sortArr = createSortArr(data);
    
    // сортировать таблицу не нужно, во всех полях выбрана опция Нет
    if (sortArr.length === 0) {
        return false;
    }
    //находим нужную таблицу
    let table = document.getElementById(idTable);

    // преобразуем строки таблицы в массив 
    let rowData = Array.from(table.rows);
    
    // удаляем элемент с заголовками таблицы
    let headerRow = rowData.shift();
    
    //сортируем данные по возрастанию по всем уровням сортировки
    // используется массив sortArr
    rowData.sort((first, second) => {
        for (let i in sortArr) {
            let key = sortArr[i].column;
            let order = sortArr[i].order;
            let firstValue = first.cells[key].innerHTML;
            let secondValue = second.cells[key].innerHTML;
            
            if (key === 4 || key === 5) {
                firstValue = Number(firstValue);
                secondValue = Number(secondValue);
            }
            
            if (firstValue > secondValue) {
                return order ? -1 : 1;
            } else if (firstValue < secondValue) {
                return order ? 1 : -1;
            }
        }
        return 0;
    });
    
    // Очищаем таблицу
    clearTable(idTable);
    
    // Добавляем заголовок обратно
    table.appendChild(headerRow);

    // Добавляем отсортированные строки обратно в таблицу
    rowData.forEach(row => {
        table.appendChild(row);
    });
    
    return true;
}

let resetSort = (idTable, sortForm) => {
    // Сбрасываем форму сортировки
    let sortSelects = sortForm.getElementsByTagName('select');
    for (let i = 0; i < sortSelects.length; i++) {
        sortSelects[i].value = '0'; // Выбираем "Нет"
        if (i > 0) {
            sortSelects[i].disabled = true; // Отключаем второй select
        }
    }
    let checkboxes = sortForm.getElementsByTagName('input');
    for (let checkbox of checkboxes) {
        if (checkbox.type === 'checkbox') {
            checkbox.checked = false; // Снимаем галочки
        }
    }

    // Получаем форму фильтрации
    const filterForm = document.getElementById('filter');
        
    // Очищаем таблицу и применяем фильтрацию на основе текущих значений полей
    clearTable(idTable);
    filterTable(buildings, idTable, filterForm);
};