import type { Request, Response, NextFunction } from "express";
import { randomBytes, createHash } from "crypto";

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting
  MAX_REQUESTS_PER_IP: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  
  // IP obfuscation
  PROXY_HEADERS: [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ],
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ws: wss:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' ws: wss: http: https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  }
};

// In-memory stores for security tracking
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const suspiciousIPs = new Set<string>();
const sessionTokens = new Map<string, { created: number; lastAccess: number }>();

// IP obfuscation and anonymization
export function obfuscateIP(ip: string): string {
  // Multiple layers of hashing for maximum anonymity
  const salt1 = process.env.IP_SALT_1 || 'default-salt-1';
  const salt2 = process.env.IP_SALT_2 || 'default-salt-2';
  
  const hash1 = createHash('sha512').update(ip + salt1).digest('hex');
  const hash2 = createHash('sha256').update(hash1 + salt2).digest('hex');
  const hash3 = createHash('md5').update(hash2 + ip.length).digest('hex');
  
  return hash3.substring(0, 16); // Truncated hash for storage efficiency
}

// Extract real IP from headers (supports Vercel/Cloudflare)
export function extractRealIP(req: Request): string {
  // Check Vercel-specific headers first
  const vercelIP = req.headers['x-vercel-forwarded-for'] as string;
  if (vercelIP) return vercelIP.split(',')[0].trim();
  
  // Check standard proxy headers
  for (const header of SECURITY_CONFIG.PROXY_HEADERS) {
    const value = req.headers[header] as string;
    if (value) {
      return value.split(',')[0].trim();
    }
  }
  
  return req.ip || req.connection.remoteAddress || '127.0.0.1';
}

// Advanced rate limiting with exponential backoff
export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const realIP = extractRealIP(req);
  const obfuscatedIP = obfuscateIP(realIP);
  const now = Date.now();
  
  // Clean expired entries
  Array.from(rateLimitStore.entries()).forEach(([ip, data]) => {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  });
  
  const current = rateLimitStore.get(obfuscatedIP);
  
  if (!current) {
    rateLimitStore.set(obfuscatedIP, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW
    });
    return next();
  }
  
  if (now > current.resetTime) {
    rateLimitStore.set(obfuscatedIP, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW
    });
    return next();
  }
  
  current.count++;
  
  if (current.count > SECURITY_CONFIG.MAX_REQUESTS_PER_IP) {
    // Mark as suspicious and apply exponential backoff
    suspiciousIPs.add(obfuscatedIP);
    current.resetTime = now + (SECURITY_CONFIG.RATE_LIMIT_WINDOW * Math.pow(2, Math.min(current.count - SECURITY_CONFIG.MAX_REQUESTS_PER_IP, 5)));
    
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Request limit exceeded. Please try again later.',
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    });
    return;
  }
  
  next();
}

// Security headers middleware
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip CSP in development mode to prevent Vite issues
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    // Set all security headers in production
    Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
  } else {
    // Only set essential headers in development
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
  
  next();
}

// Request fingerprinting for anomaly detection
export function fingerprintMiddleware(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';
  const acceptLang = req.headers['accept-language'] || '';
  const acceptEnc = req.headers['accept-encoding'] || '';
  const clientIP = extractRealIP(req);
  
  const fingerprintData = userAgent + '|' + acceptLang + '|' + acceptEnc + '|' + clientIP;
  const fingerprint = createHash('sha256').update(fingerprintData).digest('hex');
  
  req.fingerprint = fingerprint;
  
  // Log suspicious patterns (multiple user agents from same IP, etc.)
  const obfuscatedIP = obfuscateIP(extractRealIP(req));
  if (suspiciousIPs.has(obfuscatedIP)) {
    console.warn(`Suspicious activity detected from fingerprint: ${fingerprint.substring(0, 8)}...`);
  }
  
  next();
}

// Session token management
export function generateSecureSession(): string {
  const token = randomBytes(32).toString('hex');
  const now = Date.now();
  
  sessionTokens.set(token, {
    created: now,
    lastAccess: now
  });
  
  // Clean old sessions (24 hour expiry)
  const dayAgo = now - (24 * 60 * 60 * 1000);
  Array.from(sessionTokens.entries()).forEach(([sessionToken, data]) => {
    if (data.lastAccess < dayAgo) {
      sessionTokens.delete(sessionToken);
    }
  });
  
  return token;
}

// Request logging with obfuscated data
export function secureLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const obfuscatedIP = obfuscateIP(extractRealIP(req));
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      obfuscatedIP: obfuscatedIP.substring(0, 8) + '...', // Further truncate for logs
      userAgent: req.headers['user-agent']?.substring(0, 50) + '...' || 'unknown',
      timestamp: new Date().toISOString()
    };
    
    console.log(`[${logData.timestamp}] ${logData.method} ${logData.url} ${logData.status} ${logData.duration} - IP: ${logData.obfuscatedIP}`);
  });
  
  next();
}

// Honeypot endpoints to detect automated scanners
export function honeypotMiddleware(req: Request, res: Response, next: NextFunction) {
  const suspiciousPatterns = [
    /\/admin/,
    /\/wp-admin/,
    /\/phpmyadmin/,
    /\.env/,
    /\/api\/admin/,
    /\/login/,
    /\/dashboard/,
    /\/config/
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(req.url));
  
  if (isSuspicious) {
    const obfuscatedIP = obfuscateIP(extractRealIP(req));
    suspiciousIPs.add(obfuscatedIP);
    console.warn(`Honeypot triggered by ${obfuscatedIP.substring(0, 8)}... accessing ${req.url}`);
    
    // Return fake response to waste scanner time
    res.status(404).json({ error: 'Not Found' });
    return;
  }
  
  next();
}

// Anti-DDoS protection
export function antiDDoSMiddleware(req: Request, res: Response, next: NextFunction) {
  const realIP = extractRealIP(req);
  const obfuscatedIP = obfuscateIP(realIP);
  
  if (suspiciousIPs.has(obfuscatedIP)) {
    // Apply additional delays for suspicious IPs
    const delay = Math.random() * 5000 + 1000; // 1-6 second delay
    setTimeout(() => next(), delay);
  } else {
    next();
  }
}

// Declare module augmentation for custom properties
declare global {
  namespace Express {
    interface Request {
      fingerprint?: string;
    }
  }
}

export {
  SECURITY_CONFIG,
  rateLimitStore,
  suspiciousIPs,
  sessionTokens
};