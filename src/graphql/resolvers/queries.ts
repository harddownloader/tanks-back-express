import { getCurrentDate } from '../../utils/getCurrentDate';
import mongoose from 'mongoose';
import SelfPropelledGun from '../../models/SelfPropelledGun';
import User from '../../models/user';
import Labyrinth from '../../models/labyrinth';

export const queries = {
  login: async ({ email, password }) => {
    const user = User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
  },

  getMap: () => {
    const map = [
      "0/0", "0/1", "0/2", "0/3", "0/4", "0/5", "0/6", "0/7", "0/8", "0/9", "0/10",
      "1/0",
    ];
    
    const result = {
      id: 1,
      name: "Single map",
      encodedMap: map.join(';')
    };

    return result;
  },

  // USERS
  // get all users
  getAllUsers: () => {
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
      SelfPropelledGun.find()
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
    return SelfPropelledGun.findById(id)
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
