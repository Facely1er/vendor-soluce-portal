# VendorSoluce Monorepo

Enterprise supply chain risk management platform with vendor assessment capabilities.

## 🏗️ Architecture

This monorepo contains two enterprise-grade applications:

- **[VendorSoluce](./apps/vendorsoluce)** - Supply chain risk management and SBOM analysis platform
- **[VendorTal](./apps/vendortal)** - Premium vendor security assessment portal

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn  
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vendorsoluce-monorepo.git
cd vendorsoluce-monorepo

# Install dependencies for VendorSoluce
cd apps/vendorsoluce && npm install

# Install dependencies for VendorTal
cd ../vendortal && npm install
```

### Development

```bash
# Run VendorSoluce
cd apps/vendorsoluce
cp .env.example .env  # Configure your environment
npm run dev

# Run VendorTal
cd apps/vendortal
cp .env.example .env  # Configure your environment
npm run dev
```

## 📁 Repository Structure

```
vendorsoluce-monorepo/
├── apps/
│   ├── vendorsoluce/         # Main supply chain risk platform
│   │   ├── src/              # Source code
│   │   ├── public/           # Static assets
│   │   ├── supabase/         # Database migrations & functions
│   │   └── docs/             # Documentation
│   └── vendortal/            # Vendor assessment portal
│       ├── src/              # Source code
│       ├── public/           # Static assets
│       ├── supabase/         # Database migrations & functions
│       └── docs/             # Documentation
├── packages/
│   └── themes/               # Shared branding themes
│       ├── vendorsoluce-theme/
│       └── vendortal-theme/
└── docs/                     # Monorepo documentation
```

## 🎨 Branding

### VendorSoluce Colors
- **Primary Green**: `#33691E` - Growth, trust, security
- **Light Green**: `#66BB6A` - Accents and highlights
- **Pale Green**: `#E8F5E8` - Backgrounds

### VendorTal Colors
- **Primary Purple**: `#7C4DFF` - Premium, advanced assessment
- **Light Purple**: `#9C7CFF` - Accents and highlights  
- **Pale Purple**: `#E8D5FF` - Backgrounds

## 📚 Documentation

### VendorSoluce
- [User Guide](./apps/vendorsoluce/docs/USER_GUIDE.md)
- [Developer Guide](./apps/vendorsoluce/docs/DEVELOPER_GUIDE.md)
- [API Documentation](./apps/vendorsoluce/docs/API_DOCUMENTATION.md)
- [Deployment Guide](./apps/vendorsoluce/docs/DEPLOYMENT_GUIDE.md)

### VendorTal
- [User Guide](./apps/vendortal/docs/USER_GUIDE.md)
- [Developer Guide](./apps/vendortal/docs/DEVELOPER_GUIDE.md)
- [API Documentation](./apps/vendortal/docs/API_DOCUMENTATION.md)
- [Deployment Guide](./apps/vendortal/docs/DEPLOYMENT_GUIDE.md)

## 🔧 Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **State Management**: Zustand
- **Authentication**: Supabase Auth with MFA
- **Payments**: Stripe
- **Monitoring**: Sentry
- **Deployment**: Vercel/Netlify

## ✨ Features

### VendorSoluce
- 🔍 NIST SP 800-161 Supply Chain Risk Assessment
- 📋 SBOM Analyzer (CycloneDX/SPDX)
- 📊 Vendor Risk Dashboard
- 🛡️ Real-time vulnerability scanning
- 🌍 Multi-language support (English, French)
- 📈 Compliance tracking and reporting

### VendorTal  
- 🎯 Advanced vendor security assessments
- 📋 CMMC and NIST Privacy Framework assessments
- 👥 Vendor portal for assessment completion
- 📊 Automated compliance scoring
- 🔐 Role-based access control (RBAC)
- 📈 Comprehensive analytics and reporting

## 🧪 Testing

```bash
# Run tests for VendorSoluce
cd apps/vendorsoluce
npm test

# Run tests for VendorTal
cd apps/vendortal
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables for each app
3. Deploy apps/vendorsoluce and apps/vendortal separately

### Manual Deployment

```bash
# Build VendorSoluce
cd apps/vendorsoluce
npm run build

# Build VendorTal
cd apps/vendortal
npm run build
```

## 🔒 Security

Both applications implement enterprise-grade security:

- Multi-Factor Authentication (MFA)
- Role-Based Access Control (RBAC)
- Row Level Security (RLS) for data protection
- Audit logging for compliance
- Data encryption at rest and in transit
- Security headers and CSRF protection

See [SECURITY.md](./apps/vendorsoluce/SECURITY.md) for detailed security information.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./apps/vendorsoluce/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- NIST SP 800-161 guidelines for Supply Chain Risk Management
- Supabase for the backend-as-a-service platform
- React and TailwindCSS communities

## 📞 Support

- **VendorSoluce**: support@vendorsoluce.com
- **VendorTal**: support@vendortal.com
- **GitHub Issues**: [Create an issue](https://github.com/YOUR_USERNAME/vendorsoluce-monorepo/issues)

---

**Built with ❤️ by ERMITS LLC for secure supply chain management**

