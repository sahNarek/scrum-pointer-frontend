import React, { useContext } from 'react';
import UserContext from '../../contexts/user_context';
import { get } from 'lodash';
import UserNavigation from '../navigation/user_navigation';

const signOutHandler = (changeCurrentUser) => {
  sessionStorage.clear()
  changeCurrentUser(null)
}

const getFullName = (user) => (
  `${get(user, 'firstName')}, ${get(user, 'lastName')}`
)

const UserPage = (props) => {
  // console.log('vigeeen',useContext(UserContext))
  return(
    <>
    <UserContext.Consumer>
      {({currentUser}) => (
        <>
          <UserNavigation signOutHandler={() => (signOutHandler(props.changeCurrentUser))}/>
          <h2>Welcome {getFullName(currentUser)}</h2>
          {/* <button onClick={}>Sign out</button> */}
        </>
      )}
    </UserContext.Consumer>
  </>
  )
};

export default UserPage