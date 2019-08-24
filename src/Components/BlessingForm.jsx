import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Calendar from 'react-calendar'
import Toggle from 'react-toggle';

const BlessingForm = props => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t('Please enter your patriarchal blessing information below')}</h3>
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
          firstName: Yup.string().required(t('This field is required')),
          lastName: Yup.string().required(t('This field is required')),
          patriarch: Yup.string().required(t('This field is required')),
          stake: Yup.string().required(t('This field is required')),
          blessing: Yup.string().required(t('This field is required'))
        })}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="row">
              <div className="col s12 m6" style={{ padding: 0 }}>
                <Field type="text" name="firstName" placeholder={t('First Name')} />
                <ErrorMessage name="firstName" component="div" className="errorBox z-depth-2" />
                <Field type="text" name="middleName" placeholder={t('Middle Name')} />
                <Field type="text" name="lastName" placeholder={t('Last Name')} />
                <ErrorMessage name="lastName" component="div" className="errorBox z-depth-2" />
              </div>

              <div className="col s12 m6" id="toggleBox">
                <h6>{t('Gender')}</h6>
                <Toggle
                  defaultChecked={false}
                  onChange={props.handleGenderChange}
                  icons={{
                    checked: <FontAwesomeIcon icon={faMars} color="white" />,
                    unchecked: <FontAwesomeIcon icon={faVenus} color="white" />
                  }} />
                <div>{t(props.gender)}</div>
              </div>
            </div>
            <div className="row">
              <Field type="text" name="mother" placeholder={t('Mother\'s Full Name')} />
              <Field type="text" name="father" placeholder={t('Father\'s Full Name')} />
            </div>
            <div className="row">
              <Field type="text" name="patriarch" placeholder={t('Patriarch\'s Full Name')} />
              <ErrorMessage name="patriarch" component="div" className="errorBox z-depth-2" />
              <Field type="text" name="stake" placeholder={t('Stake or District')} />
              <ErrorMessage name="stake" component="div" className="errorBox z-depth-2" />
            </div>


            <h5 id="blessing-date-title">{t('Blessing Date')}</h5>
            <div className="noticeBox"><FontAwesomeIcon icon={faStarOfLife} /> <span>{t('Quick tip')}</span></div>
            <Calendar locale={props.locale} value={props.blessingDate} onChange={props.handleCalendarChange} />
            <div className="input-field">
              <Field component="textarea" name="blessing" placeholder={t('Patriarchal Blessing')} className="materialize-textarea" />
              <ErrorMessage name="blessing" component="div" className="errorBox z-depth-2" />
            </div>

            <button className="waves-effect waves-light btn" type="submit" disabled={isSubmitting}>{t('Generate Document')}</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default BlessingForm;