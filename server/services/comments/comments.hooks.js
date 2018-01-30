const { authenticate } = require('feathers-authentication').hooks;
const { unless, isProvider, populate, discard } = require('feathers-hooks-common');
const {
  //queryWithCurrentUser,
  associateCurrentUser,
  // restrictToAuthenticated,
  restrictToOwner
} = require('feathers-authentication-hooks');
const { isVerified } = require('feathers-authentication-management').hooks;
const createExcerpt = require('../../hooks/create-excerpt');
const createNotifications = require('./hooks/create-notifications');
const _ = require('lodash');

const userSchema = {
  include: {
    service: 'users',
    nameAs: 'user',
    parentField: 'userId',
    childField: '_id'
  }
};

//ToDo: Only let users create comments for contributions they are allowed to
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      // Allow seeder to seed comments
      unless(isProvider('server'),
        isVerified()
      ),
      associateCurrentUser(),
      createExcerpt()
    ],
    update: [
      authenticate('jwt'),
      isVerified(),
      restrictToOwner(),
      createExcerpt()
    ],
    patch: [
      authenticate('jwt'),
      isVerified(),
      unless((hook) => {
        // only allow upvoteCount increment for non owners
        // the data has to be the exact copy of the valid object
        const valid = {$inc: {upvoteCount: 1}};
        return (!_.difference(_.keys(valid), _.keys(hook.data)).length) &&
               (!_.difference(_.keys(valid.$inc), _.keys(hook.data.$inc)).length) &&
               (!_.difference(_.values(valid.$inc), _.values(hook.data.$inc)).length);
      }, restrictToOwner()),
      createExcerpt()
    ],
    remove: [
      authenticate('jwt'),
      isVerified(),
      restrictToOwner()
    ]
  },

  after: {
    all: [
      populate({ schema: userSchema })
    ],
    find: [
      discard('content', 'user.coverImg', 'badgeIds')
    ],
    get: [],
    create: [
      createNotifications()
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
