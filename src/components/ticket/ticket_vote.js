import React, {useState} from 'react';
import { gql } from 'apollo-boost';
import { get } from 'lodash';
import { useMutation } from '@apollo/react-hooks';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import CreateEstimate from '../dialogs/create_estimate';
import EditEstimate from '../dialogs/edit_estimate';

const EDIT_ESTIMATE = gql`
  mutation updateEstimate($id: ID!, $voterId: ID, $ticketId: ID, $votingSessionId: ID, $point: Int){
    updateEstimate(input:{
      id: $id 
      voterId: $voterId, 
      ticketId: $ticketId, 
      votingSessionId: $votingSessionId, 
      point: $point 
      }){
      estimate{
        id
        point
      }
    }
  }
`

const TicketVote = ({voterId, estimates, ticket, showDialogue, handleSubmit, toggleShowDialogue, register, onSubmit}) => {

  const [ showEditDialogue, setShowEditDialogue ] = useState(false);
  const [ currentEstimateId, setCurrentEstimateId ] = useState(null);
  const [ editEstimate ] = useMutation(EDIT_ESTIMATE);
  
  const onEditSubmit = (variables) => {
    const mutationVariables = { 
      ...variables, 
      point: parseInt(variables.point), 
      voterId, 
      id: currentEstimateId
    };
    editEstimate({variables: mutationVariables}).then((data) => {
      if(!(get(data,'errors'))){
        toggleShowEditDialogue()
      }
    })
  }


  const toggleShowEditDialogue = (estimate) => {
    setShowEditDialogue(!showEditDialogue)
    setCurrentEstimateId(get(estimate,'id'))
  }

  return (
    <Card>
    <CardContent>
      <Typography gutterBottom>
        Ticket Name: {get(ticket, 'name')}
      </Typography>
    </CardContent>
    {estimates && estimates.filter((estimate) => (
      get(estimate,'ticketId') === get(ticket,'id'))).map((
        estimate, index) => (
        <Card key={index}>
          <CardContent>
            <Typography gutterBottom>
              Estimated Point: {get(estimate, 'point')}
            </Typography>
          </CardContent>
          <Button onClick={() => (toggleShowEditDialogue(estimate))}>Edit</Button>
          <EditEstimate
            text={`Please input the updated point for ${get(ticket,'name')}`}
            showDialogue={showEditDialogue}
            toggleShowDialogue={toggleShowEditDialogue}
            handleSubmit={handleSubmit}
            onSubmit={onEditSubmit}
            register={register}
          />
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