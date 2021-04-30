import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const EditEstimate = ({text, showDialogue, toggleShowDialogue, handleSubmit, onSubmit, register}) => {
  return (
    <Dialog open={showDialogue} onClose={() => (toggleShowDialogue())} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit((variables) => 
          onSubmit(variables))}>
          <DialogContent>
            <DialogContentText>
              {text}
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
    );
}
 
export default EditEstimate;