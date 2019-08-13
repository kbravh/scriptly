import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars } from '@fortawesome/free-solid-svg-icons';
import { faVenus } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar'
import Toggle from 'react-toggle';

import './BlessingForm.scss';

export default class BlessingForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blessingDate: new Date(),
      firstName: "",
      middleName: "",
      lastName: "",
      fatherName: "",
      motherName: "",
      patriarchName: "",
      stake: "",
      gender: 'Female',
      blessing: ''
    }
  }

  getParentage = () => {
    let parentage = ","
    let father = this.state.fatherName !== ""
    let mother = this.state.motherName !== ""
    let gender = this.state.gender === "Female" ? 'hija' : 'hijo'

    if (!father && !mother) {
      return ""
    }
    parentage += gender + " de "
    parentage += father && mother ? this.state.fatherName + " y " + this.state.motherName : this.state.fatherName + this.state.motherName
    return parentage
  }

  splitBlessing = () => {
    // trim off initial and final whitespace, make sure there are only single new lines between paragraphs
    let blessing = this.state.blessing.trim().replace(/\n+/g,'\n')
    // extract first letter
    let firstLetter = blessing.substr(0, 1)
    blessing = blessing.substring(1)
    // split the verses on new lines
    let verses = blessing.split('\n')
    // add verse numbers to all except first verse
    verses = verses.map((verse, i) => {
      if (i === 0) {
        return verse
      } else {
        return i + 1 + '. ' + verse
      }
    })
    return [firstLetter, verses];
  }

  getMemberName = () => {
    return this.state.gender == 'Female' ? ' la Hermana' : 'l Hermano'
  }

  handleBlessingDateChange = blessingDate => {
    this.setState({
      blessingDate
    })
  }
  handleGenderChange = e => {
    this.setState({
      gender: e.target.checked ? 'Male' : 'Female'
    })
  }

  //update the values on all the text fields
  handleInputChange = field => {
    this.setState({
      [field.target.name]: field.target.value
    });
  };

  handleSubmit = () => {
    let fullName = this.state.middleName ?
      `${this.state.firstName} ${this.state.middleName} ${this.state.lastName}` :
      `${this.state.firstName} ${this.state.lastName}`
    let parentage = this.getParentage()
    let [blessingFirstLetter, blessing] = this.splitBlessing()
    let memberName = this.getMemberName()
    // TODO - format date based on language
    // TODO - format member name based on language and gender

    //call out to API and return download link
    let packet = {
      fullName,
      parentage,
      blessingFirstLetter,
      blessing,
      motherName: this.state.motherName,
      fatherName: this.state.fatherName,
      patriarchName: this.state.patriarchName,
      stakeName: this.state.stake,
      firstName: this.state.firstName.toUpperCase(),
      memberName
    }
  }

  render() {
    return (
      <div className="row">
        <form className="col s11">
          <div className="row">

            <div className="input-field col s12 m4">
              <input id="firstName" name="firstName" type="text" onChange={this.handleInputChange} />
              <label htmlFor="firstName">First Name</label>
            </div>

            <div className="input-field col s12 m4">
              <input id="middleName" name="middleName" type="text" onChange={this.handleInputChange} />
              <label htmlFor="middleName">Middle Name</label>
            </div>

            <div className="input-field col s12 m4">
              <input id="lastName" name="lastName" type="text" onChange={this.handleInputChange} />
              <label htmlFor="lastName">Last Name</label>
            </div>

            <div className="col s12" id="blessing-date-title">
              Blessing Date
            </div>

            <div className="col s12">
              <div className="row">
                <Calendar value={this.state.blessingDate} onChange={this.handleBlessingDateChange} />
              </div>
            </div>

            <div className="input-field col s12">
              <input id="fatherName" name="fatherName" type="text" onChange={this.handleInputChange} />
              <label htmlFor="fatherName">Father's Full Name</label>
            </div>

            <div className="input-field col s12">
              <input id="motherName" name="motherName" type="text" onChange={this.handleInputChange} />
              <label htmlFor="motherName">Mother's Full Name</label>
            </div>

            <div className="input-field col s12">
              <input id="patriarchName" name="patriarchName" type="text" onChange={this.handleInputChange} />
              <label htmlFor="patriarchName">Patriarch's Full Name</label>
            </div>

            <div className="input-field col s12 m6">
              <input id="stake" name="stake" type="text" onChange={this.handleInputChange} />
              <label htmlFor="stake">Stake</label>
            </div>

            <div className="col s12 m6">
              <div className="grey-text">Gender</div>
              <label>
                <Toggle id="gender-toggle"
                  onChange={this.handleGenderChange}
                  icons={{
                    checked: <FontAwesomeIcon icon={faMars} color="white" />,
                    unchecked: <FontAwesomeIcon icon={faVenus} color="white" />
                  }} />
                <div>{this.state.gender}</div>
              </label>
            </div>

            <div className="input-field col s12">
              <textarea id="blessing" name="blessing" className="materialize-textarea" onChange={this.handleInputChange}></textarea>
              <label htmlFor="blessing">Blessing text</label>
              <span className="grey-text">Separate each paragraph with a new line.</span>
            </div>

          </div>
          <div className="row">
            <span className="blue-grey waves-effect waves-light btn col s12" onClick={this.handleSubmit}>Generate Document</span>
          </div>
        </form>
      </div>
    )
  }
}