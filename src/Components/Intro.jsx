import React from 'react';
import DocPreview from "./DocPreview";

const styles = {
    docPreviewContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
}

const Intro = (props) => {
    return (
        <div style={styles.docPreviewContainer}>
            <h3>Welcome to Scriptly!</h3>
            <h4>Make your patriarchal blessing look like it was taken right out of the pages of the scriptures.</h4>
            <DocPreview />
            <button className="waves-effect waves-light btn" onClick={() => { props.updateState('form') }}>Get Started</button>
        </div>
    )
}

export default Intro;