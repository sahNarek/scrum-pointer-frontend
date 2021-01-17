import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/user_context';
import { get } from 'lodash';


const PrivateRoute = ({ redirectPath, conditionToRender, children, ...rest }) => {

  const user = useAuth();
  const isAuthorized = get(user,'currentUser') !== null;

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
 
export default PrivateRoute;
