import { createAuth } from '@keystone-6/auth';

export const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'name isAdmin',
  initFirstItem: {
    fields: ['name', 'email', 'password', 'isAdmin'],
    itemData: {
      isAdmin: true
    },
    skipKeystoneWelcome: true,
  },
});