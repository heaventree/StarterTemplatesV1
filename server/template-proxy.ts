import { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import url from 'url';
import { createHash } from 'crypto';

// Ordered by probability of success based on observed template patterns
const COMMON_TEMPLATE_SUFFIXES = [
  '-02/', // Most common pattern observed (e.g., yoga-instructor-02/)
  '-04/', // Some templates use this suffix (e.g., aquarium-04/, movie-04/)
  '/',    // Plain path (e.g., aquarium/)
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

  // Table of URL corrections for templates with known issues
  const urlCorrections: Record<string, string> = {
    'blingg-jewellery': 'https://websitedemos.net/blingg-jewelry-store-04/',
    'blingg-jewelry-store-02': 'https://websitedemos.net/blingg-jewelry-store-04/',
    'jwellery': 'https://websitedemos.net/jewelry-store-04/',
    'jewellery': 'https://websitedemos.net/jewelry-store-04/',
    'nexus-news': 'https://websitedemos.net/news-blog-04/',
    'temple': 'https://websitedemos.net/religious-place-04/',
    'religious': 'https://websitedemos.net/religious-place-04/',
    'church': 'https://websitedemos.net/religious-place-04/'
  };
  
  // Check if this URL needs correction
  let correctedUrl = targetUrl;
  for (const [pattern, correction] of Object.entries(urlCorrections)) {
    if (targetUrl.toLowerCase().includes(pattern.toLowerCase())) {
      correctedUrl = correction;
      console.log(`URL correction applied: ${targetUrl} → ${correctedUrl}`);
      break;
    }
  }

  // Check for cacheable URL - if we've previously determined a working URL for this base, use it
  const urlBase = targetUrl.replace(/-\d+\/?$|\/+$/, '');
  const cacheKey = createHash('md5').update(urlBase).digest('hex');
  
  if (URL_CACHE.has(cacheKey)) {
    const cachedUrl = URL_CACHE.get(cacheKey);
    console.log(`Using cached URL: ${cachedUrl}`);
    return proxyRequest(cachedUrl as string, req, res);
  }
  
  // First try the corrected URL if available, then the original URL
  if (correctedUrl !== targetUrl) {
    try {
      console.log(`Trying corrected URL first: ${correctedUrl}`);
      const success = await proxyRequest(correctedUrl, req, res);
      if (success) {
        // Cache this successful URL
        URL_CACHE.set(cacheKey, correctedUrl);
        return;
      }
    } catch (error) {
      console.error(`Error with corrected URL: ${correctedUrl}`, error);
    }
  }
  
  // Try the original URL if corrected URL didn't work or wasn't changed
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
      // Special case for known problematic templates that can't be embedded in iframes
      const problematicTemplates = [
        'politician-04',
        'news-blog-04',
        'nexus-news',
        'blingg-jewelry-store-02',
        'religious-place',
        'church'
      ];
      
      // Check if this is a problematic template
      const isProblematic = problematicTemplates.some(template => 
        targetUrl.includes(template));
      
      // For problematic templates, send a direct redirect instead of trying to embed
      if (isProblematic) {
        console.log(`Known problematic template detected: ${targetUrl}`);
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Template Preview</title>
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
                  display: flex; 
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  padding: 20px;
                  text-align: center;
                  background-color: #f9f9f9;
                }
                .message {
                  max-width: 600px;
                  background-color: white;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                h1 { color: #333; margin-bottom: 20px; }
                p { color: #666; line-height: 1.6; margin-bottom: 20px; }
                .button {
                  display: inline-block;
                  background-color: #dd4f93;
                  color: white;
                  padding: 10px 20px;
                  border-radius: 4px;
                  text-decoration: none;
                  font-weight: bold;
                  margin-top: 10px;
                }
                .button:hover {
                  background-color: #c13a7c;
                }
              </style>
            </head>
            <body>
              <div class="message">
                <h1>Template Preview Unavailable</h1>
                <p>This template cannot be displayed in the embedded preview mode due to security restrictions.</p>
                <button onclick="window.parent.postMessage({type: 'closePreview'}, '*')" class="button" style="background-color: #666;">Close Preview</button>
              </div>
            </body>
          </html>
        `);
        resolve(true);
        return;
      }
      
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
        
        // Check for X-Frame-Options header that would prevent embedding
        const xFrameOptions = proxyRes.headers['x-frame-options'];
        if (xFrameOptions && (typeof xFrameOptions === 'string' && (xFrameOptions.toLowerCase() === 'deny' || xFrameOptions.toLowerCase().includes('sameorigin')))) {
          console.log(`Template has X-Frame-Options: ${xFrameOptions}, cannot be embedded: ${targetUrl}`);
          
          // If we detect X-Frame-Options that would prevent embedding, redirect to direct template
          res.status(200).send(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Template Preview</title>
                <style>
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
                    display: flex; 
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    padding: 20px;
                    text-align: center;
                    background-color: #f9f9f9;
                  }
                  .message {
                    max-width: 600px;
                    background-color: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  }
                  h1 { color: #333; margin-bottom: 20px; }
                  p { color: #666; line-height: 1.6; margin-bottom: 20px; }
                  .button {
                    display: inline-block;
                    background-color: #dd4f93;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 10px;
                  }
                  .button:hover {
                    background-color: #c13a7c;
                  }
                </style>
              </head>
              <body>
                <div class="message">
                  <h1>Template Preview Unavailable</h1>
                  <p>This template cannot be displayed in the embedded preview mode due to security restrictions.</p>
                  <button onclick="window.parent.postMessage({type: 'closePreview'}, '*')" class="button" style="background-color: #666;">Close Preview</button>
                </div>
              </body>
            </html>
          `);
          resolve(true);
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
      proxyReq.on('error', (err) => {
        console.error(`Request error for ${targetUrl}:`, err.message);
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
          .alt-button {
            background-color: #666;
            margin-left: 10px;
          }
          .alt-button:hover {
            background-color: #555;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-header">
            <h1>Unable to Preview ${templateName}</h1>
          </div>
          
          <div class="message-container">
            <p>We couldn't load the preview for this template. This could be due to:</p>
            <ul style="text-align: left; color: #555;">
              <li>The template URL may have changed or be temporarily unavailable</li>
              <li>The template may have security restrictions that prevent embedding</li>
              <li>There might be network connectivity issues</li>
            </ul>
          </div>
          
          <button onclick="window.parent.postMessage({type: 'closePreview'}, '*')" class="button">Close Preview</button>
          
          <p style="margin-top: 2rem; font-size: 0.9rem; color: #777;">
            If this problem persists, please try again later or contact support.
          </p>
        </div>
      </body>
    </html>
  `);
}
