import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { get } from 'lodash';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import CreateEstimate from '../dialogs/create_estimate';


const GET_VOTER_ESTIMATES_FOR_TICKET = gql`
  query getVoterEstimates($voterId: ID!, $ticketId: ID!){
    getVoterEstimates(voterId: $voterId, ticketId: $ticketId){
      point
    }
  }
`
const TicketVote = ({voterId, ticket, showDialogue, handleSubmit, toggleShowDialogue, register, onSubmit}) => {

  const { loading, data } = useQuery(GET_VOTER_ESTIMATES_FOR_TICKET,{
    variables: {
      voterId,
      ticketId: get(ticket, 'id')
    }
  })

  
  const estimates = get(data,'getVoterEstimates');

  return (
    <Card>
    <CardContent>
      <Typography gutterBottom>
        Ticket Name: {get(ticket, 'name')}
      </Typography>
    </CardContent>
    {loading && <h3>Loading ...</h3>}
    {data && 
      estimates.map((estimate, index) => (
        <Card key={index}>
          <CardContent>
            <Typography gutterBottom>
              Estimated Point: {get(estimate, 'point')}
            </Typography>
          </CardContent>
          <Button onClick={() => (console.log('edit is clicked'))}>Edit</Button>
        </Card>
      ))}
    <Button onClick={() => (toggleShowDialogue(ticket))}>Vote</Button>
    <CreateEstimate
      text={`Please input the point for ${get(ticket,'name')}`}
      showDialogue={showDialogue}
      toggleShowDialogue={toggleShowDialogue}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register}
    />
  </Card>
    );
}
 
export default TicketVote;