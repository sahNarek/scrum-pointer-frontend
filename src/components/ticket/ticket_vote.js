import React from 'react';
import { get } from 'lodash';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import CreateEstmate from '../../components/dialogs/create_estimate';

const TicketVote = ({ticket, showDialogue, handleSubmit, toggleShowDialogue, register, onSubmit}) => {
  return (
    <Card>
    <CardContent>
      <Typography gutterBottom>
        Ticket Name: {get(ticket, 'name')}
      </Typography>
    </CardContent>
    <Button onClick={() => (toggleShowDialogue(ticket))}>Vote</Button>
    <CreateEstmate
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