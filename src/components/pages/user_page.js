import React from 'react';
// import get from 'lodash';
import UserContext from '../../contexts/user_context';

const signOutHandler = (changeCurrentUser) => {
  sessionStorage.clear()
  changeCurrentUser(null)
}

const UserPage = (props) => (
  <>
    <UserContext.Consumer>
      {({currentUser}) => (
        <>
          <p>{JSON.stringify(currentUser)}</p>
          <button onClick={() => (signOutHandler(props.changeCurrentUser))}>Sign out</button>
        </>
      )}
    </UserContext.Consumer>
  </>
)

export default UserPage