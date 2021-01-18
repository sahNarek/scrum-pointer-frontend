import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/user_context';
import { get } from 'lodash';


const PrivateRoute = ({ redirectPath, children, component: Component, ...rest }) => {

  const user = useAuth();
  const isAuthorized = get(user,'currentUser') !== null;

  if(children && children.length !== 0){
    return (
      <Route {...rest} render={({location})=> (
        isAuthorized
        ?
        children
        :
        <Redirect to={{
          pathname: redirectPath,
          state: { from: location }
        }}/>
      )}>
      </Route>
    ); 
  }
  else{
    return(
      <Route {...rest} render={({location, match})=> (
        isAuthorized
        ?
        <Component match={match}/>
        :
        <Redirect to={{
          pathname: redirectPath,
          state: { from: location }
        }}/>
      )}>
      </Route>
    )
  }
}
 
export default PrivateRoute;
