import React, { Suspense, Component } from 'react';
import ContentContainer from './Components/ContentContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Spinner from './Components/Spinner';
import LanguageDropdown from './Components/LanguageDropdown';
import './App.scss'


import { es } from "moment/locale/es";

const moment = require("moment");
// load locales
moment.locale('es', es)

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      locale: navigator.language
    }
    moment.locale(navigator.language)
  }

  handleLocaleChange = locale => {
    this.setState({
      locale
    })
    moment.locale(locale)
  }

  render() {
    return (
        <Suspense fallback={<Spinner />}>
          <div className="App">
            <nav>
              <div className="nav-wrapper">
                <a href="http://laborforzion.com" id="homeLogo" className="left"><FontAwesomeIcon icon={faHome} /></a>
                <div className="container">
                  <a href="/" className="brand-logo center hide-on-small-only"><FontAwesomeIcon icon={faBookOpen} /> Scriptly</a>
                  <a href="/" className="brand-logo center hide-on-med-and-up"><FontAwesomeIcon icon={faBookOpen} /></a>
                  <LanguageDropdown handleLocaleChange={this.handleLocaleChange} />
                </div>
              </div>
            </nav>

            <div className="container center">
              <ContentContainer locale={this.state.locale}/>
            </div>
          </div>
        </Suspense>
    );
  }
}
