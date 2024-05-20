import React from 'react';
import summary from '../Img/summary.png'

function Summary({ reframeText, reset }) {


    return (

   

                <div className="summaryBox">
                    <img src={summary} className='summaryImg'></img>
                    <h2>{reframeText}</h2>
                </div>







    );
}


export default Summary;