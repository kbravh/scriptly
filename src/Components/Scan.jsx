import React, { useState } from 'react'

import Amplify, { Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions'
Amplify.addPluggable(new AmazonAIPredictionsProvider())

function Scan(props) {
    const [response, setResponse] = useState("You can add a document by uploading direcly from the app ")

    function identifyFromFile(event) {
        setResponse('identifiying text...');
        const { target: { files } } = event;
        const [file,] = files || [];

        if (!file) {
            return;
        }
        Predictions.identify({
            text: {
                source: {
                    file,
                },
                format: "PLAIN", // Available options "PLAIN", "FORM", "TABLE", "ALL"
            }
        }).then(({ text: { fullText } }) => {
            setResponse(fullText)
        })
            .catch(err => setResponse(JSON.stringify(err, null, 2)))
    }

    return (
        <div className="Text">
            <div style={{ padding: 50 }}>
                <h3>Text identification</h3>
                <input type="file" onChange={identifyFromFile}></input>
                <p style={{
                    backgroundColor: 'black', color: 'white', padding: 20
                }}>{response}</p>
                <button className="waves-effect waves-light btn" onClick={() => { props.updateState('form') }}>{'Use scanned text'}</button>
            </div>
        </div>
    );
}

export default Scan