import React, { Component } from "react";
import Spinner from './Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Calendar from 'react-calendar'
import Toggle from 'react-toggle';
import Axios from "axios";

import './BlessingForm.scss';
import Intro from "./Intro";
import Download from "./Download";

const moment = require("moment");

export default class BlessingForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blessingDate: new Date(),
      gender: "Female",
      downloadUrl: "",
      appState: 'intro'
    }
  }

  updateState = state => {
    this.setState({
      appState: state
    })
  }

  getParentage = (motherName, fatherName) => {
    let parentage = ","
    let father = fatherName !== ""
    let mother = motherName !== ""
    let gender = this.state.gender === "Female" ? ' daughter' : ' son'

    if (!father && !mother) {
      return ""
    }
    parentage += gender + " of "
    parentage += father && mother ? fatherName + " and " + motherName : fatherName + motherName
    return parentage
  }

  splitBlessing = (blessing) => {
    // trim off initial and final whitespace, and remove new lines
    let blessingTrimmed = blessing.trim().replace(/\n+/g, '')
    // extract first letter
    let firstLetter = blessingTrimmed.substr(0, 1)
    blessingTrimmed = blessingTrimmed.substring(1)
    // split the verses on periods
    let verses = blessingTrimmed.split('.')
    // remove the empty string at the end of the array
    verses.pop()
    // trim verse, add period, and add verse numbers to all except first verse
    verses = verses.map((verse, i) => {
      if (i === 0) {
        return verse.trim() + '.'
      } else {
        return i + 1 + '. ' + verse.trim() + '.'
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
    // set the app state to Loading
    this.setState({
      appState: 'loading'
    })

    let fullName = values.middleName ?
      `${values.firstName} ${values.middleName} ${values.lastName}` :
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

    try {
      //call out to API and return download link
      const response = await Axios.post(
        'https://api.restorerofpaths.com/patriarchal',
        packet,
        { headers: { 'Content-Type': 'application/json', 'x-api-key':'gKd0oWv9oa5sut9xpYQfJ5MwKk7ZHYsM9Iqn5HIB' } }
      )
      this.setState({
        appState: 'success'
      })
      let respBody = JSON.parse(response.data.body)
      this.setState({
        downloadUrl: respBody.Location
      })
    } catch (error) {
      this.setState({
        appState: 'error'
      })
      console.log(error)
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.appState === 'intro' &&
          <Intro updateState={this.updateState} />
        }
        {this.state.appState === 'loading' &&
          <Spinner />
        }
        {this.state.appState === 'error' &&
          <div className="errorBox z-depth-2" id="connectionError">
            <h4>Unfortunately, an error occurred. Please submit the form again or wait until later.</h4>
          </div>
        }
        {/* Show the form if the app is initially loaded */}
        {(this.state.appState === "form" || this.state.appState === "error" || this.state.appState === "loading") &&
          <div>
            <h3>Please enter your patriarchal blessing information below.</h3>
            <Formik
              initialValues={{
                firstName: '', middleName: '', lastName: '',
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
                  <div className="row">
                    <div className="col s12 m6" style={{ padding: 0 }}>
                      <Field type="text" name="firstName" placeholder="First Name" />
                      <ErrorMessage name="firstName" component="div" className="errorBox z-depth-2" />
                      <Field type="text" name="middleName" placeholder="Middle Name" />
                      <Field type="text" name="lastName" placeholder="Last Name" />
                      <ErrorMessage name="lastName" component="div" className="errorBox z-depth-2" />
                    </div>

                    <div className="col s12 m6" id="toggleBox">
                      <h6>Gender</h6>
                      <Toggle
                        defaultChecked={false}
                        onChange={this.handleGenderChange}
                        icons={{
                          checked: <FontAwesomeIcon icon={faMars} color="white" />,
                          unchecked: <FontAwesomeIcon icon={faVenus} color="white" />
                        }} />
                      <div>{this.state.gender}</div>
                    </div>
                  </div>
                  <div className="row">
                    <Field type="text" name="mother" placeholder="Mother's Full Name" />
                    <Field type="text" name="father" placeholder="Father's Full Name" />
                  </div>
                  <div className="row">
                    <Field type="text" name="patriarch" placeholder="Patriarch's Full Name" />
                    <ErrorMessage name="patriarch" component="div" className="errorBox z-depth-2" />
                    <Field type="text" name="stake" placeholder="Stake or District" />
                    <ErrorMessage name="stake" component="div" className="errorBox z-depth-2" />
                  </div>


                  <h5 id="blessing-date-title">Blessing Date</h5>
                  <div className="noticeBox"><FontAwesomeIcon icon={faStarOfLife} /> <span>Quick tip! You can quickly change the year and month on the calendar by clicking on the year in the top bar.</span></div>
                  <Calendar locale="en" value={this.state.blessingDate} onChange={this.handleCalendarChange} />
                  <div className="input-field">
                    <Field component="textarea" name="blessing" placeholder="Patriarchal Blessing" className="materialize-textarea" />
                    <ErrorMessage name="blessing" component="div" className="errorBox z-depth-2" />
                  </div>

                  <button className="waves-effect waves-light btn" type="submit" disabled={isSubmitting}>Generate Document</button>
                </Form>
              )}
            </Formik>
          </div>
        }

        {/* Show download button if URL was successfully retrieved */}
        {this.state.downloadUrl &&
          <Download downloadUrl={this.state.downloadUrl} />
        }
      </React.Fragment>
    )
  }
}