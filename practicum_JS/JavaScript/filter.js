// устанавливаем соответствие между полями формы и столбцами таблицы
let correspond = {
    "Название": "structure",
    "Тип": "category",
    "Страна": "country",
    "Город": "city",
    "Год": ["yearFrom", "yearTo"],
    "Высота": ["heightFrom", "heightTo"]
}

/* Структура ассоциативного массива:
{
    input_id: input_value,
    ...
}
*/
let dataFilter = (dataForm) => {
    
    let dictFilter = {};
    // перебираем все элементы формы с фильтрами
    
    for(let j = 0; j < dataForm.elements.length; j++) {

        // выделяем очередной элемент формы
        let item = dataForm.elements[j];
        
        // получаем значение элемента
        let valInput = item.value;

        // если поле типа text - приводим его значение к нижнему регистру
        if (item.type == "text") {
            valInput = valInput.toLowerCase();
        }
        // обработка числовых полей
        else if (item.type === "number") {
            if (valInput !== "") {
                // если значение есть - преобразуем в число
                valInput = Number(valInput);
            } else {
                // если поле пустое
                if (item.id.includes("From")) {
                    // для полей с "From" в id - минус бесконечность
                    valInput = -Infinity;
                } else if (item.id.includes("To")) {
                    // для полей с "To" в id - плюс бесконечность
                    valInput = Infinity;
                }
            }
        }
        // формируем очередной элемент ассоциативного массива
        dictFilter[item.id] = valInput;
    }       
    return dictFilter;
}

let filteredData = null; // Храним отфильтрованный массив

// фильтрация таблицы
let filterTable = (data, idTable, dataForm) => {
    // получаем данные из полей формы
    let datafilter = dataFilter(dataForm);
    
    // выбираем данные соответствующие фильтру и формируем таблицу из них
    let tableFilter = data.filter(item => {
        let result = true;
        
        // строка соответствует фильтру, если сравнение всех значений из input 
        // со значением ячейки очередной строки - истина
        for(let key in item) {
            let val = item[key];
            
            // текстовые поля проверяем на вхождение
            if (typeof val === 'string') {
                val = item[key].toLowerCase();
                result &&= val.indexOf(datafilter[correspond[key]]) !== -1
            }
            // проверка числовых полей на принадлежность интервалу
            else if (typeof val === 'number') {
                let [fromKey, toKey] = correspond[key] || [];
                let fromValue = fromKey && datafilter[fromKey] !== undefined ? datafilter[fromKey] : -Infinity;
                let toValue = toKey && datafilter[toKey] !== undefined ? datafilter[toKey] : Infinity;
                result &&= val >= fromValue && val <= toValue;
            }
         }
         return result;
    });

    // очищаем таблицу перед заполнением новыми данными
    clearTable(idTable);

    // показать на странице таблицу с отфильтрованными строками
    createTable(tableFilter, idTable);  
}

// Функция очистки фильтров
let clearFilter = (idTable, data, dataForm) => {
    // Очищаем все поля формы
    dataForm.reset();
    
    // Очищаем существующую таблицу
    clearTable(idTable);
    
    // Выводим таблицу с исходными данными
    createTable(data, idTable);
}

// Привязка функции к событию click кнопки
document.addEventListener('DOMContentLoaded', () => {
    const clearButton = document.getElementById('clearFiltersButton');
    const findButton = document.getElementById('findButton');
    const form = document.getElementById('filter');
    const tableId = 'list';
    
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            clearFilter(tableId, buildings, form);
        });
    }
    
    if (findButton) {
        findButton.addEventListener('click', () => {
            filterTable(buildings, tableId, form);
        });
    }
});