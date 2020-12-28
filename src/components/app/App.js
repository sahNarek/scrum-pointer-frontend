import { BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import SignInPage from '../pages/sign_in_page';
import SignupPage from '../pages/signup_page';
import NotFoundPage from '../pages/not_found_page';
import UserPage from '../pages/user_page';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { get } from 'lodash';
import UserContext from '../../contexts/user_context';
import NavigationBar from '../navigation/navigation_bar';
import { useApolloClient } from "@apollo/react-hooks";

const GET_CURRENT_USER = gql`
  query{
    currentUser{
      id,
      firstName,
      lastName,
      email,
      votingSessions{
        id
        name
        votingDuration
        tickets{
          name
        }
      }
    }
  }
`;



const App = () => {
  const { loading, data, refetch } = useQuery(GET_CURRENT_USER);
  const client = useApolloClient();


  const changeCurrentUser = (user) => {
    client.writeData({data: {...data, currentUser: user}});
    refetch()
  }


  return (
    <>
      <UserContext.Provider value={{currentUser: get(data,'currentUser'), refetch}}>
        <Router>
        {!loading && get(data,'currentUser') != null && <Redirect to="/user"/>}
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
