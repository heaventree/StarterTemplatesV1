import { config } from '@keystone-6/core';
import { lists } from './keystone/schema';
import { withAuth } from './keystone/auth';
import { DATABASE_URL } from './server/db';

export default config(
  withAuth({
    db: {
      provider: 'postgresql',
      url: DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/keystone',
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
    // Add session values here
    session: {
      // The maximum time the session will be valid for in seconds
      maxAge: 60 * 60 * 24 * 30, // 30 days
      // The session secret is used to encrypt cookie data (should be a long, random string)
      secret: 'your-secret-here',
    },
  })
);