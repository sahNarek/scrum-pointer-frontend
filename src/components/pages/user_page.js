import React, { useState } from 'react';
import UserContext from '../../contexts/user_context';
import { get } from 'lodash';
import UserNavigation from '../navigation/user_navigation';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import VotingSession from '../../components/voting_session/voting_session';
import VotingSessionDialogue from '../../components/dialogs/create_voting_session';

const signOutHandler = (changeCurrentUser) => {
  sessionStorage.clear()
  changeCurrentUser(null)
}

const getFullName = (user) => (
  `${get(user, 'firstName')}, ${get(user, 'lastName')}`
)


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: "white",
    background: "red"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: "white",
  }
}));



const UserPage = (props) => {
  const classes = useStyles();
  const [ showForm, setShowForm ] = useState(false)

  const votingSessions = (user) => (
    get(user, 'votingSessions').map((session,index) => (
      <VotingSession session={session} key={get(session,'id') != null ?  get(session,'id'): index }/>
    ))
  )

  const toggleShowForm = () => {
    setShowForm(!showForm)
  }

  return(
    <>
    <UserContext.Consumer>
      {({currentUser, refetch}) => {
        if(currentUser == null){
          return(
            <h1>Loading ...</h1>
          )
        }
        else{
          return(
            <>
              <UserNavigation signOutHandler={() => (signOutHandler(props.changeCurrentUser))}/>
              <h2>Welcome {getFullName(currentUser)}</h2>
              <Button className={classes.root} onClick={toggleShowForm}>Create a Voting Session</Button>
              {currentUser && votingSessions(currentUser)}
              <VotingSessionDialogue showForm={showForm} toggleShowForm={toggleShowForm} refetch={refetch}/>
            </>
          )
        }
      }}
    </UserContext.Consumer>
  </>
  )
};

export default UserPage