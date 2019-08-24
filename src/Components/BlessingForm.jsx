import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Calendar from 'react-calendar'
import Toggle from 'react-toggle';

const BlessingForm = props => {
  return (
    <div>
      <h3>Please enter your patriarchal blessing information below.</h3>
      <Formik
        initialValues={{
          firstName: '', middleName: '', lastName: '',
          mother: '', father: '',
          patriarch: '', stake: '', blessing: ''
        }}
        onSubmit={(values, { setSubmitting }) => {
          props.handleSubmit(values)
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
                  onChange={props.handleGenderChange}
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
            <Calendar locale="en" value={this.state.blessingDate} onChange={props.handleCalendarChange} />
            <div className="input-field">
              <Field component="textarea" name="blessing" placeholder="Patriarchal Blessing" className="materialize-textarea" />
              <ErrorMessage name="blessing" component="div" className="errorBox z-depth-2" />
            </div>

            <button className="waves-effect waves-light btn" type="submit" disabled={isSubmitting}>Generate Document</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default BlessingForm;