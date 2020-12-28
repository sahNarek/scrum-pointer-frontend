import React from 'react';
import { get } from 'lodash'
 
const Ticket = ({ticket}) => {
  return ( 
    <>
      <h1>{get(ticket, 'name')}</h1>
      <ul>
        {get(ticket, 'estimates').map((estimate, index) => (
          <li key={index}>{get(estimate, 'point')}</li>
        ))}
      </ul>
    </>
    );
}
 
export default Ticket;