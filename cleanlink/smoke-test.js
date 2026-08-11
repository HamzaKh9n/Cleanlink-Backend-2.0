const http = require('http');

const BASE_URL = process.env.CLEANLINK_API_BASE_URL || 'http://127.0.0.1:8000';
const API_PREFIX = '/api/v2';

const endpoints = {
  auth: {
    signup: { method: 'POST', path: '/auth/signup/', expectedStatus: 201 },
    login: { method: 'POST', path: '/auth/login/', expectedStatus: 200 },
    logout: { method: 'POST', path: '/auth/logout/', expectedStatus: 200 },
    refresh: { method: 'POST', path: '/auth/refresh/', expectedStatus: 200 },
    me: { method: 'GET', path: '/auth/me/', expectedStatus: 200 },
  },
  users: {
    getProfile: { method: 'GET', path: '/users/profile/', expectedStatus: 200 },
    updateProfile: { method: 'PUT', path: '/users/profile/update/', expectedStatus: 200 },
    publicProfile: { method: 'GET', path: '/users/profile/public/', expectedStatus: 200 },
    updateRegion: { method: 'PUT', path: '/users/region/', expectedStatus: 200 },
  },
  reports: {
    feed: { method: 'GET', path: '/reports/', expectedStatus: 200 },
    getReport: { method: 'GET', path: '/reports/rep_001/', expectedStatus: 200 },
    createReport: { method: 'POST', path: '/reports/create/', expectedStatus: 201 },
    updateReport: { method: 'PUT', path: '/reports/rep_001/update/', expectedStatus: 200 },
    flagReport: { method: 'POST', path: '/reports/rep_001/flag/', expectedStatus: 200 },
    vote: { method: 'POST', path: '/reports/rep_001/vote/', expectedStatus: 200 },
    comment: { method: 'POST', path: '/reports/rep_001/comment/', expectedStatus: 201 },
    getComments: { method: 'GET', path: '/reports/rep_001/comments/', expectedStatus: 200 },
    trending: { method: 'GET', path: '/reports/trending/', expectedStatus: 200 },
    search: { method: 'GET', path: '/reports/search/?q=overflow', expectedStatus: 200 },
    appeal: { method: 'POST', path: '/reports/rep_001/appeal/', expectedStatus: 200 },
  },
  notifications: {
    getNotifications: { method: 'GET', path: '/notifications/', expectedStatus: 200 },
    subscribe: { method: 'POST', path: '/notifications/subscribe/', expectedStatus: 200 },
  },
  rewards: {
    rewards: { method: 'GET', path: '/rewards/', expectedStatus: 200 },
    redeem: { method: 'POST', path: '/rewards/redeem/', expectedStatus: 200 },
  },
  admin: {
    listReports: { method: 'GET', path: '/admin/reports/', expectedStatus: 200 },
    assignReport: { method: 'POST', path: '/admin/reports/rep_001/assign/', expectedStatus: 200 },
    resolveReport: { method: 'POST', path: '/admin/reports/rep_001/resolve/', expectedStatus: 200 },
  },
  ai: {
    callback: { method: 'POST', path: '/ai/callback/', expectedStatus: 200 },
  },
  common: {
    health: { method: 'GET', path: '/common/health/', expectedStatus: 200 },
  },
};

const errorColors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function request(method, path, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${API_PREFIX}${path}`);

    const options = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: `${url.pathname}${url.search}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'http://localhost:3000',
        ...extraHeaders,
      },
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => {
        raw += chunk;
      });

      res.on('end', () => {
        try {
          const body = raw ? JSON.parse(raw) : {};
          const response = {
            status: res.statusCode,
            body,
            headers: res.headers,
          };
          resolve(response);
        } catch (error) {
          reject(new Error(`Invalid JSON response from ${method} ${path}: ${raw}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`HTTP request failed for ${method} ${path}: ${error.message}`));
    });

    req.end();
  });
}

function assertResponseShape(name, response, expectedStatus) {
  if (!response) {
    throw new Error(`[${name}] Response was undefined.`);
  }

  if (response.status !== expectedStatus) {
    throw new Error(`[${name}] Expected HTTP ${expectedStatus} but got ${response.status}.`);
  }

  const body = response.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error(`[${name}] Expected a JSON object response.`);
  }

  if (!Object.prototype.hasOwnProperty.call(body, 'success')) {
    throw new Error(`[${name}] Missing expected success boolean field.`);
  }

  if (typeof body.success !== 'boolean') {
    throw new Error(`[${name}] Success field must be a boolean.`);
  }

  if (body.success === true) {
    if (!Object.prototype.hasOwnProperty.call(body, 'message') || typeof body.message !== 'string') {
      throw new Error(`[${name}] Success response missing string message.`);
    }

    if (!Object.prototype.hasOwnProperty.call(body, 'data')) {
      throw new Error(`[${name}] Success response missing data object.`);
    }

    if (body.data === null || typeof body.data !== 'object' || Array.isArray(body.data)) {
      throw new Error(`[${name}] Success response data must be an object.`);
    }
  } else {
    if (!Object.prototype.hasOwnProperty.call(body, 'error')) {
      throw new Error(`[${name}] Error response missing error object.`);
    }

    const error = body.error;
    if (!error || typeof error !== 'object' || Array.isArray(error)) {
      throw new Error(`[${name}] Error payload is malformed.`);
    }

    if (!Object.prototype.hasOwnProperty.call(error, 'code') || typeof error.code !== 'string') {
      throw new Error(`[${name}] Error object missing string code.`);
    }

    if (!Object.prototype.hasOwnProperty.call(error, 'message') || typeof error.message !== 'string') {
      throw new Error(`[${name}] Error object missing string message.`);
    }
  }
}

function contentTypeIsJson(response) {
  const contentType = response.headers && response.headers['content-type'];
  return typeof contentType === 'string' && contentType.toLowerCase().includes('application/json');
}

function assertContentType(name, response) {
  if (!contentTypeIsJson(response)) {
    throw new Error(`[${name}] Response content-type is not application/json.`);
  }
}

function assertCorsHeaders(name, response, method, path) {
  const headers = response.headers || {};
  const allowOrigin = headers['access-control-allow-origin'];
  const allowMethods = headers['access-control-allow-methods'];
  const allowHeaders = headers['access-control-allow-headers'];

  if (!allowOrigin) {
    throw new Error(`[${name}] ${method} ${path} is missing Access-Control-Allow-Origin header.`);
  }

  if (allowOrigin !== '*' && allowOrigin !== 'http://localhost:3000' && allowOrigin !== 'http://localhost:8080') {
    throw new Error(`[${name}] ${method} ${path} returned an unexpected CORS origin ${allowOrigin}.`);
  }

  if (method === 'OPTIONS' && (!allowMethods || !allowMethods.toLowerCase().includes('post') && !allowMethods.toLowerCase().includes('get') && !allowMethods.toLowerCase().includes('put')) ) {
    throw new Error(`[${name}] Missing CORS allow-methods on preflight OPTIONS to ${path}.`);
  }

  if (method === 'OPTIONS' && allowHeaders) {
    if (!allowHeaders.toLowerCase().includes('content-type') && !allowHeaders.toLowerCase().includes('authorization')) {
      throw new Error(`[${name}] Missing CORS allow-headers that the frontend needs on ${path}.`);
    }
  }
}

function assertField(name, source, fieldPath, expectedType, customMessage) {
  const value = source[fieldPath];
  if (value === undefined || value === null) {
    throw new Error(`[${name}] Missing ${fieldPath} ${customMessage || ''}`);
  }

  if (expectedType === 'string' && typeof value !== 'string') {
    throw new Error(`[${name}] Field ${fieldPath} must be a string.`);
  }

  if (expectedType === 'number' && typeof value !== 'number') {
    throw new Error(`[${name}] Field ${fieldPath} must be a number.`);
  }

  if (expectedType === 'boolean' && typeof value !== 'boolean') {
    throw new Error(`[${name}] Field ${fieldPath} must be a boolean.`);
  }

  if (expectedType === 'array' && !Array.isArray(value)) {
    throw new Error(`[${name}] Field ${fieldPath} must be an array.`);
  }

  if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
    throw new Error(`[${name}] Field ${fieldPath} must be an object.`);
  }
}

function assertDataContract(name, body) {
  if (!body || !body.success || !body.data) {
    return;
  }

  const data = body.data;

  const validators = {
    signup: () => {
      assertField(name, data, 'user', 'object');
      assertField(name, data.user, 'id', 'string');
      assertField(name, data.user, 'username', 'string');
      assertField(name, data.user, 'email', 'string');
      assertField(name, data.user, 'role', 'string');
      assertField(name, data, 'access_token', 'string');
      assertField(name, data, 'refresh_token', 'string');
    },
    login: () => {
      assertField(name, data, 'user', 'object');
      assertField(name, data.user, 'id', 'string');
      assertField(name, data.user, 'username', 'string');
      assertField(name, data.user, 'email', 'string');
      assertField(name, data.user, 'role', 'string');
      assertField(name, data, 'access_token', 'string');
      assertField(name, data, 'refresh_token', 'string');
    },
    logout: () => {
      assertField(name, data, 'message', 'string');
    },
    refresh: () => {
      assertField(name, data, 'access_token', 'string');
      assertField(name, data, 'refresh_token', 'string');
    },
    me: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'username', 'string');
      assertField(name, data, 'email', 'string');
      assertField(name, data, 'role', 'string');
      assertField(name, data, 'is_verified', 'boolean');
    },
    getProfile: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'name', 'string');
      assertField(name, data, 'email', 'string');
      assertField(name, data, 'region', 'string');
    },
    updateProfile: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'name', 'string');
      assertField(name, data, 'email', 'string');
    },
    publicProfile: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'name', 'string');
      assertField(name, data, 'region', 'string');
      assertField(name, data, 'reputation', 'number');
    },
    updateRegion: () => {
      assertField(name, data, 'region', 'string');
      assertField(name, data, 'updated', 'boolean');
    },
    feed: () => {
      assertField(name, data, 'reports', 'array');
      assertField(name, data, 'count', 'number');
      if (data.reports.length > 0) {
        assertField(name, data.reports[0], 'id', 'string');
        assertField(name, data.reports[0], 'title', 'string');
        assertField(name, data.reports[0], 'category', 'string');
        assertField(name, data.reports[0], 'status', 'string');
        assertField(name, data.reports[0], 'region', 'string');
      }
    },
    getReport: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'title', 'string');
      assertField(name, data, 'description', 'string');
      assertField(name, data, 'category', 'string');
      assertField(name, data, 'status', 'string');
      assertField(name, data, 'region', 'string');
      assertField(name, data, 'votes', 'number');
    },
    createReport: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'message', 'string');
    },
    updateReport: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'message', 'string');
    },
    flagReport: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'flagged', 'boolean');
    },
    vote: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'vote', 'string');
      assertField(name, data, 'votes', 'number');
    },
    comment: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'report_id', 'string');
      assertField(name, data, 'message', 'string');
    },
    getComments: () => {
      assertField(name, data, 'comments', 'array');
      assertField(name, data, 'count', 'number');
    },
    trending: () => {
      assertField(name, data, 'trending', 'array');
    },
    search: () => {
      assertField(name, data, 'results', 'array');
      assertField(name, data, 'query', 'string');
    },
    appeal: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'appeal', 'string');
    },
    getNotifications: () => {
      assertField(name, data, 'notifications', 'array');
      assertField(name, data, 'count', 'number');
    },
    subscribe: () => {
      assertField(name, data, 'subscribed', 'boolean');
      assertField(name, data, 'channel', 'string');
    },
    rewards: () => {
      assertField(name, data, 'rewards', 'array');
      assertField(name, data, 'points', 'number');
    },
    redeem: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'redeemed', 'boolean');
      assertField(name, data, 'remaining_points', 'number');
    },
    listReports: () => {
      assertField(name, data, 'reports', 'array');
      assertField(name, data, 'count', 'number');
    },
    assignReport: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'assigned_to', 'string');
      assertField(name, data, 'status', 'string');
    },
    resolveReport: () => {
      assertField(name, data, 'id', 'string');
      assertField(name, data, 'status', 'string');
    },
    callback: () => {
      assertField(name, data, 'received', 'boolean');
      assertField(name, data, 'message', 'string');
      assertField(name, data, 'payload', 'object');
    },
    health: () => {
      assertField(name, data, 'status', 'string');
      assertField(name, data, 'service', 'string');
    },
  };

  const routeName = name;
  if (validators[routeName]) {
    validators[routeName]();
  } else {
    throw new Error(`[${name}] No data-contract validator is configured for this endpoint.`);
  }
}

function classifyDummyPayload(name, body) {
  const payload = body && body.data ? body.data : {};
  const classification = `${name} => ${body.success === true ? 'success-shape' : 'error-shape'} dummy payload (dummy)`;

  if (body.success === true && payload && typeof payload === 'object') {
    return classification;
  }

  return `${classification} ${body.error ? 'error-classification' : 'unexpected-shape'}`;
}

async function run() {
  const allResults = [];
  const failures = [];

  for (const groupName of Object.keys(endpoints)) {
    const group = endpoints[groupName];

    for (const [name, route] of Object.entries(group)) {
      const fullPath = `${API_PREFIX}${route.path}`;

      let response;
      try {
        response = await request(route.method, route.path);
      } catch (error) {
        failures.push(`ERROR: ${name} (${route.method} ${fullPath}) => ${error.message}`);
        continue;
      }

      try {
        assertResponseShape(name, response, route.expectedStatus);
        assertContentType(name, response);
        assertDataContract(name, response.body);
        assertCorsHeaders(name, response, route.method, fullPath);

        const body = response.body;
        const classification = classifyDummyPayload(name, body);
        allResults.push({ name, path: fullPath, status: response.status, classification, ok: true });
      } catch (error) {
        failures.push(`FAIL: ${name} (${route.method} ${fullPath}) => ${error.message}`);
      }
    }
  }

  const corsPreflightResults = [];
  for (const groupName of Object.keys(endpoints)) {
    const group = endpoints[groupName];

    for (const [name, route] of Object.entries(group)) {
      const fullPath = `${API_PREFIX}${route.path}`;

      try {
        const preflightResponse = await request('OPTIONS', route.path, {
          'Access-Control-Request-Method': route.method,
          'Access-Control-Request-Headers': 'Content-Type, Authorization, Accept',
        });

        try {
          assertCorsHeaders(name, preflightResponse, 'OPTIONS', fullPath);
          corsPreflightResults.push({ name, path: fullPath, status: preflightResponse.status });
        } catch (error) {
          failures.push(`FAIL: ${name} (${route.method} ${fullPath}) => ${error.message}`);
        }
      } catch (error) {
        failures.push(`ERROR: ${name} OPTIONS ${fullPath} => ${error.message}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error(`${errorColors.red}CLEANLINK API SMOKE TEST FAILED${errorColors.reset}`);
    for (const item of failures) {
      console.error(`${errorColors.red}${item}${errorColors.reset}`);
    }
    process.exit(1);
  }

  console.log(`${errorColors.green}CLEANLINK API SMOKE TEST PASSED${errorColors.reset}`);
  console.log(`${errorColors.blue}Validated ${allResults.length} endpoints${errorColors.reset}`);
  console.log(`${errorColors.blue}Validated ${corsPreflightResults.length} CORS preflight checks${errorColors.reset}`);

  for (const item of allResults) {
    console.log(`${errorColors.green}${item.name} ${item.path} HTTP ${item.status} => ${item.classification}${errorColors.reset}`);
  }
}

run();
