import React, { useState } from 'react';
import { UserContext } from '../../contexts/user_context';
import { get } from 'lodash';
import UserNavigation from '../navigation/user_navigation';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import VotingSessionDialogue from '../../components/dialogs/create_voting_session';
import { NavLink, useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Loading from '../../components/routing/loading';
import { Typography } from '@material-ui/core';

const signOutHandler = (changeCurrentUser, history) => {
  sessionStorage.clear()
  changeCurrentUser(null)
  history.push('/')
}

const getFullName = (user) => (
  `${get(user, 'firstName')} ${get(user, 'lastName')}`
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
  },
  link: {
    textDecoration: 'none'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    marginBottom: 12,
  }
}));



const UserPage = ({changeCurrentUser}) => {
  const history = useHistory()
  const classes = useStyles();
  const [ showForm, setShowForm ] = useState(false)

  const votingSessions = (user) => (
    get(user, 'votingSessions').map((session,index) => (
      <NavLink key={index} className={classes.link} to={`/session/${get(session,'id')}`}>
        <Card>
          <CardContent>
            <Typography gutterBottom>
              Session ID: {get(session, 'id')}
            </Typography>
            <Typography variant="body2" component="p">
              Session Name: {get(session, 'name')}
              <br />
              Session voting duration: {get(session, 'votingDuration')}
            </Typography>
          </CardContent>
        </Card>
      </NavLink>
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
            <Loading/>
          )
        }
        else{
          return(
            <>
              <UserNavigation signOutHandler={() => (signOutHandler(changeCurrentUser, history))}/>
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