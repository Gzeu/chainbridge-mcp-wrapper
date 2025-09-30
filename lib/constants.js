// ChainBridge API Constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api/v1',
  VERSION: 'v1',
  TIMEOUT: 30000, // 30 seconds
};

// Rate Limiting
export const RATE_LIMITS = {
  FREE_CALLS_PER_MONTH: parseInt(process.env.RATE_LIMIT_FREE_CALLS) || 1000,
  WINDOW_MINUTES: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 60,
  MAX_REQUESTS_PER_WINDOW: 100,
  PREMIUM_MULTIPLIER: 10,
};

// Pricing
export const PRICING = {
  PRICE_PER_CALL: parseFloat(process.env.PRICE_PER_CALL) || 0.01,
  CURRENCY: 'USD',
  FREE_TIER_LIMIT: 1000,
  BILLING_CYCLE: 'monthly',
};

// BNB Chain Configuration
export const BNB_CHAIN = {
  MAINNET_RPC: process.env.BNB_CHAIN_RPC_URL || 'https://bsc-dataseed.binance.org/',
  TESTNET_RPC: process.env.BNB_CHAIN_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  CHAIN_ID: 56,
  TESTNET_CHAIN_ID: 97,
  BLOCK_TIME: 3000, // 3 seconds
};

// Redis Configuration
export const REDIS_CONFIG = {
  PREFIX: process.env.DATABASE_PREFIX || 'chainbridge',
  TTL: {
    API_KEY: 86400, // 24 hours
    USER_SESSION: 3600, // 1 hour
    RATE_LIMIT: 3600, // 1 hour
    CACHE: 300, // 5 minutes
  },
};

// API Endpoints
export const ENDPOINTS = {
  BLOCKS: '/blocks',
  TRANSACTIONS: '/transactions',
  TOKENS: '/tokens',
  CONTRACTS: '/contracts',
  ACCOUNTS: '/accounts',
};

// User Roles
export const USER_ROLES = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
  ADMIN: 'admin',
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    calls: 1000,
    features: ['Basic API access', 'Community support'],
  },
  STARTER: {
    name: 'Starter',
    price: 29,
    calls: 50000,
    features: ['Priority support', 'Analytics dashboard', 'API documentation'],
  },
  PRO: {
    name: 'Pro',
    price: 99,
    calls: 200000,
    features: ['24/7 support', 'Custom rate limits', 'Webhook notifications'],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 299,
    calls: 1000000,
    features: ['Dedicated support', 'SLA guarantee', 'Custom integration'],
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid or missing API key',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Upgrade your plan or wait.',
  INSUFFICIENT_CREDITS: 'Insufficient credits. Please add funds to your account.',
  INVALID_ENDPOINT: 'Invalid API endpoint',
  MALFORMED_REQUEST: 'Malformed request body',
  INTERNAL_ERROR: 'Internal server error. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  API_KEY_GENERATED: 'API key generated successfully',
  API_KEY_REVOKED: 'API key revoked successfully',
  SUBSCRIPTION_CREATED: 'Subscription created successfully',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};

// Validation Rules
export const VALIDATION = {
  API_KEY_LENGTH: 32,
  MIN_PASSWORD_LENGTH: 8,
  MAX_EMAIL_LENGTH: 255,
  MAX_NAME_LENGTH: 100,
};

export default {
  API_CONFIG,
  RATE_LIMITS,
  PRICING,
  BNB_CHAIN,
  REDIS_CONFIG,
  ENDPOINTS,
  USER_ROLES,
  SUBSCRIPTION_PLANS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
};