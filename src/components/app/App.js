import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import SignInPage from '../pages/sign_in_page'
import SignupPage from '../pages/signup_page'
import NotFound from '../pages/not_found_page'

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/sign_in">
            <SignInPage/>
          </Route>
          <Route path="/sign_up">
            <SignupPage/>
          </Route>
          <Route path="*">
            <NotFound/>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
