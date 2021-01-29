import React, { useRef, useEffect } from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { get, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import Loading from '../routing/loading';
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3)
  }
}))

const USER_SIGN_IN = gql`
    mutation UserSignIn($email: String!, $password: String!){
      userSignIn(input: {email: $email, password: $password}){
        user{
          id
          firstName
          lastName
          email
        }
        token
        errors
      }
    }
`;


const SignInPage = ({changeCurrentUser}) => {
  useEffect(() => {
    const abortController = new AbortController()
  
    return () => {
      abortController.abort()
    }
  }, [])

  const classes = useStyles();
  const { state } = useLocation(); 
  const { register, errors, handleSubmit, watch} = useForm();
  const password = useRef({});
  password.current = watch("password", "")
  const [userSignIn, { loading, error, data }] = useMutation(USER_SIGN_IN,{
    onCompleted: (data) => {
      if(get(data, 'userSignIn.token')){
        sessionStorage.setItem('AUTH-TOKEN', get(data, 'userSignIn.token'))
        changeCurrentUser(get(data, 'userSignIn.user'))
      }
    }
  })


  const redirectPath = state?.from ? state.from : `user/${get(data,'userSignIn.user.id')}`

  const onSubmit = (variables) => userSignIn({variables, fetchPolicy: 'no-cache'})
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
                  label="Password"
                  name="password"
                  size="small"
                  type="password"
                  variant="outlined"
                  inputRef={register({
                    required: "This is a required field",
                  })}
                />
                {errors.password && <p>{errors.password.message}</p>}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button color="secondary" fullWidth type="submit" variant="contained" ref={register}>
              Log In
            </Button>
          </Grid>
        </Grid>
      </form>
      {loading && <Loading/>}
      {error && <p>We have got some errors {JSON.stringify(error)}</p>}
      {get(data,'userSignIn.token') && !loading ? <Redirect to={redirectPath}/> : <p>{get(data,'userSignIn.errors')}</p>}
    </Container>
  )
}

export default SignInPage;
