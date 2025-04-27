import { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import url from 'url';

/**
 * Simple proxy for template websites to avoid CORS issues
 */
export async function templateProxy(req: Request, res: Response) {
  const targetUrl = req.query.url as string;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    // Parse the URL
    const parsedUrl = url.parse(targetUrl);
    if (!parsedUrl.hostname) {
      return res.status(400).json({ error: 'Invalid URL' });
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
      }
    };
    
    // Make the request to the target URL
    const proxyReq = protocol.request(options, (proxyRes) => {
      // Handle redirects manually
      if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302 || proxyRes.statusCode === 307 || proxyRes.statusCode === 308) {
        const redirectUrl = proxyRes.headers.location;
        if (redirectUrl) {
          // Check if it's a relative redirect
          const fullRedirectUrl = redirectUrl.startsWith('http') 
            ? redirectUrl 
            : `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
            
          return res.redirect(`/api/template-proxy?url=${encodeURIComponent(fullRedirectUrl)}`);
        }
      }
      
      // Copy status code
      res.statusCode = proxyRes.statusCode || 200;
      
      // Copy headers
      Object.keys(proxyRes.headers).forEach(key => {
        if (proxyRes.headers[key]) {
          res.setHeader(key, proxyRes.headers[key]!);
        }
      });
      
      // Remove headers that prevent iframe embedding
      res.removeHeader('Content-Security-Policy');
      res.removeHeader('X-Frame-Options');
      res.removeHeader('X-XSS-Protection');
      
      // Set headers to allow iframe embedding
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
      
      // Stream the response data
      proxyRes.pipe(res);
    });
    
    // Handle errors
    proxyReq.on('error', (e) => {
      console.error(`Proxy error: ${e.message}`);
      if (!res.headersSent) {
        sendFallbackResponse(targetUrl, req, res);
      }
    });
    
    // Forward request body if present
    if (['POST', 'PUT', 'PATCH'].includes(req.method?.toUpperCase() || '')) {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
  } catch (error) {
    console.error('Template proxy error:', error);
    sendFallbackResponse(targetUrl, req, res);
  }
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