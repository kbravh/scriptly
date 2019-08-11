import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars } from '@fortawesome/free-solid-svg-icons';
import { faVenus } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-date-picker';
import Toggle from 'react-toggle';

import './BlessingForm.scss';

export default class BlessingForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blessingDate: new Date(),
      firstName: null,
      middleName: null,
      lastName: null,
      fatherName: null,
      motherName: null,
      patriarchName: null,
      stake: null,
      birthplace: null,
      gender: 'Female',
      blessing: ''
    }
  }

  getParentage = () => {
    let parentage = ","
    let father = this.state.fatherName != null && this.state.fatherName !== ""
    let mother = this.state.motherName != null && this.state.motherName !== ""
    let gender = this.state.gender === "Female" ? 'hija' : 'hijo'

    if (!father && !mother) {
      return ""
    }
    parentage += gender + "de "
    parentage += father && mother ? this.state.fatherName + "y " + this.state.motherName : this.state.fatherName + this.state.motherName
    return parentage
  }

  splitBlessing = () => {
    // split the verses on new lines
    let verses = this.state.blessing.split('\n')
    // add verse numbers to all except first verse
    verses = verses.map((verse, i) => {
      if (i === 0) {
        return verse
      } else {
        return i + 1 + '. ' + verse
      }
    })
    return verses;
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
    let fullName = this.state.firstName + this.state.middleName + this.state.lastName
    let parentage = this.getParentage()
    let blessing = this.splitBlessing()

    //call out to API and return download link
  }

  render() {
    return (
      <div className="row">
        <form className="col s12 m8">
          <div className="row">

            <div className="input-field col s12 m4">
              <input placeholder="First Name" id="firstName" name="firstName" type="text" />
              <label htmlFor="firstName">First Name</label>
            </div>

            <div className="input-field col s12 m4">
              <input placeholder="Middle Name" id="middleName" name="middleName" type="text" />
              <label htmlFor="middleName">Middle Name</label>
            </div>

            <div className="input-field col s12 m4">
              <input placeholder="Last Name" id="lastName" name="lastName" type="text" />
              <label htmlFor="lastName">Last Name</label>
            </div>

            <div className="col s12 m6">
              <div className="row">
                <span className="col s12 m6">Blessing Date</span>
                <DatePicker className="col s12 m6" value={this.state.blessingDate} onChange={this.handleBlessingDateChange} />
              </div>
            </div>

            <div className="input-field col s12 m6">
              <input placeholder="Father's Full Name" id="fatherName" name="fatherName" type="text" />
              <label htmlFor="fatherName">Father's Full Name</label>
            </div>

            <div className="input-field col s12 m6">
              <input placeholder="Mother's Full Name" id="motherName" name="motherName" type="text" />
              <label htmlFor="motherName">Mother's Full Name</label>
            </div>

            <div className="input-field col s12 m6">
              <input placeholder="Patriarch's Full Name" id="patriarchName" name="patriarchName" type="text" />
              <label htmlFor="patriarchName">Patriarch's Full Name</label>
            </div>

            <div className="input-field col s12 m6">
              <input placeholder="Stake" id="stake" name="stake" type="text" />
              <label htmlFor="stake">Stake</label>
            </div>

            <div className="input-field col s12 m6">
              <input placeholder="Birthplace" id="birthplace" name="birthplace" type="text" />
              <label htmlFor="birthplace">Birthplace</label>
            </div>

            <div className="col s6">
              <label>
                <Toggle id="gender-toggle"
                  onChange={this.handleGenderChange}
                  icons={{
                    checked: <FontAwesomeIcon icon={faMars} color="white" />,
                    unchecked: <FontAwesomeIcon icon={faVenus} color="white" />
                  }} />
                <span>{this.state.gender}</span>
              </label>
            </div>

            <div className="input-field col s12">
              <textarea id="blessing" className="materialize-textarea" onChange={this.handleInputChange}></textarea>
              <label htmlFor="blessing">Blessing text. Separate each paragraph with a new line.</label>
            </div>

            <span className="waves-effect waves-light btn" onClick={this.handleSubmit}>Generate Document</span>
          </div>
        </form>
        <div className="preview col s12 m4">I'm a preview</div>
      </div>
    )
  }
}