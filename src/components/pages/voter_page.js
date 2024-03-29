import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import Loading from '../../components/routing/loading';
import TicketVote from '../../components/ticket/ticket_vote';

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
        id
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
  const history = useHistory();
  const { state } = location;
  const { voter } = state;
  const { votingSessionId, id } = voter;
  const { loading, data, subscribeToMore } = useQuery(GET_VOTING_SESSION,{
    variables: {id: votingSessionId}
  });

  const { register, handleSubmit } = useForm();
  const [ showDialogue, setShowDialogue ] = useState(false);
  const [ currentTicket, setcurrentTicket ] = useState(null);
  const [ createEstimate ] = useMutation(CREATE_ESTIMATE);

  const exitHandler = (history) => {
    localStorage.removeItem('VOTER-TOKEN')
    history.push('/home')
  }

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIBE_TO_TICKETS,
      variables: { votingSessionId: parseInt(votingSessionId)},
      updateQuery(prev, {subscriptionData}) {
        if(subscriptionData){
          const { ticketAddedToVotingSession: newTicket } = get(subscriptionData, 'data')
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

  const toggleShowDialogue = (ticket) => {
    setShowDialogue(!showDialogue)
    if(typeof ticket !== 'undefined'){
      setcurrentTicket(ticket)
    }
  }

  const onSubmit = (variables, refetch) => {
    const mutationVariables = { 
      ...variables, 
      point: parseInt(variables.point), 
      votingSessionId, 
      voterId: id, 
      ticketId: get(currentTicket,'id') 
    };
    createEstimate({variables: mutationVariables}).then((data) => {
      if(!(get(data,'errors'))){
        toggleShowDialogue()
        refetch()
      }
    })
  }


  const tickets = (votingSession) => (
    get(votingSession, 'tickets').map((ticket, index) => (
      <TicketVote
        voterId={get(voter,'id')}
        key={index} 
        ticket={ticket} 
        handleSubmit={handleSubmit} 
        showDialogue={showDialogue} 
        toggleShowDialogue={toggleShowDialogue}
        register={register}
        onSubmit={onSubmit}
        currentTicket={currentTicket}
        />
    ))
  )

  return (
    <>
      <Typography variant="h1">Hi {get(voter, 'name')}</Typography>
      <Button onClick={() => (exitHandler(history))}>Leave</Button>
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