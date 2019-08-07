import React from 'react';
import BlessingForm from './Components/BlessingForm';

function App() {
  return (
    <div className="App">
      <nav>
        <div class="nav-wrapper blue-grey">
          <div className="container">
            <a href="/" class="brand-logo center">Patriarchal Formatter</a>
          </div>
        </div>
      </nav>
      <div className="container center">
        <h2>Please enter your patriarchal blessing information below.</h2>
        <BlessingForm />
        <p>We know that your patriarchal blessing is something sacred, and we will delete all generated files 24 hours after they are created.</p>
      </div>
    </div>
  );
}

export default App;
