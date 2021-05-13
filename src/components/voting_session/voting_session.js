import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import Pluralize from 'pluralize';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import TicketDialogue from '../../components/dialogs/create_ticket';
import Loading from '../../components/routing/loading';

const GET_VOTING_SESSION = gql`
  query votingSession($id: ID!){
    votingSession(id: $id){
      name
      votersCount
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

const SUBSCRIBE_TO_VOTING_SESSION = gql`
  subscription($votingSessionId: ID!){
    voterJoinedVotingSession(votingSessionId:$votingSessionId){
      name
      votersCount
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

const VotingSession = ({match}) => {
  const [ showForm, setShowForm ] = useState(false)
  const { id } = get(match, 'params')
  const { url } = match
  const { loading, data, subscribeToMore, refetch } = useQuery(GET_VOTING_SESSION,{
    variables: {id}
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIBE_TO_VOTING_SESSION,
      variables: { votingSessionId: parseInt(id) },
      updateQuery(prev, {subscriptionData}) {
        if(subscriptionData){
          const { voterJoinedVotingSession: newVotingSession } = get(subscriptionData, 'data')
          const updatedSession = {
            ...prev, votingSession: newVotingSession
          } 

          return updatedSession
        }
        else{
          return prev
        }
      }
    })

    return () => unsubscribe()
  }, [id, data, loading, subscribeToMore])

  const toggleShowForm = () => {
    setShowForm(!showForm)
  }

  const tickets = (votingSession) => (
    get(votingSession, 'tickets').map((ticket, index) => (
      <NavLink key={index} to={`${url}/ticket/${get(ticket,'id')}`}>
        <Card>
          <CardContent>
            <Typography gutterBottom>
              Ticket Name: {get(ticket, 'name')}
            </Typography>
          </CardContent>
        </Card>
      </NavLink>
    ))
  )
      
  return(
    <>
      {loading && <Loading/>}
      {!loading && 
      <>
        <Typography variant="h4">
          Session Name: {get(data, 'votingSession.name')}
        </Typography>
        <Typography variant="h6">
          {Pluralize('voter',get(data, 'votingSession.votersCount') || 0, true)} joined the session.
        </Typography>
        <Button onClick={toggleShowForm}>Create a Ticket</Button>
        <TicketDialogue showForm={showForm} toggleShowForm={toggleShowForm} refetch={refetch} votingSessionId={id}/>
        {get(data,'votingSession.tickets') && tickets(get(data, 'votingSession'))}
      </>}
    </>
  )
}
 
export default VotingSession;