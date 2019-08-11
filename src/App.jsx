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
        <p>We know that your patriarchal blessing is something sacred; all files are generated in your browser and never touch our servers.</p>
      </div>
    </div>
  );
}

export default App;
