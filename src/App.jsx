import React from 'react';
import BlessingForm from './Components/BlessingForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
// import { faLanguage } from '@fortawesome/free-solid-svg-icons';

import './App.scss'

import { es } from "moment/locale/es";
const moment = require("moment");

// load locales
moment.locale('es', es)

function App() {
  // update this locale using hook
  moment.locale('en')
  return (
    <div className="App">
      <nav>
        <div className="nav-wrapper">
          <a href="http://restorerofpaths.com" id="homeLogo" className="left"><FontAwesomeIcon icon={faHome} /></a>
          <div className="container">
            <a href="/" className="brand-logo center hide-on-small-only"><FontAwesomeIcon icon={faBookOpen} /> Scriptly</a>
            <a href="/" className="brand-logo center hide-on-med-and-up"><FontAwesomeIcon icon={faBookOpen} /></a>
            {/* <span className="sidenav-trigger right" data-target="language-menu">
              <FontAwesomeIcon icon={faLanguage} size="2x" />
              <span className="hide-on-small-only"> Language</span>
            </span> */}
          </div>
        </div>
      </nav>

      <div className="container center">
        <BlessingForm />
      </div>
    </div>
  );
}

export default App;
