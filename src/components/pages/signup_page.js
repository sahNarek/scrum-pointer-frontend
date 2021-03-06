import React, {useRef, useState} from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3)
  }
}))

const USER_SIGNUP = gql`
    mutation UserSignUp(
      $firstName: String!,
      $lastName:String!,
      $email: String!,
      $password: String!,
      $passwordConfirmation: String!
      ){
      userSignUp(input: {
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        password: $password,
        passwordConfirmation: $passwordConfirmation
        }){
        user{
          id
          firstName
          lastName
          email
        }
        errors
      }
    }
`;

const SignupPage = () => {
  const classes = useStyles();
  const { register, errors, handleSubmit, watch} = useForm();
  const [payload, setPayload] = useState({})
  const password = useRef({});
  password.current = watch("password", "")
  const [userSignUp, { loading }] = useMutation(USER_SIGNUP,{
    onCompleted: (input) => setPayload(input)
  })

  const onSubmit = (variables) => userSignUp({variables})
  return(
      <Container className={classes.container} maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  name="email" 
                  size="small" 
                  variant="filled" 
                  inputRef={register({required: true})}
                />
                {errors.email && <p>This is a required field</p>}
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="First Name" 
                  name="firstName" 
                  size="small" 
                  variant="outlined" 
                  inputRef={register({required: true})}
                />
                {errors.firstName && <p>This is a required field</p>}
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  id="filled-error"
                  label="Last Name" 
                  name="lastName" 
                  size="small" 
                  variant="filled" 
                  inputRef={register({required: true})}
                />
                {errors.lastName && <p>This is a required field</p>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  size="small"
                  type="password"
                  variant="outlined"
                  inputRef={register({
                    required: "This is a required field",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters"
                    }
                  })}
                />
                {errors.password && <p>{errors.password.message}</p>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password Confirmation"
                  name="passwordConfirmation"
                  size="small"
                  type="password"
                  variant="outlined"
                  inputRef={register({
                    required: "This is a required field",
                    validate: value => (
                      value === password.current || "The password confirmation must match"
                    )
                   })}
                />
                {errors.passwordConfirmation && <p>{errors.passwordConfirmation.message}</p>}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button color="secondary" fullWidth type="submit" variant="contained" ref={register}>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
      {(!loading && get(payload, 'userSignUp.errors') && get(payload, 'userSignUp.errors').length === 0) ? <Redirect to='/sign_in'/> : <p>{get(payload, 'userSignUp.errors')}</p>}
    </Container>
  )
}

export default SignupPage;
