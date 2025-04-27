import { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import url from 'url';
import { createHash } from 'crypto';

// URL cache to avoid repeated requests and handle common patterns
const URL_VARIATIONS = ['-02', '-04', ''];
const URL_CACHE = new Map<string, string>();

/**
 * Proxies requests to external template websites to avoid CORS issues
 * This acts as a middleware between our app and the template websites
 * Handles redirects and common template URL patterns
 */
export async function templateProxy(req: Request, res: Response) {
  const targetUrl = req.query.url as string;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  // Log the request for debugging
  console.log(`Template proxy request for URL: ${targetUrl}`);
  
  // Check if we've successfully fetched this URL before
  const cacheKey = createHash('md5').update(targetUrl).digest('hex');
  if (URL_CACHE.has(cacheKey)) {
    const cachedUrl = URL_CACHE.get(cacheKey);
    console.log(`Using cached URL: ${cachedUrl} for ${targetUrl}`);
    return proxyRequest(cachedUrl!, req, res);
  }
  
  // Try the original URL first
  try {
    await proxyRequest(targetUrl, req, res, true);
  } catch (error) {
    console.error(`Error with original URL, trying variations: ${error}`);
    
    // If the original URL fails, try with common variations
    if (targetUrl.includes('websitedemos.net')) {
      const baseUrl = targetUrl.replace(/(-\d+)?(\.\w+)?$/, '');
      
      // Try each variation
      for (const suffix of URL_VARIATIONS) {
        try {
          const alternateUrl = `${baseUrl}${suffix}`;
          console.log(`Trying alternate URL: ${alternateUrl}`);
          
          const success = await proxyRequest(alternateUrl, req, res);
          if (success) {
            // Cache the successful URL
            URL_CACHE.set(cacheKey, alternateUrl);
            return;
          }
        } catch (variationError) {
          console.error(`Error with variation ${suffix}: ${variationError}`);
        }
      }
    }
    
    // If all attempts fail, return a user-friendly error page
    sendFallbackResponse(targetUrl, req, res);
  }
}

/**
 * Send a proxy request to the target URL and handle the response
 */
function proxyRequest(targetUrl: string, req: Request, res: Response, throwOnError = false): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // Parse the URL
      const parsedUrl = url.parse(targetUrl);
      if (!parsedUrl.hostname) {
        if (throwOnError) reject(new Error('Invalid URL'));
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
          // Forward necessary headers but remove host to avoid conflicts
          ...req.headers,
          host: parsedUrl.hostname,
          // Simulate common browser headers
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          // Remove original cookies to avoid conflicts
          'Cookie': '',
          // Remove problematic headers
          'sec-fetch-dest': '',
          'sec-fetch-mode': '',
          'sec-fetch-site': '',
          'sec-fetch-user': '',
        }
      };
      
      // Make the request to the target URL
      const proxyReq = protocol.request(options, (proxyRes) => {
        // Handle redirects manually, as some servers use 301/302 to canonical URLs
        if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302 || proxyRes.statusCode === 307 || proxyRes.statusCode === 308) {
          const redirectUrl = proxyRes.headers.location;
          if (redirectUrl) {
            // Check if it's a relative redirect
            const fullRedirectUrl = redirectUrl.startsWith('http') 
              ? redirectUrl 
              : `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
              
            console.log(`Following redirect to: ${fullRedirectUrl}`);
            proxyRequest(fullRedirectUrl, req, res)
              .then(() => resolve(true))
              .catch((err) => {
                if (throwOnError) reject(err);
                resolve(false);
              });
            return;
          }
        }
        
        // Check for valid response (200 OK)
        if (proxyRes.statusCode === 200) {
          // Copy status code
          res.statusCode = proxyRes.statusCode;
          
          // Copy headers
          Object.keys(proxyRes.headers).forEach(key => {
            if (proxyRes.headers[key]) {
              res.setHeader(key, proxyRes.headers[key]!);
            }
          });
          
          // Ensure content can be framed in our application
          res.setHeader('X-Frame-Options', 'ALLOWALL');
          res.removeHeader('Content-Security-Policy');
          res.removeHeader('X-Frame-Options');
          res.removeHeader('X-XSS-Protection');
          
          // Allow iframe embedding
          res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
          
          // Stream the response data
          proxyRes.pipe(res);
          resolve(true);
        } else {
          console.error(`Proxy received non-200 status code: ${proxyRes.statusCode}`);
          if (throwOnError) reject(new Error(`HTTP ${proxyRes.statusCode}`));
          resolve(false);
        }
      });
      
      // Handle errors
      proxyReq.on('error', (e) => {
        console.error(`Proxy request error: ${e.message}`);
        if (throwOnError) reject(e);
        resolve(false);
      });
      
      // Set timeout
      proxyReq.setTimeout(10000, () => {
        console.error('Proxy request timed out');
        proxyReq.destroy();
        if (throwOnError) reject(new Error('Request timed out'));
        resolve(false);
      });
      
      // Forward request body if present
      if (['POST', 'PUT', 'PATCH'].includes(req.method?.toUpperCase() || '')) {
        req.pipe(proxyReq);
      } else {
        proxyReq.end();
      }
    } catch (error) {
      console.error('Template proxy error:', error);
      if (throwOnError) reject(error);
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
          }
          .preview-container {
            text-align: center;
            max-width: 800px;
            padding: 2rem;
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
          .button-secondary {
            background-color: #6c7ae0;
            margin-left: 10px;
          }
          .button-secondary:hover {
            background-color: #5a66c5;
          }
          .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 20px;
            margin-top: 30px;
            width: 100%;
            max-width: 800px;
          }
          .template-alternative {
            text-align: center;
          }
          .template-alternative img {
            width: 100%;
            border-radius: 4px;
            border: 1px solid #eee;
            aspect-ratio: 1/1;
            object-fit: cover;
            transition: transform 0.2s;
          }
          .template-alternative img:hover {
            transform: scale(1.05);
          }
          .template-alternative p {
            margin-top: 8px;
            font-size: 0.9rem;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <h1>Template Preview</h1>
          <p>This template is currently unavailable in the preview mode.</p>
          <p>You can explore similar templates or browse through our collection below.</p>
          
          <div>
            <button class="button" onclick="window.parent.postMessage({type: 'closePreview'}, '*')">Browse Templates</button>
          </div>
        </div>
      </body>
    </html>
  `);
}