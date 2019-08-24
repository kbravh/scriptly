import React, { Component } from 'react';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import './LanguageDropdown.scss';

const languageList = [
    {
        title: 'English',
        key: 'en'
    },
    {
        title: 'Spanish',
        key: 'es'
    }
]

//TODO - refactor to be a function component with useState hook
class LanguageDropdownClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isToggleOpen: false
        }
    }

    handleClickOutside = evt => {
        this.setState({
            isToggleOpen: false
        });
    }

    toggleDropdown = () => {
        this.setState(prevState => {
            return {
                isToggleOpen: !prevState.isToggleOpen
            }
        })
    }

    handleLocaleChange = locale => {
        this.toggleDropdown();
        this.props.handleLocaleChange(locale);

    }

    render() {
        const { t, i18n } = this.props;
        return (
            <div className="dropdown-wrapper right">
                <div className="dropdown-header" onClick={this.toggleDropdown}>
                    <FontAwesomeIcon icon={faLanguage} size="2x" className="language-icon" />
                    <div className="hide-on-med-and-down">{t('Language')}</div>
                </div>
                {this.state.isToggleOpen &&
                    <ul className="dropdown-list">
                        {languageList.map(language => (
                            <li className="dropdown-item" key={language.key} onClick={() => { this.handleLocaleChange(language.key); i18n.changeLanguage(language.key); }}>{t(language.title)}</li>
                        ))}
                    </ul>
                }
            </div>
        )
    }
}

const LanguageDropdown = withTranslation()(onClickOutside(LanguageDropdownClass))
export default LanguageDropdown