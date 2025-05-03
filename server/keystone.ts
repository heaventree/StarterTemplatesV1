import type { Express } from 'express';
import path from 'path';
import { log } from './vite';

// Simple route to serve the admin UI placeholder until the full integration is complete
export async function setupKeystone(app: Express) {
  try {
    log('Setting up KeystoneJS CMS placeholder UI', 'keystone');
    
    // Add a temporary route for the admin panel
    app.get('/admin', (req, res) => {
      res.send(`
        <html>
          <head>
            <title>Starter Templates CMS</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
              h1 { color: #4a8cff; }
              .card { background: #f8f9fa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
              .features { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
              .feature { background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
              .coming-soon { opacity: 0.7; }
              .button { background: #4a8cff; color: white; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 1rem; }
            </style>
          </head>
          <body>
            <h1>Starter Templates CMS</h1>
            <p>This is a placeholder for the Keystone CMS admin interface. In a production environment, this would be a fully functional content management system.</p>
            
            <div class="card">
              <h2>Development Status</h2>
              <p>Currently working on:</p>
              <ul>
                <li>Features page UI implementation based on Astra Pro design</li>
                <li>Keystone CMS integration with proper data models</li>
                <li>Admin interface for managing features and templates</li>
              </ul>
            </div>
            
            <h2>Features Module</h2>
            <div class="features">
              <div class="feature">
                <h3>Feature Categories</h3>
                <p>Organize features by categories</p>
              </div>
              <div class="feature">
                <h3>Feature Details</h3>
                <p>Rich text editor for feature descriptions</p>
              </div>
              <div class="feature coming-soon">
                <h3>Testimonials</h3>
                <p>Coming soon</p>
              </div>
            </div>
            
            <a href="/" class="button">Return to Homepage</a>
          </body>
        </html>
      `);
    });
    
    // Simple API endpoints for feature data
    app.get('/api/features', (req, res) => {
      res.json({
        features: [
          {
            id: 1,
            title: 'Header Builder',
            slug: 'header-builder',
            icon: '/images/features/icons/Advanced-Header.svg',
            shortDescription: 'Customize your site header with flexible options',
            image: '/images/features/sticky-header-pro-new.png',
            highlights: [
              { title: 'Sticky Headers', description: 'Headers that stay visible while scrolling' },
              { title: 'Transparent Headers', description: 'For beautiful hero sections with overlays' },
              { title: 'Multiple Layouts', description: 'Choose from various header designs' }
            ]
          },
          {
            id: 2,
            title: 'Footer Builder',
            slug: 'footer-builder',
            icon: '/images/features/icons/footer-builder-icon.svg',
            shortDescription: 'Design professional footers that match your brand',
            image: '/images/features/footer-builder.png',
            highlights: [
              { title: 'Multiple Columns', description: 'Flexible column layouts' },
              { title: 'Widget Areas', description: 'Add widgets to any footer section' },
              { title: 'Copyright Bar', description: 'Customizable copyright section' }
            ]
          }
        ]
      });
    });
    
    log('KeystoneJS CMS placeholder is ready at /admin', 'keystone');
    return { success: true };
  } catch (error) {
    console.error('Error setting up KeystoneJS:', error);
    return { success: false, error };
  }
}