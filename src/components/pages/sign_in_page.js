import React, {useRef} from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'

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

export const SignInPage = () => {
  const classes = useStyles();
  const { register, errors, handleSubmit, watch} = useForm();
  const password = useRef({});
  password.current = watch("password", "")
  const [userSignIn, {data}] = useMutation(USER_SIGN_IN)

  const onSubmit = (data) => userSignIn({variables: data})
  return(
    <div>
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
    </Container>
    </div>
  )
}

export default SignInPage;