import React, { Suspense } from 'react';
import ContentContainer from './Components/ContentContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Spinner from './Components/Spinner';

import './App.scss'

import { es } from "moment/locale/es";
import LanguageDropdown from './Components/LanguageDropdown';
const moment = require("moment");

// load locales
moment.locale('es', es)

const App = () => {

  const handleLocaleChange = locale => {
    //update context
    moment.locale(locale)
  }
  // update this locale using hook
  moment.locale('en')
  return (
    <Suspense fallback={<Spinner />}>
      <div className="App">
        <nav>
          <div className="nav-wrapper">
            <a href="http://restorerofpaths.com" id="homeLogo" className="left"><FontAwesomeIcon icon={faHome} /></a>
            <div className="container">
              <a href="/" className="brand-logo center hide-on-small-only"><FontAwesomeIcon icon={faBookOpen} /> Scriptly</a>
              <a href="/" className="brand-logo center hide-on-med-and-up"><FontAwesomeIcon icon={faBookOpen} /></a>
              <LanguageDropdown handleLocaleChange={handleLocaleChange} />
            </div>
          </div>
        </nav>

        <div className="container center">
          <ContentContainer />
        </div>
      </div>
    </Suspense>
  );
}

export default App;
