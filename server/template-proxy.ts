import { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import url from 'url';

/**
 * Proxies requests to external template websites to avoid CORS issues
 * This acts as a middleware between our app and the template websites
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
        // Forward necessary headers but remove host to avoid conflicts
        ...req.headers,
        host: parsedUrl.hostname,
        // Simulate common browser headers
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };
    
    // Make the request to the target URL
    const proxyReq = protocol.request(options, (proxyRes) => {
      // Copy status code
      res.statusCode = proxyRes.statusCode || 500;
      
      // Copy headers
      Object.keys(proxyRes.headers).forEach(key => {
        if (proxyRes.headers[key]) {
          res.setHeader(key, proxyRes.headers[key]!);
        }
      });
      
      // Ensure content can be framed in our application
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.removeHeader('Content-Security-Policy');
      
      // Stream the response data
      proxyRes.pipe(res);
    });
    
    // Handle errors
    proxyReq.on('error', (e) => {
      console.error(`Proxy error: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).json({ error: `Failed to load: ${e.message}` });
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
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}