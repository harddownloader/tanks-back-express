import { getCurrentDate } from '../../utils/getCurrentDate';
import mongoose from 'mongoose';
import Owner from '../../models/owner';
import User from '../../models/user';

export const queries = {
  login: async ({ email, password }) => {
    const user = User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
  },

  // USERS
  // get all users
  getAllUsers: () => {
    // return [{id: 'privet omlet'}]
    return User.find()
      .exec()
      .then((docs) => {
        console.log('getAllUsers', docs);
        return docs;
      })
      .catch((err) => {
        console.log('getAllUsers error: ', err);
        return { error: err };
      });
  },
  // get user by id
  getUser: ({ id }) => {
    return User.findById(id)
      .exec()
      .then((doc) => {
        console.log('From database', doc);
        if (doc) {
          return doc;
        } else {
          return { message: 'No valid entry found for provided ID' };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },

  // OWNERS
  // get all owners
  getAllOwners: () => {
    return (
      Owner.find()
        // сортируем список по созданным, т.е. самые новые
        .sort({ _id: -1 })
        .exec()
        .then((docs) => {
          console.log('getAllOwners is ok!');
          return docs;
        })
        .catch((err) => {
          console.log('getAllOwners error: ', err);
          return { error: err };
        })
    );
  },
  // get owner by id
  getOwner: ({ id }) => {
    return Owner.findById(id)
      .exec()
      .then((doc) => {
        console.log('From database', doc);
        if (doc) {
          return doc;
        } else {
          return { message: 'No valid entry found for provided ID' };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },
};
