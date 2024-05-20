import React from 'react';

//This component renders the reframeText. 
function ReframeStep({ reframeText, setReframeText }) {

    return (
        <div>
            <h1>Last..let's reframe this thought</h1>
            <div className="interactionArea">
                <textarea
                    autoFocus
                    className="textArea"
                    value={reframeText}
                    onChange={(e) => setReframeText(e.target.value)}
                    placeholder="Enter your reframed thought here..."
                />
            </div>

        </div>
    );
}

export default ReframeStep;
