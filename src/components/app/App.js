import { BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import SignInPage from '../pages/sign_in_page';
import SignupPage from '../pages/signup_page';
import NotFoundPage from '../pages/not_found_page';
import UserPage from '../pages/user_page';
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { get } from 'lodash';
import UserContext from '../../contexts/user_context';
import NavigationBar from '../navigation/navigation_bar';

const GET_CURRENT_USER = gql`
  query{
    currentUser{
      id,
      firstName,
      lastName,
      email,
      votingSessions{
        name
      }
    }
  }
`;



const App = () => {
  const { loading, data, error, client } = useQuery(GET_CURRENT_USER)

  const changeCurrentUser = (currentUser) => {
    client.writeData({data: {...data, currentUser}})
  }

  console.log("the errors", error)

  return (
    <>
      <UserContext.Provider value={{currentUser: get(data,'currentUser')}}>
        <Router>
          <Switch>
            <Route exact path="/home">
              <NavigationBar/>
            </Route>
            <Route exact path="/sign_in">
              <SignInPage changeCurrentUser={changeCurrentUser}/>
            </Route>
            <Route exact path="/sign_up">
              <SignupPage/>
            </Route>  
            <Route exact path="/user">
              <UserPage changeCurrentUser={changeCurrentUser}/>
            </Route>
            <Route exact path="/">
              <Redirect to="/home"/>
            </Route>
            <Route>
              <NotFoundPage/>
            </Route>
          </Switch>      
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
