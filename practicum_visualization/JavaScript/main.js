document.addEventListener("DOMContentLoaded", function() {
    // Показать таблицу при загрузке
    showTable('build', buildings);

    // Обработчик для кнопки скрытия/показа таблицы
    const toggleButton = document.getElementById('toggleTable');
    toggleButton.addEventListener('click', function() {
        const table = d3.select('#build');
        const isHidden = toggleButton.textContent === 'Показать таблицу';
        if (isHidden) {
            showTable('build', buildings);
            toggleButton.textContent = 'Скрыть таблицу';
        } else {
            table.selectAll('tr').remove();
            toggleButton.textContent = 'Показать таблицу';
        }
    });

    // Обработчик отправки формы
    const form = document.getElementById('graphSettings');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем перезагрузку страницы

        // Получаем значение для оси OX
        const keyX = form.querySelector('input[name="xAxis"]:checked').value;

        // Собираем значения для оси OY
        const yAxis = Array.from(form.querySelectorAll('input[name="yAxis"]:checked')).map(input => input.value);
        let heightType;
        if (yAxis.length === 0) {
            heightType = null; // Ничего не выбрано
        } else if (yAxis.length === 1) {
            heightType = yAxis[0]; // "min" или "max"
        } else {
            heightType = "both"; // Оба значения выбраны
        }

        // Получаем тип диаграммы
        const chartType = form.querySelector('select[name="chartType"]').value;

        document.querySelector('input[name="yAxis"][value="min"]').addEventListener("change", handleCheckboxChange);
        document.querySelector('input[name="yAxis"][value="max"]').addEventListener("change", handleCheckboxChange);
        
        // Вызываем функцию построения графика
        drawGraph(buildings, keyX, heightType, chartType);
    });

    // Начальный вызов графика
    drawGraph(buildings, "Страна", "max", "scatter");
});