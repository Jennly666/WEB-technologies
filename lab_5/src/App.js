import './CSS/App.css';
import iphones from './data.js';
import Table from './components/Table.js';

function App() {
  return (
    <div className="App">
      <h2>
        <a href="site_1.html">Главная страница</a>
        <a href="site_2.html">Самые свежие модели</a>
        <a href="site_3.html">Таблица для сравнения айфонов</a>
      </h2>
      <p>
        Иногда возникает задача сравнить модели iPhone по некоторым параметрам — ёмкость аккумулятора, качество камеры, размер оперативной памяти, и, как оказалось, простой таблицы сравнения параметров айфонов, отсортированных по годам нет.
      </p>
      <p>
        Эта таблица как раз была создана чтобы решить этот вопрос исчерпывающе.
      </p>
      <Table data={iphones} amountRows="15" isPaginated={true} />
    </div>
  );
}

export default App;