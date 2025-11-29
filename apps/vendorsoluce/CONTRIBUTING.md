# Contributing Guide

Thank you for contributing to VendorSoluce!

## Development Setup

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd vendorsoluce.com
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

## Code Standards

- TypeScript strict mode
- 80%+ test coverage
- Follow ESLint rules
- Use logger utilities

## Testing

- Comprehensive test suite (78+ tests)
- Run: `npm test`
- Coverage: `npm run test:coverage`

## Database

- RLS policies must be maintained
- Migrations in `supabase/migrations/`
- Test database changes locally

## Commit Messages

Follow Conventional Commits format.

---

Thank you! 🎉

