import React, { Component } from "react";
import Spinner from './Spinner';
import Axios from "axios";

import './ContentContainer.scss';
import Intro from "./Intro";
import Download from "./Download";
import BlessingForm from "./BlessingForm";
import ConnectionError from "./ConnectionError";
import { withTranslation } from "react-i18next";

const moment = require("moment");

class ContentContainerClass extends Component {
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
    const { t } = this.props;
    let parentage = ","
    let father = fatherName !== ""
    let mother = motherName !== ""
    let gender = this.state.gender === "Female" ? t(' daughter') : t(' son')

    if (!father && !mother) {
      return ""
    }
    parentage += gender + t(' of ')
    parentage += father && mother ? fatherName + t(' and ') + motherName : fatherName + motherName
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
    const { t } = this.props;
    return this.state.gender === 'Female' ? t(' Sister') : t(' Brother')
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

    //TODO - Update template based on language chosen
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
        {this.state.appState === 'intro' && <Intro updateState={this.updateState} />}
        {this.state.appState === 'loading' && <Spinner />}
        {this.state.appState === 'error' && <ConnectionError />}
        {/* Show the form if the app is initially loaded */}
        {(this.state.appState === "form" || this.state.appState === "error" || this.state.appState === "loading") &&
          <BlessingForm
            locale={this.props.locale}
            handleSubmit={this.handleSubmit}
            handleGenderChange={this.handleGenderChange}
            gender={this.state.gender}
            handleCalendarChange={this.handleCalendarChange}
            blessingDate={this.state.blessingDate}
          />
        }
        {/* Show download button if URL was successfully retrieved */}
        {this.state.downloadUrl && <Download downloadUrl={this.state.downloadUrl} />}
      </React.Fragment>
    )
  }
}

const ContentContainer = withTranslation()(ContentContainerClass);
export default ContentContainer