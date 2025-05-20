/*
   компонент, для фильтрации таблицы
   пропсы:
      fullData - полные данные, по которым формировалась таблица при загрузке страницы
      data - данные для фильтрации
      filtering - функция обновления данных для фильтрации
*/

const Filter = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();

     // Создаем словарь со значениями полей формы
    const filterField = {
      Модель: event.target['model'].value.toLowerCase(),
      Тип: event.target['tip'].value.toLowerCase(),
      'Номер модели': event.target['modelNumber'].value.toLowerCase(),
      'Выпуск, г': [
        event.target['year_min'].value ? Number(event.target['year_min'].value) : -Infinity,
        event.target['year_max'].value ? Number(event.target['year_max'].value) : Infinity,
      ],
      'Ёмкость АКБ': [
        event.target['capacity_min'].value ? Number(event.target['capacity_min'].value) : -Infinity,
        event.target['capacity_max'].value ? Number(event.target['capacity_max'].value) : Infinity,
      ],
      'Вес, г': [
        event.target['weight_min'].value ? Number(event.target['weight_min'].value) : -Infinity,
        event.target['weight_max'].value ? Number(event.target['weight_max'].value) : Infinity,
      ],
    };

    // Фильтруем данные по значениям всех полей формы
    let arr = props.fullData;
    for (const key in filterField) {
      if (key === 'Выпуск, г' || key === 'Ёмкость АКБ' || key === 'Вес, г') {
        // Фильтрация по числовому интервалу
        arr = arr.filter((item) => {
          const value = Number(item[key]);
          return value >= filterField[key][0] && value <= filterField[key][1];
        });
      } else {
        // Фильтрация по текстовому вхождению (если поле не пустое)
        if (filterField[key]) {
          arr = arr.filter((item) =>
            item[key].toLowerCase().includes(filterField[key])
          );
        }
      }
    }

    // Передаем родительскому компоненту новое состояние - отфильтрованный массив
    props.filtering(arr);
  };

  const handleReset = () => {
    props.filtering(props.fullData);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <p>
        <label>Модель:</label>
        <input name="model" type="text" />
      </p>
      <p>
        <label>Тип:</label>
        <input name="tip" type="text" />
      </p>
      <p>
        <label>Номер модели:</label>
        <input name="modelNumber" type="text" />
      </p>
      <p>
        <label>Выпуск (мин):</label>
        <input name="year_min" type="number" />
      </p>
      <p>
        <label>Выпуск (макс):</label>
        <input name="year_max" type="number" />
      </p>
      <p>
        <label>Ёмкость (мин):</label>
        <input name="capacity_min" type="number" />
      </p>
      <p>
        <label>Ёмкость (макс):</label>
        <input name="capacity_max" type="number" />
      </p>
      <p>
        <label>Вес (мин):</label>
        <input name="weight_min" type="number" />
      </p>
      <p>
        <label>Вес (макс):</label>
        <input name="weight_max" type="number" />
      </p>
      <p>
        <button type="submit">Фильтровать</button>
        <button type="reset">Очистить фильтр</button>
      </p>
    </form>
  );
};

export default Filter;