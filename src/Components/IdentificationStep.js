import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom } from '@fortawesome/free-solid-svg-icons';
import volcano from '../Img/volcano.png';
import sunImage from '../Img/disqualify.png';
import label from '../Img/label.png'
import overgen from '../Img/overgen.png'
import target from '../Img/target.png'
import ruler from '../Img/ruler.png'
import glasses from '../Img/glasses.png'
import brain from '../Img/brain.png'
import heart from '../Img/heart.png'
import gavel from '../Img/gavel.png'


function IdentificationStep({ isLoading, selectedDistortion, setSelectedDistortion, displayedDistortion, setDisplayedDistortion, identifiedDistortionResponse,explanation, showExplanation }) {
    console.log('selected',selectedDistortion,typeof(displayedDistortion))
    const distortions = [
        {
            name: "All-or-nothing thinking",
            description: "Viewing things in black-and-white categories.",
            iconLink: brain
        },
        {
            name: "Overgeneralization",
            description: "Generalizing from a single negative experience, expecting it to hold true forever.",
            iconLink: overgen
        },
        {
            name: "Mental filter",
            description: "Focus on the negative parts and ignore the positive ones",
            iconLink: glasses
        },
        {
            name: "Personalization",
            description: "Blaming ourselves for things that aren't our fault.",
            iconLink: heart
        },
        {
            name: "Catastrophizing",
            description: "Always thinking the worst case possible.",
            iconLink: volcano
        },
        {
            name: "Labeling",
            description: "Unfairly define yourself or others.",
            iconLink: label
        },
        {
            name: "Disqualifying the positive",
            description: "Inoring good things and only focusing on the bad.",
            iconLink: sunImage
        },

        {
            name: "Should statements",
            description: "The rules in our head saying things have to be a certain way",
            iconLink: ruler
        },
        {
            name: "Jumping to conclusions",
            description: "Deciding something is true without enough evidence",
            iconLink: target
        },
        {
            name: "Emotional reasoning",
            description: "Believing something is true just because we feel strongly about it.",
            iconLink: gavel
        },

    ];
    
    
    console.log('selectedDistortion', selectedDistortion);


    const isDistortionSelected = (distortion) => selectedDistortion.includes(distortion.name);

    const handleCardClick = (distortion) => {
        setSelectedDistortion(prev => {
            // Check if prev is a string
            if (typeof prev === 'string') {
                console.log('error')
                prev = prev.split(','); // Split into an array
            }
    
            const isAlreadySelected = prev.includes(distortion);
            if (isAlreadySelected) {
                return prev.filter(name => name !== distortion);
            } else {
                return [...prev, distortion];
            }
        });
    };

    const enrichDistortions = distortions.filter(dist => displayedDistortion.includes(dist.name))


    return (
        <div>
            <h1>Do any of these sound like you?</h1>
            <div className="interactionArea">
                <div className="distortedGroup">
                    {isLoading ? (
                        Array.from({ length: 3 }, (_, index) => (
                            <div key={index} className="optionBox shimmer"></div>
                        ))
                    ) : (
                        enrichDistortions.map(distortion => (
                            <div
                                key={distortion.name}
                                className={`optionBox ${isDistortionSelected(distortion) ? 'selected' : ''}`}
                                onClick={() => handleCardClick(distortion.name)}
                            >
                                <img src={distortion.iconLink} style={{ width: 40, height: 40 }} />
                                <div className='optionBoxText'>
                                    {distortion.name}
                                    <p>{distortion.description}</p>
                                </div>

                            </div>
                        ))
                    )}
                </div>

                {showExplanation ? (
                        <p style={{textAlign:'left'}}>{explanation}</p>
                    ):null}
            </div>
        </div>
    );
}

export default IdentificationStep;
