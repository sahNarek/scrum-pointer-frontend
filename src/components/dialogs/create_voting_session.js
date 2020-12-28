import React from 'react';
import { useForm } from 'react-hook-form';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { get } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const CREATE_VOTING_SESSION = gql`
    mutation createVotingSession($name: String!, $votingDuration: Int!){
      createVotingSession(input:{name: $name, votingDuration: $votingDuration}){
        votingSession{
          id
          name
          userId
          votingDuration
        }
        errors
      }
    }
`

const VotingSessionDialogue = ({ showForm, toggleShowForm, refetch }) => {

  const [createVotingSession] = useMutation(CREATE_VOTING_SESSION);
  const { register, handleSubmit } = useForm();

  const onSubmit = (variables, refetch) => {
    createVotingSession({variables: {...variables, votingDuration: parseInt(variables.votingDuration)}}).then((data) => {
      if(!get(data, 'errors')){
        refetch()
        toggleShowForm()
      }
    })
  }

  return ( 
    <Dialog open={showForm} onClose={toggleShowForm} aria-labelledby="form-dialog-title">
    <form onSubmit={handleSubmit((variables) => onSubmit(variables, refetch))}>
      <DialogContent>
        <DialogContentText>
          Please input a name for the voting session and input its voting duration.
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Session Name" 
                  name="name" 
                  size="small" 
                  variant="filled" 
                  inputRef={register({required: true})}
                />
                <TextField 
                  fullWidth 
                  label="Voting Duration(in seconds)" 
                  name="votingDuration" 
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
            Create
          </Button>
          <Button onClick={toggleShowForm} color="primary">
            Cancel
          </Button>
        </DialogActions>
    </form>
    </Dialog>
  );
}
 
export default VotingSessionDialogue;