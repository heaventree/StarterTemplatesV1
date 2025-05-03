import { getApp } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/App';
import { createSystem } from '@keystone-6/core/system';
import { createExpressServer } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/server';
import type { Express } from 'express';

import config from '../keystone';

// This function integrates KeystoneJS with an existing Express app
export async function setupKeystone(app: Express) {
  // Create a KeystoneJS system based on our config
  const { graphQLSchema, context } = createSystem(config);
  
  // Get the Express app from KeystoneJS
  const keystoneApp = await createExpressServer({
    graphQLSchema,
    context,
    dev: process.env.NODE_ENV !== 'production',
    // Explicitly sets the path for the Admin UI
    apiPath: '/api/keystone/api',
    // Add Admin UI only in development mode for now
    ...(process.env.NODE_ENV === 'development' && {
      appRoot: require.resolve('@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/App'),
    }),
    // Enables cookies and sessions
    sessionStore: {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secret: process.env.SESSION_SECRET || 'please-set-a-random-string-here',
    },
  });

  // Mount the KeystoneJS app at '/admin'
  app.use('/admin', keystoneApp);

  // Return the context which can be used to query the database
  return { context };
}