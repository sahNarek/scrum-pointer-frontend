import React, { useEffect } from 'react';
import { get } from 'lodash'
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Loading from '../../components/routing/loading';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const GET_TICKET = gql`
  query ticket($id: ID!){
    ticket(id: $id){
      id
      name
      estimates{
        id
        point
        voterId
        finalEstimate
        voter{
          id
          name
        }
      }
    }
  }
`

const EXPOSE_ALL_VOTES = gql`
  mutation exposeAllVotes($ticketId: ID!, $revoting: Boolean){
    exposeAllVotes(input:{ticketId: $ticketId, revoting: $revoting}){
      ticket{
        id
        name
        estimates{
          id
          point
          voterId
          finalEstimate
          voter{
            id
            name
          }
        }
      }
    }
  }
`

const SUBSCRIBE_TO_ESTIMATES = gql`
  subscription($ticketId: ID!){
    estimateAddedToTicket(ticketId:$ticketId){
      id
      point
      finalEstimate
      voter{
        id
        name
      }
      voterId
    }
  }
`

// TODO! handle with backend later

const pickCorrectEstimates = (estimates, newEstimate) => {
  const filteredeEstimates = estimates.filter((estimate) => (get(estimate, 'id') === get(newEstimate,'id')))
  if(filteredeEstimates.length === 0){
    return [...estimates, newEstimate]
  }
  else{
    const updatedEstimates = estimates.map((estimate) => {
      if(get(estimate,'id') === get(newEstimate,'id')){
        return newEstimate
      }
      else{
        return estimate
      }
    })
    return updatedEstimates
  }
  
}


const Ticket = ( {match }) => {
  const { id } = match.params
  const { loading, data, subscribeToMore } = useQuery(GET_TICKET,{
    variables: {id: id }
  });

  const [exposeAllVotes] = useMutation(EXPOSE_ALL_VOTES);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: SUBSCRIBE_TO_ESTIMATES,
      variables: { ticketId: parseInt(id) },
      updateQuery(prev, { subscriptionData }) {
        if(subscriptionData){
          const { estimateAddedToTicket: newEstimate  } = get(subscriptionData, 'data')
          return {
            ticket: { ...prev.ticket, estimates: pickCorrectEstimates(prev.ticket.estimates, newEstimate)}
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
            Estimated Point: {estimate?.finalEstimate ? get(estimate, 'point') : '****'}
          </Typography>
          <Typography gutterBottom>
            Estimated by: {get(estimate, 'voter.name')}
          </Typography>
        </CardContent>
      </Card>
    ))
  )

  const ticket = get(data, 'ticket')

  return ( 
    <>
      <Typography variant="h1">{(get(data, 'ticket.name'))}</Typography>
      <Button onClick={() => (exposeAllVotes({variables:{ticketId: data?.ticket?.id}}))}>Expose Votes</Button>
      {loading && <Loading/>}
      {ticket && estimates(ticket)}
    </>
    );
}
 
export default Ticket;