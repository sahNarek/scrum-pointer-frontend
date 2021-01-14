import React, { useEffect } from 'react';
import { get } from 'lodash'
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

 
const GET_TICKET = gql`
  query ticket($id: ID!){
    ticket(id: $id){
      name
      estimates{
        point
        voterId
      }
    }
  }
`

const SUBSCRIBE_TO_ESTIMATES = gql`
  subscription($ticketId: ID!){
    estimateAddedToTicket(ticketId:$ticketId){
      point
      voterId
    }
  }
`


const Ticket = ( {match }) => {
  const { id } = match.params
  const { loading, data, subscribeToMore } = useQuery(GET_TICKET,{
    variables: {id: id }
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIBE_TO_ESTIMATES,
      variables: { ticketId: parseInt(id) },
      updateQuery(prev, { subscriptionData }) {
        if(subscriptionData){
          const { estimateAddedToTicket: newEstimate  } = get(subscriptionData, 'data')
          return {
            ticket: { ...prev.ticket, estimates:[...prev.ticket.estimates, newEstimate]}
          }
        }
        else{
          return prev
        }
      }
    }) 

    return () => unsubscribe()

  }, [id, data, loading, subscribeToMore])


  const estimates = (ticket) => (
    get(ticket, 'estimates').map((estimate, index) => (
      <Card key={index}>
        <CardContent>
          <Typography gutterBottom>
            Estimated Point: {get(estimate, 'point')}
          </Typography>
          <Typography gutterBottom>
            Estimated by: {get(estimate, 'voterId')}
          </Typography>
        </CardContent>
      </Card>
    ))
  )

  const ticket = get(data, 'ticket')

  return ( 
    <>
      <Typography variant="h1">{(get(data, 'ticket.name'))}</Typography>
      {loading &&     
      <Typography variant="h4">
          Loading
        <CircularProgress />
      </Typography>}
      {/* <ul>
        {ticket && get(ticket, 'estimates').map((estimate, index) => (
          <li key={index}>{get(estimate, 'point')} voted by: {get(estimate, 'voterId')}</li>
        ))}
      </ul> */}
      {ticket && estimates(ticket)}
    </>
    );
}
 
export default Ticket;