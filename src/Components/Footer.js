import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';


function Footer({ step, totalSteps, onPrevious, onNext, onHelp, reset, showExplanation }) {
    return (
        <div className='footer'>
            {step > 1 && (
                <button className="button-iconOnly prevButton" onClick={onPrevious}><FontAwesomeIcon icon={faArrowLeft} /></button>
            )}
            {(step > 1 && step < 5 && step !==2) && (
                <button className="textButton helpButton" onClick={onHelp}>✨ Help</button>

            )}

            {(step === 2 && !showExplanation) && (
                <button className="textButton helpButton" onClick={onHelp}>✨ Help</button>

            )}

            {step < (totalSteps) && (
                <button className="button-iconOnly nextButton" onClick={onNext}> <FontAwesomeIcon icon={faArrowRight} /></button>
            )}
            {step === 4 && (
                <button className="button-iconOnly nextButton" onClick={onNext}> <FontAwesomeIcon icon={faCheck} /></button>
            )}
            {step === 5 && (
                <button className="button-iconOnly nextButton" onClick={reset}> Challenge another thought<FontAwesomeIcon icon={faArrowRight} /></button>
            )}
        </div>
    );
}

export default Footer;

