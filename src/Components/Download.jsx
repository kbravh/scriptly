import React from 'react';
import {useTranslation} from 'react-i18next';

const styles = {
    downloadInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    downloadButton: {
        marginTop: "30px"
    }
}

const Download = props => {
    // eslint-disable-next-line
    const { t, i18n } = useTranslation();

    return (
        <div style={styles.downloadInfo}>
            <h3>{t('Your document is complete')}</h3>
            <a
                className="waves-effect waves-light btn"
                style={styles.downloadButton}
                download
                href={props.docxDownloadUrl}>
                {t('Download Docx Document')}
            </a>
            <a
                className="waves-effect waves-light btn"
                style={styles.downloadButton}
                download
                href={props.pdfDownloadUrl}>
                {t('Download PDF Document')}
            </a>
        </div>
    )
}

export default Download;