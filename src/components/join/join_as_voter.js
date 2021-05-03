import React from 'react';
import { useForm } from 'react-hook-form';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Loading from '../../components/routing/loading';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { get } from 'lodash';


const JOIN_AS_VOTER = gql`
    mutation joinAsVoter($votingSessionId: ID!, $name: String!){
      joinAsVoter(input:{votingSessionId: $votingSessionId, name: $name}){
        voter{
          id
          name
          votingSessionId
        }
        token
        errors
      }
    }
`


const JoinAsVoter = () => {
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  const [ joisnAsVoter, { loading, error, data } ] = useMutation(JOIN_AS_VOTER, {
    onCompleted: (data) => {
      if(get(data, 'joinAsVoter.token')){
        localStorage.setItem('VOTER-TOKEN', get(data, 'joinAsVoter.token'))
      }
    }
  });

  const onSubmit = (variables) => {
    joisnAsVoter({variables})
  }

  const handleClose = () => {
    history.push('/home')
  }

  return (
    <Dialog open={true} onClose={handleClose} aria-labelledby="form-dialog-title">
    <form onSubmit={handleSubmit((variables) => onSubmit(variables))}>
      <DialogContent>
        <DialogContentText>
          Please input your name and session id
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Session Id" 
                  name="votingSessionId" 
                  size="small" 
                  variant="filled" 
                  inputRef={register({required: true})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Voter Name" 
                  name="name" 
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
            Join
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
    </form>
    {loading && <Loading/>}
    {error && <p>We have got some errors {JSON.stringify(error)}</p>}
    {get(data,'joinAsVoter.voter') && !loading ? 
    <Redirect to={{
      pathname: `/voter/${get(data,'joinAsVoter.voter.id')}`,
      state: { voter: get(data,'joinAsVoter.voter')}
    }}/> 
    : 
    <p>{get(data,'joinAsVoter.errors')}</p>}
    </Dialog>
  );
}
 
export default JoinAsVoter;