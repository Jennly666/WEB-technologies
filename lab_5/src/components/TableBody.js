import TableRow from './TableRow.js';

/*
   компонент, для вывода tbody таблицы
   пропсы:
      body - данные для таблицы в виде массива объектов
      numPage - номер текущей страницы
      amountRows - количество строк таблицы на странице
      isPaginated - признак, выполнять ли пагинацию (true/false)
*/

const TableBody = ({ body, numPage, amountRows, isPaginated }) => {
  const begRange = (numPage - 1) * amountRows;
  const endRange = begRange + Number(amountRows);

  const tbody = body.map((item, index) => (
    <tr
      key={index}
      className={
        isPaginated
          ? index >= begRange && index < endRange
            ? 'show'
            : 'hide'
          : 'show'
      }
    >
      <TableRow row={Object.values(item)} isHead="0" />
    </tr>
  ));

  return <tbody>{tbody}</tbody>;
};

export default TableBody;