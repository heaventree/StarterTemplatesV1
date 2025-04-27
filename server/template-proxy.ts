import { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import url from 'url';
import { createHash } from 'crypto';

// Ordered by probability of success based on observed template patterns
const COMMON_TEMPLATE_SUFFIXES = [
  '-02/', // Most common pattern observed (e.g., yoga-instructor-02/)
  '/',    // Plain path (e.g., aquarium/)
  '-04/', // Less common but works for electronic-store, movie, etc.
  '',     // No trailing slash
  '-02',  // No trailing slash version
  '-04',  // No trailing slash version
  '/index.html', // Explicit index
];

// Template sites can be in various subdirectories
const TEMPLATE_SITE_PATTERNS = [
  'https://websitedemos.net/{name}{suffix}',
  'https://websitedemos.net/astra-site/{name}/',
  'https://websitedemos.net/templates/{name}{suffix}',
];
const URL_CACHE = new Map<string, string>();

/**
 * Advanced proxy for template websites to avoid CORS issues
 */
export async function templateProxy(req: Request, res: Response) {
  const targetUrl = req.query.url as string;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  console.log(`Template proxy request for URL: ${targetUrl}`);

  // Check for cacheable URL - if we've previously determined a working URL for this base, use it
  const urlBase = targetUrl.replace(/-\d+\/?$|\/+$/, '');
  const cacheKey = createHash('md5').update(urlBase).digest('hex');
  
  if (URL_CACHE.has(cacheKey)) {
    const cachedUrl = URL_CACHE.get(cacheKey);
    console.log(`Using cached URL: ${cachedUrl}`);
    return proxyRequest(cachedUrl as string, req, res);
  }
  
  // Try the original URL first
  try {
    const success = await proxyRequest(targetUrl, req, res);
    if (success) {
      // Cache this successful URL
      URL_CACHE.set(cacheKey, targetUrl);
      return;
    }
  } catch (error) {
    console.error(`Error with original URL: ${targetUrl}`, error);
  }
  
  // If original URL doesn't work, try common template URL patterns
  if (targetUrl.includes('websitedemos.net')) {
    const urlBase = targetUrl.replace(/-\d+\/?$|\/+$/, '');
    
    // First try patterns with the base URL
    for (const suffix of COMMON_TEMPLATE_SUFFIXES) {
      if (res.headersSent) break;
      
      const alternateUrl = `${urlBase}${suffix}`;
      if (alternateUrl === targetUrl) continue; // Skip if it's the same as the original URL
      
      console.log(`Trying alternate URL: ${alternateUrl}`);
      
      try {
        const success = await proxyRequest(alternateUrl, req, res);
        if (success) {
          // Cache this successful URL
          URL_CACHE.set(cacheKey, alternateUrl);
          return;
        }
      } catch (error) {
        console.error(`Error with alternate URL: ${alternateUrl}`, error);
      }
    }
    
    // If that doesn't work, try ALL known URL patterns for the template
    const templateName = urlBase.split('/').pop();
    
    if (templateName) {
      // Try all known template site patterns with all known suffixes
      for (const pattern of TEMPLATE_SITE_PATTERNS) {
        if (res.headersSent) break;
        
        // For the templates pattern (without suffix), we need to try all suffixes
        if (pattern.includes('{suffix}')) {
          for (const suffix of COMMON_TEMPLATE_SUFFIXES) {
            if (res.headersSent) break;
            
            const alternateUrl = pattern
              .replace('{name}', templateName)
              .replace('{suffix}', suffix);
              
            // Skip if it's the same as the original URL or already tried
            if (alternateUrl === targetUrl) continue;
            
            console.log(`Trying pattern URL: ${alternateUrl}`);
            try {
              const success = await proxyRequest(alternateUrl, req, res);
              if (success) {
                // Cache this successful URL
                URL_CACHE.set(cacheKey, alternateUrl);
                return;
              }
            } catch (error) {
              console.error(`Error with pattern URL: ${alternateUrl}`, error);
            }
          }
        } else {
          // Pattern doesn't have suffix placeholder (like astra-site)
          const alternateUrl = pattern.replace('{name}', templateName);
          
          // Skip if it's the same as the original URL
          if (alternateUrl === targetUrl) continue;
          
          console.log(`Trying pattern URL: ${alternateUrl}`);
          try {
            const success = await proxyRequest(alternateUrl, req, res);
            if (success) {
              // Cache this successful URL
              URL_CACHE.set(cacheKey, alternateUrl);
              return;
            }
          } catch (error) {
            console.error(`Error with pattern URL: ${alternateUrl}`, error);
          }
        }
      }
    }
  }
  
  // If all attempts fail, send the fallback response
  if (!res.headersSent) {
    sendFallbackResponse(targetUrl, req, res);
  }
}

/**
 * Helper function to make a proxy request
 */
function proxyRequest(targetUrl: string, req: Request, res: Response): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Parse the URL
      const parsedUrl = url.parse(targetUrl);
      if (!parsedUrl.hostname) {
        resolve(false);
        return;
      }
      
      // Select protocol based on URL
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      // Set up the request options
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path || '/',
        method: req.method,
        headers: {
          ...req.headers,
          host: parsedUrl.hostname,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          // Remove original cookies to avoid conflicts
          'Cookie': '',
        }
      };
      
      // Set a timeout for the request
      const timeout = setTimeout(() => {
        proxyReq.destroy();
        resolve(false);
      }, 8000);
      
      // Make the request to the target URL
      const proxyReq = protocol.request(options, (proxyRes) => {
        clearTimeout(timeout);
        
        // Handle redirects manually
        if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302 || proxyRes.statusCode === 307 || proxyRes.statusCode === 308) {
          const redirectUrl = proxyRes.headers.location;
          if (redirectUrl) {
            // Check if it's a relative redirect
            const fullRedirectUrl = redirectUrl.startsWith('http') 
              ? redirectUrl 
              : `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl.startsWith('/') ? redirectUrl : '/' + redirectUrl}`;
              
            // Instead of redirecting the client, we'll make a new proxy request
            proxyRequest(fullRedirectUrl, req, res)
              .then(success => resolve(success))
              .catch(() => resolve(false));
            return;
          }
        }
        
        // Handle error responses
        if (proxyRes.statusCode !== 200) {
          console.log(`Received status code ${proxyRes.statusCode} for ${targetUrl}`);
          resolve(false);
          return;
        }
        
        // Success - copy status code and prepare response
        res.statusCode = 200;
        
        // Copy headers but filter out problematic ones
        Object.keys(proxyRes.headers).forEach(key => {
          // Skip headers that might prevent iframe embedding
          if (!['content-security-policy', 'x-frame-options', 'x-xss-protection'].includes(key.toLowerCase())) {
            if (proxyRes.headers[key]) {
              res.setHeader(key, proxyRes.headers[key]!);
            }
          }
        });
        
        // Set headers to allow iframe embedding
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
        
        // Stream the response data
        proxyRes.pipe(res);
        resolve(true);
      });
      
      // Handle errors
      proxyReq.on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
      
      // End the request
      proxyReq.end();
      
    } catch (error) {
      console.error('Proxy request error:', error);
      resolve(false);
    }
  });
}

/**
 * Send a fallback response with a nice UI when all proxy attempts fail
 */
function sendFallbackResponse(originalUrl: string, req: Request, res: Response) {
  console.log(`Sending fallback response for ${originalUrl}`);
  
  if (res.headersSent) return;
  
  // Extract template name for the message
  let templateName = "this template";
  try {
    const matches = originalUrl.match(/\/([^\/]+)(?:-\d+)?(?:\/)?$/);
    if (matches && matches[1]) {
      templateName = matches[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Template Preview</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: white;
            color: #333;
            overflow-y: auto;
          }
          .preview-container {
            text-align: center;
            max-width: 800px;
            padding: 2rem;
            margin: auto;
          }
          .preview-header {
            margin-bottom: 2rem;
          }
          h1 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: #111;
          }
          p {
            font-size: 1rem;
            line-height: 1.6;
            color: #555;
            margin-bottom: 1rem;
          }
          .button {
            background-color: #dd4f93;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            display: inline-block;
            transition: background-color 0.2s;
            margin-top: 1rem;
            cursor: pointer;
            border: none;
          }
          .button:hover {
            background-color: #c13a7c;
          }
          .message-container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 2rem 0;
            border-left: 4px solid #dd4f93;
          }
          .info-box {
            display: flex;
            background-color: #e9f5ff;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            text-align: left;
            border: 1px solid #d0e8ff;
          }
          .info-icon {
            flex-shrink: 0;
            width: 24px;
            height: 24px;
            margin-right: 12px;
            color: #0070f3;
          }
          .features-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
            text-align: left;
          }
          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
          }
          .feature-icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            color: #dd4f93;
          }
          .screenshot {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            margin: 1.5rem 0;
            border: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-header">
            <h1>Template Preview</h1>
            <p>We're unable to display ${templateName} in the preview mode.</p>
          </div>
          
          <div class="message-container">
            <p><strong>Why is this happening?</strong></p>
            <p>Some templates have specific security settings that prevent them from being displayed in an iframe.</p>
          </div>
          
          <div class="info-box">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <p><strong>Don't worry!</strong> All our templates are fully functional when installed on your website.</p>
              <p>The preview limitations only affect the display in this browser window.</p>
            </div>
          </div>
          
          <h2>Key Features of Our Templates</h2>
          <div class="features-list">
            <div class="feature-item">
              <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Responsive Design</span>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Customizable Elements</span>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>SEO Optimized</span>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Performance Focused</span>
            </div>
          </div>
          
          <button class="button" onclick="window.parent.postMessage({type: 'closePreview'}, '*')">Browse More Templates</button>
        </div>
      </body>
    </html>
  `);
}