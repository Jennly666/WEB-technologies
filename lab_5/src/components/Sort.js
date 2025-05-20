import { useState, useEffect } from 'react';

const Sort = ({ fullData, data, sorting }) => {
  const [levels, setLevels] = useState([
    { column: 0, desc: false },
    { column: 0, desc: false },
    { column: 0, desc: false },
  ]);

  const headers = Object.keys(fullData[0]);
  const numericColumns = [3, 4, 5]; // "Выпуск, г", "Ёмкость АКБ", "Вес, г"

  // Генерация опций для выпадающего списка
  const getOptions = (currentLevel) => {
    const usedIndices = levels
      .slice(0, currentLevel - 1)
      .map((l) => l.column - 1)
      .filter((i) => i >= 0);

    const options = headers
      .map((header, index) => ({
        value: index + 1,
        label: header,
      }))
      .filter((opt) => !usedIndices.includes(opt.value - 1));

    options.unshift({ value: 0, label: 'Нет' });
    return options;
  };

  // Обновление уровня сортировки с сбросом более высоких уровней
  const updateLevel = (index, field, value) => {
    setLevels((prev) =>
      prev.map((level, i) => {
        if (i === index) {
          return { ...level, [field]: value };
        }
        if (i > index && field === 'column') {
          return { column: 0, desc: false };
        }
        return level;
      })
    );
  };

  // Обработчик отправки формы
  const handleSubmit = (event) => {
    event.preventDefault();
    const sortCriteria = levels
      .map((l) => ({ column: l.column - 1, order: l.desc }))
      .filter((s) => s.column >= 0);

    if (!sortCriteria.length) return;

    const sortedData = [...data].sort((a, b) => {
      for (const { column, order } of sortCriteria) {
        let valA = a[headers[column]];
        let valB = b[headers[column]];
        if (numericColumns.includes(column)) {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          valA = String(valA).toLowerCase();
          valB = String(valB).toLowerCase();
        }
        if (valA > valB) return order ? -1 : 1;
        if (valA < valB) return order ? 1 : -1;
      }
      return 0;
    });

    sorting(sortedData);
  };

  const resetSortState = () => {
    setLevels([
      { column: 0, desc: false },
      { column: 0, desc: false },
      { column: 0, desc: false },
    ]);
    sorting(null);
  };

  useEffect(() => {
    resetSortState(); // сброс при обновлении данных
  }, [data]);

  const handleReset = () => {
    resetSortState(); // сброс по кнопке
  };

  // Компонент для рендеринга уровня
  const RenderLevel = ({ index, label }) => (
    <p>
      <label>{label}:</label>
      <select
        value={levels[index].column}
        onChange={(e) => updateLevel(index, 'column', Number(e.target.value))}
        disabled={index > 0 && levels[index - 1].column === 0}
      >
        {getOptions(index + 1).map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="checkbox"
        checked={levels[index].desc}
        onChange={(e) => updateLevel(index, 'desc', e.target.checked)}
        disabled={index > 0 && levels[index - 1].column === 0}
      />{' '}
      По убыванию
    </p>
  );

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <RenderLevel index={0} label="Уровень 1" />
      <RenderLevel index={1} label="Уровень 2" />
      <RenderLevel index={2} label="Уровень 3" />
      <p>
        <button type="submit">Сортировать</button>
        <button type="reset">Сбросить сортировку</button>
      </p>
    </form>
  );
};

export default Sort;