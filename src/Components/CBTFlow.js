import React, { useState, useEffect, useRef } from 'react';
import InputStep from './InputStep';
import IdentificationStep from './IdentificationStep';
import ChallengeStep from './ChallengeStep';
import ReframeStep from './ReframeStep';
import Footer from './Footer';
import Summary from './Summary';
import '../Styles/color.css'
import logo from '../logo.png'
const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;


function CBTFlow() {
    console.log('check if env is read properly',serverDomain)


    const [step, setStep] = useState(() => Number(sessionStorage.getItem('step')) || 1);
    //Users' original thoughts
    const [userInput, setUserInput] = useState(() => sessionStorage.getItem('userInput') || '');
    //reframed response from openai
    const [reframeResponse, setReframeResponse] = useState(() => sessionStorage.getItem('reframeResponse') || '');
    //rendered reframe text
    const [reframeText, setReframeText] = useState(() => sessionStorage.getItem('reframeText') || '');
    //selected distortion
    const [selectedDistortion, setSelectedDistortion] = useState(() => sessionStorage.getItem('selectedDistortion') || []);
    //selected distortion from openai
    const [identifiedDistortionResponse, setIdentifiedDistortionResponse] = useState(() => sessionStorage.getItem('identifiedDistortionResponse') || []);
    //rendenred challenge text
    const [challengeText, setChallengeText] = useState(() => sessionStorage.getItem('challengeText') || '');
    //rendered challenge text from openai
    const [challengeResponse, setChallengeResponse] = useState(() => sessionStorage.getItem('challengeResponse') || '');

    const [displayedDistortion, setDisplayedDistortion] = useState(() => sessionStorage.getItem('displayedDistortion') || '');

    const [explanation, setExplanation] = useState(() => sessionStorage.getItem('explanation') || '');
    const [showExplanation, setShowExplanation] = useState(() => sessionStorage.getItem('showExplanation') ||false);



    const [isLoading, setIsLoading] = useState(false);

    const totalSteps = 4;

    const helpIdentify = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${serverDomain}/api/helpIdentify`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ original_thought: userInput })
            });
            console.log('identify response: ', response);

            if (!response.ok) {
                throw new Error('Failed to request help from the backend');
            }

            const data = await response.json();
            console.log('identify data: ' + data.distortion);
            setIdentifiedDistortionResponse(data.distortions);
            setDisplayedDistortion(data.distortions)
            setExplanation(data.explanation)
            console.log('api distortions', data.distortions)



        } catch (error) {
            console.error('An error occurred:', error);
            setIdentifiedDistortionResponse('Error fetching response');
        }
        finally {
            setIsLoading(false);

        }
    };
    const helpChallenge = async () => {
        try {
            const response = await fetch(`${serverDomain}/api/helpChallenge`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ original_thought: userInput })
            });
            console.log('helpChallenge response: ', response);

            if (!response.ok) {
                throw new Error('Failed to request help from the backend');
            }

            const data = await response.json();
            console.log('challenge data: ', data);
            setChallengeResponse(data.challenge); // Set the reframe response
        } catch (error) {
            console.error('An error occurred:', error);
            setChallengeResponse('Error fetching response');
        }
    };

    const helpReframe = async () => {
        try {
            const response = await fetch(`${serverDomain}/api/helpReframe`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ original_thought: userInput })
            });
            console.log('helpReframe response: ', response);

            if (!response.ok) {
                throw new Error('Failed to request help from the backend');
            }

            const data = await response.json();
            setReframeResponse(data.generated_reframe); // Set the reframe response
        } catch (error) {
            console.error('An error occurred:', error);
            setReframeResponse('Error fetching response');
        }

    };



    const loadHelp = () => {
        if (step === 4) {
            setReframeText(reframeResponse);
            helpReframe();
        }
        else if (step === 2) {
            setIdentifiedDistortionResponse(identifiedDistortionResponse)
            setShowExplanation(true)
        }
        else if (step === 3) {
            setChallengeText(challengeResponse)
            helpChallenge()

        }
    }


    const previousUserInput = useRef(userInput);
    const nextStep = () => {
        if (step === 1 && userInput !== previousUserInput.current) {
            sessionStorage.setItem('userInput', userInput);
            helpIdentify()
            helpChallenge()
            helpReframe()
            setChallengeText("")
            setReframeText("")
            setSelectedDistortion([])
            setDisplayedDistortion([])
            setShowExplanation(false)
            
        }
        previousUserInput.current = userInput;
        setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };




    const reset = () => {
        setStep(1)
        setUserInput('')
        setReframeText('')
        setChallengeText('')
        setSelectedDistortion([])
        setShowExplanation(false)

    }


    useEffect(() => {
        sessionStorage.setItem('step', step);
    }, [step]);

    useEffect(() => {
        sessionStorage.setItem('userInput', userInput);
    }, [userInput]);


    useEffect(() => {
        sessionStorage.setItem('reframeText', reframeText);
    }, [reframeText]);

    useEffect(() => {
        sessionStorage.setItem('challengeText', challengeText);
    }, [challengeText]);

    useEffect(() => {
        sessionStorage.setItem('selectedDistortion', selectedDistortion);
    }, [selectedDistortion]);


    useEffect(() => {
        sessionStorage.setItem('displayedDistortion', displayedDistortion);
    }, [displayedDistortion]);




    const renderStep = () => {
        switch (step) {
            case 1:
                return <InputStep
                    userInput={userInput}
                    setUserInput={setUserInput} />;
            case 2:
                return <IdentificationStep
                    isLoading={isLoading}
                    selectedDistortion={selectedDistortion}
                    setSelectedDistortion={setSelectedDistortion}
                    displayedDistortion={displayedDistortion}
                    setDisplayedDistortion={setDisplayedDistortion}
                    identifiedDistortionResponse={identifiedDistortionResponse}
                    explanation={explanation}
                    showExplanation={showExplanation} />;
            case 3:
                return <ChallengeStep
                    challengeText={challengeText}
                    setChallengeText={setChallengeText} />;
            case 4:
                return <ReframeStep
                    reframeText={reframeText}
                    setReframeText={setReframeText} />;

            case 5:
                return <Summary
                    reframeText={reframeText}
                    reset={reset} />
            default:
                return null;
        }
    };

    const titleStyle = {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'var(--brown-020)',
        padding:'8px 16px',
        borderRadius:'8px',
        gap:'12px',
    }

    return (
        <div className='container'>
            <div style={titleStyle}><img src={logo} style={{width:'32px'}}/><p style={{fontWeight:'600'}}>Challenge My Negtiave Thoughts</p></div>
            {renderStep()}
            <Footer
                step={step}
                totalSteps={totalSteps}
                onPrevious={prevStep}
                onNext={nextStep}
                onHelp={loadHelp}
                showExplanation={showExplanation}
                reset={reset}
            />

        </div>
    );
}



export default CBTFlow;
