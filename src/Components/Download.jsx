import React from 'react';

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
    return (
        <div style={styles.downloadInfo}>
            <h3>Your document is complete!</h3>
            <a
                className="waves-effect waves-light btn"
                style={styles.downloadButton}
                download
                href={props.downloadUrl}>
                Download Document
            </a>
        </div>
    )
}

export default Download;