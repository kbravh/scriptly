import React from 'react';
import BlessingForm from './Components/BlessingForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <div className="App">
      <nav>
        <div className="nav-wrapper blue-grey">
          <div className="container">
            <a href="/" className="brand-logo center">Patriarchal Formatter</a>
            <span class="sidenav-trigger right" data-target="language-menu">
              <FontAwesomeIcon icon={faLanguage} size="2x" />
              <span className="hide-on-small-only"> Language</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="container center">
        <h3>Please enter your patriarchal blessing information below.</h3>
        <BlessingForm />
      </div>
    </div>
  );
}

export default App;
