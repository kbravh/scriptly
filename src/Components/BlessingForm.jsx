import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars } from '@fortawesome/free-solid-svg-icons';
import { faVenus } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-date-picker';
import Toggle from 'react-toggle';

import * as pizzip from 'pizzip';
import * as docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

import './BlessingForm.scss';
const utils = require('pizzip/utils');

export default class BlessingForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blessingDate: new Date(),
      birthDate: new Date(),
      firstName: null,
      middleName: null,
      lastName: null,
      fatherName: null,
      motherName: null,
      patriarchName: null,
      stake: null,
      birthplace: null,
      gender: 'Female',
    }
  }

  handleBirthDateChange = birthDate => {
    this.setState({
      birthDate
    })
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
    let parentage = `, hijo de ${this.state.fatherName} y ${this.state.motherName}`

    utils.getBinaryContent('public/es.docx', (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data)
      let zip = new pizzip(data);
      zip.file("es.docx", data, {binary:true});
      let doc = new docxtemplater().loadZip(zip);

      doc.setData({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        patriarchName: this.state.patriarchName,
        fullName,
        parentage,
        blessingFirstLetter: 'K',
        blessing: this.state.blessing
      });
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
      }
      catch (error) {
        let e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        }
        console.log(JSON.stringify({ error: e }));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
      }
      let out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }) //Output the document using Data-URI
      saveAs(out, "output.docx")
    })
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
                <span className="col s12 m6">Birth Date</span>
                <DatePicker className="col s12 m6" value={this.state.birthDate} onChange={this.handleBirthDateChange} />
              </div>
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

            <span className="waves-effect waves-light btn" onClick={this.handleSubmit}>Generate Document</span>
          </div>
        </form>
        <div className="preview col s12 m4">I'm a preview</div>
      </div>
    )
  }
}