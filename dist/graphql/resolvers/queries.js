"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
const SelfPropelledGun_1 = __importDefault(require("../../models/SelfPropelledGun"));
const user_1 = __importDefault(require("../../models/user"));
exports.queries = {
    login: ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = user_1.default.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
    }),
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
        console.log('getMap()', result);
        return result;
    },
    // USERS
    // get all users
    getAllUsers: () => {
        // return [{id: 'privet omlet'}]
        return user_1.default.find()
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
        return user_1.default.findById(id)
            .exec()
            .then((doc) => {
            console.log('From database', doc);
            if (doc) {
                return doc;
            }
            else {
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
        return (SelfPropelledGun_1.default.find()
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
        }));
    },
    // get owner by id
    getOwner: ({ id }) => {
        return SelfPropelledGun_1.default.findById(id)
            .exec()
            .then((doc) => {
            console.log('From database', doc);
            if (doc) {
                return doc;
            }
            else {
                return { message: 'No valid entry found for provided ID' };
            }
        })
            .catch((err) => {
            console.log(err);
            return { error: err };
        });
    },
};
