# 🌉 ChainBridge API

> **Premium BNB Chain MCP wrapper with rate limiting, analytics & automated billing**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Gzeu/chainbridge-mcp-wrapper)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![BNB Chain](https://img.shields.io/badge/BNB%20Chain-MCP-yellow)

## 🚀 Overview

ChainBridge API este un wrapper premium pentru BNB Chain MCP (Model Context Protocol) care oferă:

- ⚡ **Rate Limiting** inteligent cu Redis
- 📊 **Analytics** în timp real pentru utilizare API
- 💳 **Billing automat** prin Stripe
- 🔐 **Autentificare** securizată cu NextAuth.js
- 📚 **Documentație** interactivă pentru developeri
- 🎯 **100% free stack** pentru MVP

## 🎯 Features

### Core API Wrapper
- [x] Proxy complet pentru BNB Chain MCP endpoints
- [x] Rate limiting: 1000 free calls, apoi $0.01/call
- [x] Caching inteligent pentru performance
- [x] Error handling & retry logic
- [x] Real-time monitoring

### Dashboard & Analytics
- [x] Usage analytics cu grafice interactive
- [x] API key management
- [x] Billing history & invoices
- [x] Real-time rate limiting status
- [x] Performance metrics

### Billing & Subscriptions
- [x] Integration Stripe pentru plăți
- [x] Subscription tiers flexibile
- [x] Automated billing cycles
- [x] Free tier cu 1000 calls/lună
- [x] Pay-per-use model

## 🏗️ Tech Stack (100% Free)

| Component | Service | Free Tier Limit |
|-----------|---------|----------------|
| **Frontend** | Next.js 14 + Vercel | 1M invocări/lună |
| **Backend** | Vercel Serverless | 100GB bandwidth |
| **Database** | Upstash Redis | 500K comenzi/lună |
| **Auth** | NextAuth.js | Unlimited |
| **Payments** | Stripe | Free până la $1M |
| **Monitoring** | Vercel Analytics | Free |
| **Domain** | .vercel.app | Free + SSL |

## 📊 Revenue Model

- **Free Tier**: 1,000 API calls/lună
- **Pay-per-use**: $0.01 per API call după limită
- **Estimated Revenue**: $1,500-2,000/lună la 300k calls
- **Profit Margin**: ~400% (costuri infrastructură: $0.002/call)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/Gzeu/chainbridge-mcp-wrapper.git
cd chainbridge-mcp-wrapper

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure environment variables
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### Environment Variables

```bash
# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# BNB Chain
BNB_CHAIN_RPC_URL=https://bsc-dataseed.binance.org/
```

## 📚 API Documentation

### Base URL
```
https://chainbridge-api.vercel.app/api/v1
```

### Authentication
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://chainbridge-api.vercel.app/api/v1/blocks/latest
```

### Available Endpoints

| Endpoint | Description |
|----------|-------------|
| `/blocks/*` | Block data și informații |
| `/transactions/*` | Transaction data și traces |
| `/tokens/*` | Token balances și metadata |
| `/contracts/*` | Smart contract calls |
| `/accounts/*` | Account data și history |

## 🛠️ Development

### Project Structure
```
chainbridge-mcp-wrapper/
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── dashboard/     # User dashboard
│   └── docs/          # API documentation
├── lib/               # Utility libraries
├── components/        # React components
├── styles/           # CSS & Tailwind
└── tests/            # Test suites
```

### Scripts

```bash
npm run dev         # Development server
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint check
npm run test        # Run tests
```

## 📈 Roadmap

### Phase 1 - MVP (Weeks 1-2)
- [x] Core API wrapper
- [x] Rate limiting cu Redis
- [x] Basic authentication
- [x] Simple dashboard

### Phase 2 - Billing (Weeks 3-4)
- [ ] Stripe integration
- [ ] Usage analytics
- [ ] API documentation
- [ ] User management

### Phase 3 - Launch (Weeks 5-6)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Beta testing
- [ ] Production deployment

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: https://chainbridge-api.vercel.app
- **Documentation**: https://chainbridge-api.vercel.app/docs
- **Dashboard**: https://chainbridge-api.vercel.app/dashboard
- **GitHub**: https://github.com/Gzeu/chainbridge-mcp-wrapper

---

**Built with ❤️ by [Pricop George](https://github.com/Gzeu) in București, România**