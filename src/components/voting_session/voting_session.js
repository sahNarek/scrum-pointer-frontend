import React from 'react';
import { get } from 'lodash';

const VotingSession = ({session}) => {
  return ( 
    <>
      <div>
        <h4>Name: {get(session, 'name')}</h4>
        <h5>Duration for each vote: {get(session, 'votingDuration')}</h5>
        <hr></hr>
      </div>
    </>
   );
}
 
export default VotingSession;