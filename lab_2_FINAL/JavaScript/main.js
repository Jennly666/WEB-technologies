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
});

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
    
    for(let j = 0; j < allSelect.length; j++) {
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
        document.getElementById(nextSelectId + 'Desc').checked = false; // Сброс галочки следующего уровня
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
    document.getElementById(nextSelectId + 'Desc').checked = false; // Сброс галочки при установке "0"
};