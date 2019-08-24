import React, { Component } from "react";
import Spinner from './Spinner';
import Axios from "axios";

import './ContentContainer.scss';
import Intro from "./Intro";
import Download from "./Download";
import ConnectionError from "./ConnectionError";

const moment = require("moment");

export default class ContentContainer extends Component {
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
    console.info('State:', state)
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
        { headers: { 'Content-Type': 'application/json', 'x-api-key': 'gKd0oWv9oa5sut9xpYQfJ5MwKk7ZHYsM9Iqn5HIB' } }
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
        {this.state.appState === 'intro' && <Intro updateState={this.updateState} /> }
        {this.state.appState === 'loading' && <Spinner /> }
        {this.state.appState === 'error' && <ConnectionError /> }
        {/* Show the form if the app is initially loaded */}
        {(this.state.appState === "form" || this.state.appState === "error" || this.state.appState === "loading") &&
          <ContentContainer
            handleSubmit={this.handleSubmit}
            handleGenderChange={this.handleGenderChange}
            gender={this.state.gender}
            handleCalendarChange={this.handleCalendarChange}
            blessingDate={this.state.blessingDate}
          />
        }
        {/* Show download button if URL was successfully retrieved */}
        {this.state.downloadUrl && <Download downloadUrl={this.state.downloadUrl} /> }
      </React.Fragment>
    )
  }
}