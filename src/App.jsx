import React from 'react';
import BlessingForm from './Components/BlessingForm';

function App() {
  return (
    <div className="App">
      <nav>
        <div className="nav-wrapper blue-grey">
          <div className="container">
            <a href="/" className="brand-logo center">Patriarchal Formatter</a>
          </div>
        </div>
      </nav>
      <div className="container center">
        <h2>Please enter your patriarchal blessing information below.</h2>
        <BlessingForm />
      </div>
    </div>
  );
}

export default App;
