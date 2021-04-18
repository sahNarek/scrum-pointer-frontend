import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from '@apollo/client/link/context';
import ActionCable from 'actioncable';
import ActionCableLink from 'graphql-ruby-client/dist/subscriptions/ActionCableLink';
import { ApolloLink } from 'apollo-link';


const cable = ActionCable.createConsumer('ws://localhost:3000/cable')

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/api/v1/graphql'
})

const hasSubscriptionOperation = ({ query: { definitions } }) => {
  return definitions.some(
    ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription'
  )
}

const authLink = setContext((_, { headers}) => {
  const token = localStorage.getItem('AUTH-TOKEN');
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : ``
    }
  }
})

const link = ApolloLink.split(
  hasSubscriptionOperation,
  new ActionCableLink({cable}),
  httpLink
);

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
})


ReactDOM.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
      <App />
  </ApolloProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
