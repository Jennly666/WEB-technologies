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
      Название: event.target["structure"].value.toLowerCase(),
      Тип: event.target["type"].value.toLowerCase(),
      Страна: event.target["country"].value.toLowerCase(),
      Город: event.target["city"].value.toLowerCase(),
      Год: [
        event.target["year_min"].value ? Number(event.target["year_min"].value) : -Infinity,
        event.target["year_max"].value ? Number(event.target["year_max"].value) : Infinity,
      ],
      Высота: [
        event.target["height_min"].value ? Number(event.target["height_min"].value) : -Infinity,
        event.target["height_max"].value ? Number(event.target["height_max"].value) : Infinity,
      ],
    };

    // Фильтруем данные по значениям всех полей формы
    let arr = props.fullData;
    for (const key in filterField) {
      if (key === "Год" || key === "Высота") {
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
    // При сбросе формы возвращаем исходные данные
    props.filtering(props.fullData);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <p>
        <label>Название:</label>
        <input name="structure" type="text" />
      </p>
      <p>
        <label>Тип:</label>
        <input name="type" type="text" />
      </p>
      <p>
        <label>Страна:</label>
        <input name="country" type="text" />
      </p>
      <p>
        <label>Город:</label>
        <input name="city" type="text" />
      </p>
      <p>
        <label>Год (мин):</label>
        <input name="year_min" type="number" />
      </p>
      <p>
        <label>Год (макс):</label>
        <input name="year_max" type="number" />
      </p>
      <p>
        <label>Высота (мин):</label>
        <input name="height_min" type="number" />
      </p>
      <p>
        <label>Высота (макс):</label>
        <input name="height_max" type="number" />
      </p>
      <p>
        <button type="submit">Фильтровать</button>
        <button type="reset">Очистить фильтр</button>
      </p>
    </form>
  );
};

export default Filter;