const { when, isProvider, lowerCase } = require('feathers-hooks-common');
const isAdmin = require('../../hooks/is-admin');

const restrictAPIToAdmin = when(isProvider('external'),
  isAdmin()
);

module.exports = {
  before: {
    all: [
      restrictAPIToAdmin
    ],
    find: [],
    get: [],
    create: [
      lowerCase('email', 'username'),
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
