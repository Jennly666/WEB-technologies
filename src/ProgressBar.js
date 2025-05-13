import React, { useState } from 'react';
import './ProgressBar.css';

import image1 from './images/image_1.svg';
import image2 from './images/image_2.svg';
import image3 from './images/image_3.svg'; 
import image4 from './images/image_4.svg';
import image5 from './images/image_5.svg';
import image6 from './images/image_6.svg';

const ProgressBar = ({ max, label }) => {
  const [value, setValue] = useState(16);
    
  const handleClick = (event) => {
    const progressBar = event.currentTarget.querySelector('.progress-bar'); // выбираем div .progress-bar
    const rect = progressBar.getBoundingClientRect(); // получаем размер и положение .progress-bar
    const clickPosition = event.clientX - rect.left; // вычисляем X точки щелчка отн-но левого края
    const barWidth = rect.width; // общая ширина индикатора
    const percentage = (clickPosition / barWidth) * 100; // вычисляем процент полосы прогресса
    const range = max - 5;
    const newValue = Math.round((percentage / 100) * range) + 5 // преобразуем % в значение из [5, макс]
    setValue(newValue);
  };

  const percentage = ((value - 5) / (max - 5)) * 100;

let imageUrl, description;
  if (value >= 5 && value <= 7) {
    imageUrl = image1;
    description = 'Раннее детство, полное чудес и игр!';
  } else if (value >= 8 && value <= 10) {
    imageUrl = image2;
    description = 'Развитие самостоятельности и новых навыков';
  } else if (value >= 11 && value <= 13) {
    imageUrl = image3;
    description = 'Принятие перемен, открытие талантов и укрепление дружеских отношений';
  } else if (value >= 14 && value <= 16) {
    imageUrl = image4;
    description = 'Изучение увлечений, поиск независимости и формирование своего будущего';
  } else if (value >= 17 && value <= 19) {
    imageUrl = image5;
    description = 'Обретение зрелости, осуществление мечтаний и выход в мир';
  } else {
    imageUrl = image6;
    description = 'Принятие ответственности, достижение целей и построение уникального пути';
  }

return (
    <div className="progress-bar-container" onClick={handleClick}>
      <div className="progress-label">{label}</div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
        <span className="progress-value">{value}</span>
      </div>
      <div className="progress-range">
        <span>5</span>
        <span>{max}</span>
      </div>
      <div className="age-content">
        <img src={imageUrl} className="age-image" />
        <p className="age-description">{description}</p>
      </div>
    </div>
  );
};

export default ProgressBar;