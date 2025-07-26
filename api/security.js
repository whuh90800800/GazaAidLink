const crypto = require('crypto');

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting settings
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // IP headers to check for real IP (for anonymization)
  IP_HEADERS: [
    'cf-connecting-ip',
    'x-real-ip',
    'x-forwarded-for',
    'x-client-ip',
    'x-cluster-client-ip',
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

// Advanced IP obfuscation with multiple hash layers
function obfuscateIP(req) {
  try {
    let ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Check for real IP in various headers
    for (const header of SECURITY_CONFIG.IP_HEADERS) {
      if (req.headers[header]) {
        ip = req.headers[header].split(',')[0].trim();
        break;
      }
    }
    
    // Multi-layer hashing for military-grade obfuscation
    const salt1 = 'gaza_relief_salt_layer_1';
    const salt2 = 'security_obfuscation_layer_2';
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)); // Hour-based
    
    // Layer 1: SHA-256 with salt and timestamp
    const hash1 = crypto.createHash('sha256')
      .update(ip + salt1 + timestamp)
      .digest('hex');
    
    // Layer 2: HMAC with different salt
    const hash2 = crypto.createHmac('sha512', salt2)
      .update(hash1)
      .digest('hex');
    
    // Layer 3: Final obfuscation with rotation
    const finalHash = crypto.createHash('sha256')
      .update(hash2 + 'final_layer')
      .digest('hex');
    
    // Return only first 8 characters for logs (makes tracing extremely difficult)
    return finalHash.substring(0, 8) + '...';
  } catch (error) {
    return 'obfuscated...';
  }
}

// Rate limiting with IP tracking
const requestCounts = new Map();

function rateLimitMiddleware(req, res, next) {
  const obfuscatedIP = obfuscateIP(req);
  const now = Date.now();
  const windowStart = now - SECURITY_CONFIG.RATE_LIMIT.windowMs;
  
  // Clean old entries
  for (const [ip, data] of requestCounts.entries()) {
    if (data.resetTime < now) {
      requestCounts.delete(ip);
    }
  }
  
  // Check current IP
  const ipData = requestCounts.get(obfuscatedIP) || {
    count: 0,
    resetTime: now + SECURITY_CONFIG.RATE_LIMIT.windowMs
  };
  
  if (ipData.count >= SECURITY_CONFIG.RATE_LIMIT.max) {
    // Exponential backoff for suspicious IPs
    const delay = Math.min(1000 * Math.pow(2, ipData.count - SECURITY_CONFIG.RATE_LIMIT.max), 30000);
    setTimeout(() => {
      res.status(429).json({ error: SECURITY_CONFIG.RATE_LIMIT.message });
    }, delay);
    return;
  }
  
  ipData.count++;
  requestCounts.set(obfuscatedIP, ipData);
  
  next();
}

// Request fingerprinting for anomaly detection
function fingerprintMiddleware(req, res, next) {
  const fingerprint = {
    userAgent: req.headers['user-agent'] || 'unknown',
    acceptLanguage: req.headers['accept-language'] || 'unknown',
    acceptEncoding: req.headers['accept-encoding'] || 'unknown',
    connection: req.headers.connection || 'unknown',
    timestamp: Date.now()
  };
  
  // Store fingerprint hash for analysis (without exposing real data)
  const fingerprintHash = crypto.createHash('md5')
    .update(JSON.stringify(fingerprint))
    .digest('hex');
  
  req.fingerprint = fingerprintHash;
  
  // Basic bot detection
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const suspiciousPatterns = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget'];
  
  if (suspiciousPatterns.some(pattern => userAgent.includes(pattern))) {
    // Add delay for suspicious requests
    setTimeout(() => next(), 2000);
  } else {
    next();
  }
}

// Security headers middleware
function securityHeadersMiddleware(req, res, next) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
  } else {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
  
  next();
}

// Secure logging with obfuscated data
function secureLoggingMiddleware(req, res, next) {
  const start = Date.now();
  const obfuscatedIP = obfuscateIP(req);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms - IP: ${obfuscatedIP}`;
    console.log(logEntry);
  });
  
  next();
}

// Honeypot endpoints to detect scanners
function honeypotMiddleware(req, res, next) {
  const honeypotPaths = [
    '/admin', '/wp-admin', '/phpmyadmin', '/cpanel',
    '/.env', '/config', '/backup', '/test'
  ];
  
  if (honeypotPaths.some(path => req.url.includes(path))) {
    const obfuscatedIP = obfuscateIP(req);
    console.log(`[SECURITY ALERT] Honeypot triggered by IP: ${obfuscatedIP} - Path: ${req.url}`);
    
    // Add to suspicious IP list and delay response
    setTimeout(() => {
      res.status(404).json({ error: 'Not found' });
    }, 5000);
    return;
  }
  
  next();
}

// Anti-DDoS protection
const ddosProtection = new Map();

function antiDDoSMiddleware(req, res, next) {
  const obfuscatedIP = obfuscateIP(req);
  const now = Date.now();
  const timeWindow = 60000; // 1 minute window
  
  const ipRequests = ddosProtection.get(obfuscatedIP) || [];
  const recentRequests = ipRequests.filter(timestamp => now - timestamp < timeWindow);
  
  if (recentRequests.length > 20) { // More than 20 requests per minute
    console.log(`[SECURITY ALERT] Potential DDoS detected from IP: ${obfuscatedIP}`);
    
    // Progressive delay based on request count
    const delay = Math.min((recentRequests.length - 20) * 1000, 10000);
    setTimeout(() => {
      res.status(429).json({ error: 'Too many requests' });
    }, delay);
    return;
  }
  
  recentRequests.push(now);
  ddosProtection.set(obfuscatedIP, recentRequests);
  
  // Clean old entries
  if (ddosProtection.size > 1000) {
    const oldestEntries = Array.from(ddosProtection.entries())
      .sort(([,a], [,b]) => a[0] - b[0])
      .slice(0, 100);
    
    oldestEntries.forEach(([ip]) => ddosProtection.delete(ip));
  }
  
  next();
}

module.exports = {
  rateLimitMiddleware,
  securityHeadersMiddleware,
  fingerprintMiddleware,
  secureLoggingMiddleware,
  honeypotMiddleware,
  antiDDoSMiddleware
};