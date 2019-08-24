import React from 'react';
import DocPreview from "./DocPreview";
import { useTranslation } from 'react-i18next';

const styles = {
    docPreviewContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
}

const Intro = (props) => {
    // eslint-disable-next-line
    const { t, i18n } = useTranslation();

    return (
        <div style={styles.docPreviewContainer}>
            <h3>{t('Welcome to Scriptly!')}</h3>
            <h4>{t('Make your patriarchal blessing look like it was taken right out of the pages of the scriptures.')}</h4>
            <DocPreview />
            <button className="waves-effect waves-light btn" onClick={() => { props.updateState('form') }}>{t('Get Started')}</button>
        </div>
    )
}

export default Intro;