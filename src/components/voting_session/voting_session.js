import React, { useState } from 'react';
import { get } from 'lodash';
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
  const { loading, data, refetch } = useQuery(GET_VOTING_SESSION,{
    variables: {id}
  });

  const toggleShowForm = () => {
    setShowForm(!showForm)
  }

  const tickets = (votingSession) => (
    get(votingSession, 'tickets').map((ticket, index) => (
      <NavLink key={index} to={`/ticket/${get(ticket,'id')}`}>
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
      <Typography variant="h4">
        Session Name: {get(data, 'votingSession.name')}
      </Typography>
      <Button onClick={toggleShowForm}>Create a Ticket</Button>
      <TicketDialogue showForm={showForm} toggleShowForm={toggleShowForm} refetch={refetch} votingSessionId={id}/>
      {get(data,'votingSession.tickets') && tickets(get(data, 'votingSession'))}
    </>
  )
}
 
export default VotingSession;