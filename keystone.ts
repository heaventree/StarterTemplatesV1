import { config } from '@keystone-6/core';
import { lists } from './keystone/schema';
import { withAuth } from './keystone/auth';
import { statelessSessions } from '@keystone-6/core/session';

// Get database URL from environment variable
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/keystone';

// This secret is used for encrypting session data
const sessionSecret = process.env.SESSION_SECRET || 'this-is-a-secret-please-change-me';

// Define session configuration
const session = statelessSessions({
  secret: sessionSecret,
  // Session expires after 30 days
  maxAge: 60 * 60 * 24 * 30,
});

export default config(
  withAuth({
    db: {
      provider: 'postgresql',
      url: dbUrl,
      onConnect: async context => {
        console.log('Connected to KeystoneJS Database!');
      },
    },
    lists,
    ui: {
      // Only show the UI for users who pass this test
      isAccessAllowed: ({ session }) => {
        return session?.data?.isAdmin || false;
      },
    },
    session,
  })
);