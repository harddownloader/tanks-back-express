import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();

export const subscriptions = {
  newOwnersList: {
    subscribe: () => pubsub.asyncIterator(['OWNERS_UPDATED']),
  },
};
