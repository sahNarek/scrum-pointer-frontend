import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Loading from '../../components/routing/loading';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


const GET_VOTING_SESSION = gql`
  query votingSession($id: ID!){
    votingSession(id: $id){
      name
      tickets{
        id
        name
      }
      voters{
        name
      }
      active
      votingDuration
    }
  }
`

const CREATE_ESTIMATE = gql`
  mutation createEstimate($voterId: ID!, $ticketId: ID!, $votingSessionId: ID!, $point: Int!){
    createEstimate(input:{ 
      voterId: $voterId, 
      ticketId: $ticketId, 
      votingSessionId: $votingSessionId, 
      point: $point 
      }){
      estimate{
        point
      }
    }
  }
`

const SUBSCRIBE_TO_TICKETS = gql`
  subscription($votingSessionId: ID!){
    ticketAddedToVotingSession(votingSessionId:$votingSessionId){
      id
      name
    }
  }
`

const VoterPage = ({ location }) => {
  const { state } = location;
  const { voter } = state;
  const { votingSessionId, id } = voter;
  const { loading, data, subscribeToMore } = useQuery(GET_VOTING_SESSION,{
    variables: {id: votingSessionId}
  });

  const { register, handleSubmit } = useForm();
  const [ showDialogue, setShowDialogue ] = useState(false);
  const [ createEstimate ] = useMutation(CREATE_ESTIMATE);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIBE_TO_TICKETS,
      variables: { votingSessionId: parseInt(votingSessionId)},
      updateQuery(prev, {subscriptionData}) {
        if(subscriptionData){
          const { ticketAddedToVotingSession: newTicket } = get(subscriptionData, 'data')
          console.log([...prev.votingSession.tickets, newTicket])
          return {
            votingSession: {...prev.votingSession, tickets: [...prev.votingSession.tickets, newTicket] }
          }
        }
        else{
          return prev
        }
      }
    })

    return () => unsubscribe()

  },[votingSessionId, data, loading, subscribeToMore])

  const toggleShowDialogue = () => {
    setShowDialogue(!showDialogue)
  }

  const onSubmit = (variables) => {
    console.log("variables" , variables);
    const mutationVariables = { ...variables, point: parseInt(variables.point), votingSessionId, voterId: id };
    createEstimate({variables: mutationVariables}).then((data) => {
      if(!(get(data,'errors'))){
        toggleShowDialogue()
      }
    })
  }


  const tickets = (votingSession) => (
    get(votingSession, 'tickets').map((ticket, index) => (
      <Card key={index}>
        <CardContent>
          <Typography gutterBottom>
            Ticket Name: {get(ticket, 'name')}
          </Typography>
        </CardContent>
        <Button onClick={() => (toggleShowDialogue())}>Vote</Button>
        <Dialog open={showDialogue} onClose={() => (toggleShowDialogue())} aria-labelledby="form-dialog-title">
            <form onSubmit={handleSubmit((variables) => 
              onSubmit({...variables, ticketId: get(ticket, 'id')}))}>
              <DialogContent>
                <DialogContentText>
                  Please input your estimate for the ticket.
                </DialogContentText>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField 
                          fullWidth 
                          label="Point" 
                          name="point" 
                          size="small" 
                          variant="filled" 
                          inputRef={register({required: true})}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
                <DialogActions>
                  <Button type="submit" ref={register} color="primary">
                    Estimate
                  </Button>
                  <Button onClick={() => (toggleShowDialogue())} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
        </form>
        </Dialog>
      </Card>
    ))
  )

  return (
    <>
      <h1>Hi {get(voter, 'name')}</h1>
      {loading && <Loading/>}
        {!loading && 
        <>
          <Typography variant="h4">
            Session Name: {get(data, 'votingSession.name')}
          </Typography>
          {get(data,'votingSession.tickets') && tickets(get(data, 'votingSession'))}
        </>}
    </>
  );
}
 
export default VoterPage;