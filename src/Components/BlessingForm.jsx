import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars } from '@fortawesome/free-solid-svg-icons';
import { faVenus } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Calendar from 'react-calendar'
import Toggle from 'react-toggle';
import Axios from "axios";

import './BlessingForm.scss';

const moment = require("moment");

export default class BlessingForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blessingDate: new Date(),
      gender: "Female",
      downloadUrl: ""
    }
  }

  getParentage = (motherName, fatherName) => {
    let parentage = ","
    let father = fatherName !== ""
    let mother = motherName !== ""
    let gender = this.state.gender === "Female" ? 'daughter' : 'son'

    if (!father && !mother) {
      return ""
    }
    parentage += gender + " of "
    parentage += father && mother ? fatherName + " y " + motherName : fatherName + motherName
    return parentage
  }

  splitBlessing = (blessing) => {
    // trim off initial and final whitespace, make sure there are only single new lines between paragraphs
    let blessingTrimmed = blessing.trim().replace(/\n+/g, '\n')
    // extract first letter
    let firstLetter = blessingTrimmed.substr(0, 1)
    blessingTrimmed = blessingTrimmed.substring(1)
    // split the verses on new lines
    let verses = blessingTrimmed.split('\n')
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
    return this.state.gender === 'Female' ? ' Sister' : ' Brother'
  }

  formatDate = () => {
    // moment.js date object
    let dateWrapper = moment(this.state.blessingDate)
    return dateWrapper.format('LL')
  }

  handleCalendarChange = blessingDate => {
    this.setState({
      blessingDate
    })
  }
  handleGenderChange = e => {
    this.setState({
      gender: e.target.checked ? 'Male' : 'Female'
    })
  }
  handleSubmit = async (values) => {
    let fullName = values.middleName ?
      `${values.firstName} ${values.middle} ${values.lastName}` :
      `${values.firstName} ${values.lastName}`

    let parentage = this.getParentage(values.mother, values.father)

    let [blessingFirstLetter, blessing] = this.splitBlessing(values.blessing)

    let memberTitle = this.getMemberName()

    let dateString = this.formatDate()

    let packet = {
      firstName: values.firstName.toUpperCase(),
      lastName: values.lastName,
      fullName,
      patriarch: values.patriarch,
      stake: values.stake,
      parentage,
      blessingFirstLetter,
      blessing,
      memberTitle,
      blessingDate: dateString,
      template: 'en'
    }

    //call out to API and return download link
    const response = await Axios.post(
      'https://api.restorerofpaths.com/patriarchal',
      packet,
      { headers: { 'Content-Type': 'application/json' } }
    )

    let respBody = JSON.parse(response.data.body)
    this.setState({
      downloadUrl: respBody.Location
    })
  }

  render() {
    return (
      <div className="row">
        <Formik
          initialValues={{
            firstName: '', middle: '', lastName: '',
            mother: '', father: '',
            patriarch: '', stake: '', blessing: ''
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.handleSubmit(values)
            setSubmitting(false)
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required("This field is required"),
            lastName: Yup.string().required("This field is required"),
            patriarch: Yup.string().required("This field is required"),
            stake: Yup.string().required("This field is required"),
            blessing: Yup.string().required("This field is required")
          })}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="text" name="firstName" placeholder="First Name" />
              <ErrorMessage name="firstName" component="div" />
              <Field type="text" name="middle" placeholder="Middle Name" />
              <Field type="text" name="lastName" placeholder="Last Name" />
              <ErrorMessage name="lastName" component="div" />
              <div id="blessing-date-title">Blessing Date</div>
              <Calendar locale="en" value={this.state.blessingDate} onChange={this.handleCalendarChange} />
              <Field type="text" name="mother" placeholder="Mother's Full Name" />
              <Field type="text" name="father" placeholder="Father's Full Name" />
              <Field type="text" name="patriarch" placeholder="Patriarch's Full Name" />
              <ErrorMessage name="patriarch" component="div" />
              <Field type="text" name="stake" placeholder="Stake" />
              <ErrorMessage name="stake" component="div" />

              <div className="grey-text">Gender</div>
              <Toggle
                defaultChecked={false}
                onChange={this.handleGenderChange}
                icons={{
                  checked: <FontAwesomeIcon icon={faMars} color="white" />,
                  unchecked: <FontAwesomeIcon icon={faVenus} color="white" />
                }} />
              <div>{this.state.gender}</div>

              <Field component="textarea" name="blessing" placeholder="Patriarchal Blessing" />
              <ErrorMessage name="blessing" component="div" />
              <button className="waves-effect waves-light btn blue-grey" type="submit" disabled={isSubmitting}>Generate Document</button>
              {this.state.downloadUrl &&
                <a
                  className="waves-effect waves-light btn blue-grey"
                  href={this.state.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer">
                  Download Document
                </a>
              }
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}