import React from 'react';
import ProgressBar from './ProgressBar';

const App = () => {
  return (
    <div>
      <ProgressBar value={16} max={100} label="ВВЕДИ СВОЙ ВОЗРАСТ" />
    </div>
  );
};

export default App;