import React from 'react';
import { useTranslation } from 'react-i18next';

const ConnectionError = () => {
    // eslint-disable-next-line
    const { t, i18n } = useTranslation();

    return (
        <div className="errorBox z-depth-2" id="connectionError">
            <h4>{t('Unfortunately, an error occurred. Please submit the form again or wait until later.')}</h4>
        </div>
    )
}

export default ConnectionError;