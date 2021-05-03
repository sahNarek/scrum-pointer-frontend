import { Router, Redirect, Route, Switch} from 'react-router-dom';
import SignInPage from '../pages/sign_in_page';
import SignupPage from '../pages/signup_page';
import NotFoundPage from '../pages/not_found_page';
import UserPage from '../pages/user_page';
import VotingSession from '../../components/voting_session/voting_session';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { get } from 'lodash';
import { UserContext } from '../../contexts/user_context';
import NavigationBar from '../navigation/navigation_bar';
import { useApolloClient } from "@apollo/react-hooks";
import Ticket from '../../components/ticket/ticket'
import { createBrowserHistory } from "history";
import PrivateRoute from "../../components/routing/private_route";
import JoinAsVoter from '../join/join_as_voter';
import VoterPage from "../../components/pages/voter_page";
import Loading from '../routing/loading';

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

const GET_CURRENT_VOTER = gql`
  query{
    currentVoter{
      id,
      name,
      votingSessionId
    }
  }
`;

const App = () => {
  const { loading, data, refetch } = useQuery(GET_CURRENT_USER);

  const { loading: loadingVoter, data: voterData } = useQuery(GET_CURRENT_VOTER);
  const client = useApolloClient();

  const changeCurrentUser = (user) => {
    client.writeData({data: {...data, currentUser: user}});
    refetch()
  }

  const history = createBrowserHistory({forceRefresh:true});

  return (
    <>
      <UserContext.Provider value={{currentUser: get(data,'currentUser'), refetch}}>
        <Router history={history}>
          <Switch>
            <Route exact path="/home">
              <NavigationBar/>
              {!loading && get(data,'currentUser') != null && <Redirect to={`/user/${get(data,'currentUser.id')}`}/>}      
              {(loading || loadingVoter) && <Loading/>}
              {!loadingVoter && get(voterData, 'currentVoter.id') != null  &&
              <Redirect to={{
                pathname: `/voter/${get(voterData,'currentVoter.id')}`,
                state: { voter: get(voterData,'currentVoter')}
              }}/>}
            </Route>
            <Route exact path="/sign_in">
              <SignInPage changeCurrentUser={changeCurrentUser}/>
            </Route>
            <Route exact path="/sign_up">
              <SignupPage/>
            </Route>
            <PrivateRoute 
              redirectPath="/sign_in" 
              exact={true} 
              path="/user/:id"
              component={UserPage}/>
            <Route exact path="/">
              <Redirect to="/home"/>
            </Route>
            <PrivateRoute 
             redirectPath="/sign_in" 
             exact={true} 
             path="/session/:id"
             component={VotingSession}/>
            <PrivateRoute 
             redirectPath="/sign_in" 
             exact={true} 
             path="/session/:id/ticket/:id"
             component={Ticket}/>
            <Route path="/join">
              <JoinAsVoter/>
            </Route>
            <Route path="/voter/:id" render={(props) => <VoterPage {...props}/>}/>
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
