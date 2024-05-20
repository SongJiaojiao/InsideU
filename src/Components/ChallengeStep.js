import React from 'react';

function ChallengeStep({ challengeText, setChallengeText }) {


    return (
        <div>
            <h1>Let's challenge this thought</h1>
            <div className="interactionArea">
                <textarea
                    autoFocus
                    className="textArea"
                    value={challengeText}
                    onChange={(e) => setChallengeText(e.target.value)}
                    placeholder="What evidence do I have that this thought is true? What are some less extreme outcomes?"

                />
            </div>

        </div>
    );
}

export default ChallengeStep;
