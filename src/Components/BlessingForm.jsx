import React, { Component } from "react";

export default class BlessingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            blessingDate: null,
            birthDate: null,
            firstName: null,
            middleName: null,
            lastName: null,
            fatherName: null,
            motherName: null,
            patriarchName: null,
            stake: null,
            birthplace: null,
            gender: null,
        }
    }

    render() {
        return (
            <div>I'm a form</div>
        )
    }
}