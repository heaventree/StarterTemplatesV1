import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import { createAuth } from '@keystone-6/auth';
import { lists } from './keystone/schema';

// Basic authentication setup
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: { isAdmin: true },
  },
});

// Session configuration
const sessionConfig = statelessSessions({
  // This secret should be changed in production
  secret: process.env.SESSION_SECRET || 'a-very-secret-secret',
  maxAge: 60 * 60 * 24 * 30, // 30 days
});

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL || '',
      onConnect: async () => {
        console.log('Connected to database');
      },
    },
    lists,
    session: sessionConfig,
    ui: {
      // Show the UI only to users who have the isAdmin field set to true
      isAccessAllowed: ({ session }) => !!session?.data.isAdmin,
    },
  })
);