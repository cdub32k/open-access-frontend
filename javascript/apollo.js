import {
  ApolloClient,
  ApolloLink,
  split,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloConsumer,
  gql,
} from "@apollo/client";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

const wsLink = new WebSocketLink(
  new SubscriptionClient(
    `${process.env.API_URL.replace(/http(s?):\/\//, "ws$1://")}subs`,
    {
      reconnect: true,
    }
  )
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    new HttpLink({
      uri: `${process.env.API_URL}`,
    })
  ),
});

//Prevent exceptions from being thrown on cache misses
client.readQuery = (function (f) {
  return function () {
    try {
      return f.apply(this, arguments);
    } catch (e) {
      // silently ignore cache misses;
    }
  };
})(client.readQuery);

export default client;
