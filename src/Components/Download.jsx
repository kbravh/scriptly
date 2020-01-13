import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import './Download.scss';

const Download = props => {
    const { t } = useTranslation();

    return (
        <div className="downloadInfo">
            <h3>{t('Your document is complete')}</h3>
            <FontAwesomeIcon icon={faFileWord} size="3x" />
            <a
                className="waves-effect waves-light btn downloadButton"
                download
                href={props.docxDownloadUrl}>
                {t('Download Docx Document')}
            </a>
            <FontAwesomeIcon icon={faFilePdf} size="3x" />
            <a
                className="waves-effect waves-light btn downloadButton"
                download
                target="_blank"
                rel="noopener noreferrer"
                href={props.pdfDownloadUrl}>
                {t('Download PDF Document')}
            </a>
        </div>
    )
}

export default Download;