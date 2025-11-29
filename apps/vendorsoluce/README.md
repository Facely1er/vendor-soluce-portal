# VendorSoluce - Supply Chain Risk Management Platform

VendorSoluce is a supply chain risk management platform designed to help organizations assess, monitor, and mitigate third-party risks. It's built with modern web technologies and provides tools aligned with NIST SP 800-161 guidelines.

![VendorSoluce Screenshot](https://images.pexels.com/photos/7439147/pexels-photo-7439147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## 🚀 Quick Start

### For Users
1. **[Sign Up](https://vendorsoluce.com/signin)** - Create your account
2. **[User Guide](docs/USER_GUIDE.md)** - Complete user manual
3. **[Security Guide](docs/SECURITY_GUIDE.md)** - Security best practices

### For Developers
1. **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Development setup and architecture
2. **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference
3. **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment

### For Integrators
1. **[Integration Guide](docs/INTEGRATION_GUIDE.md)** - Third-party integrations
2. **[API Documentation](docs/API_DOCUMENTATION.md)** - API endpoints and examples

## 📚 Documentation

- **[📖 Complete Documentation](docs/README.md)** - Full documentation index
- **[👥 User Guide](docs/USER_GUIDE.md)** - User manual and tutorials
- **[👨‍💻 Developer Guide](docs/DEVELOPER_GUIDE.md)** - Development setup and architecture
- **[🔌 API Documentation](docs/API_DOCUMENTATION.md)** - API reference and examples
- **[🔗 Integration Guide](docs/INTEGRATION_GUIDE.md)** - Third-party service integrations
- **[🔒 Security Guide](docs/SECURITY_GUIDE.md)** - Security and compliance information
- **[🚀 Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment and CI/CD

## ✨ Features

- **🔍 Supply Chain Risk Assessment**: Comprehensive assessment based on NIST SP 800-161 framework
- **📋 SBOM Analyzer**: Analyze Software Bill of Materials (SBOM) for vulnerabilities and compliance issues
- **📊 Vendor Risk Dashboard**: Monitor and manage vendor risk profiles
- **🛡️ NIST 800-161 Alignment**: Built-in templates and assessment frameworks
- **🌍 Multi-language Support**: Available in English, Spanish, and French
- **🔐 Enterprise Security**: Multi-factor authentication, role-based access control, and audit logging
- **📈 Real-time Monitoring**: Continuous risk monitoring and alerting
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **State Management**: Zustand + React Query
- **Authentication**: Supabase Auth with MFA support
- **Payments**: Stripe integration
- **Monitoring**: Sentry error tracking and performance monitoring
- **Deployment**: Vercel/Netlify with Cloudflare CDN

### Key Components

- **Vendor Management**: Complete vendor lifecycle management
- **Risk Assessment**: Automated and manual risk evaluation
- **SBOM Analysis**: Software component vulnerability scanning
- **Compliance Tracking**: Regulatory compliance monitoring
- **Reporting**: Comprehensive risk and compliance reports
- **API**: RESTful API for integrations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend functionality)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vendorsoluce.git
cd vendorsoluce
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**
```bash
npm run dev
```

### Setting up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration files located in `supabase/migrations` to set up your database schema
3. Enable Authentication in your Supabase project
4. Configure the Edge Functions for contact form functionality

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

The application can be deployed to any static hosting platform:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

This will generate production-ready files in the `dist` directory.

### Production Deployment

- **[Vercel Deployment](docs/DEPLOYMENT_GUIDE.md#vercel-deployment)** - Deploy to Vercel
- **[Netlify Deployment](docs/DEPLOYMENT_GUIDE.md#netlify-deployment)** - Deploy to Netlify
- **[Custom Server](docs/DEPLOYMENT_GUIDE.md#custom-server-deployment)** - Deploy to your own server

## 🔒 Security

VendorSoluce implements enterprise-grade security measures:

- **Multi-Factor Authentication** (MFA) support
- **Role-Based Access Control** (RBAC)
- **Row Level Security** (RLS) for data protection
- **Audit Logging** for compliance
- **Data Encryption** at rest and in transit
- **Security Headers** and CSRF protection

See our [Security Guide](docs/SECURITY_GUIDE.md) for detailed security information.

## 📊 Monitoring and Analytics

- **Error Tracking**: Sentry integration for error monitoring
- **Performance Monitoring**: Real-time performance metrics
- **Usage Analytics**: Vercel Analytics for user behavior insights
- **Health Checks**: Automated system health monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- NIST SP 800-161 guidelines for Supply Chain Risk Management
- Supabase team for the excellent backend-as-a-service platform
- React and TailwindCSS communities for the robust tooling
- Stripe for payment processing capabilities
- Sentry for error tracking and monitoring

## 📞 Support

- **Documentation**: [docs.vendorsoluce.com](https://docs.vendorsoluce.com)
- **Support Email**: support@vendorsoluce.com
- **GitHub Issues**: [github.com/vendorsoluce/issues](https://github.com/vendorsoluce/issues)
- **Community Forum**: [community.vendorsoluce.com](https://community.vendorsoluce.com)

---

**Built with ❤️ for secure supply chain management**