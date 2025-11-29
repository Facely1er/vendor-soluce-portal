# VendorSoluce API Documentation

## Overview

VendorSoluce provides a comprehensive API for supply chain risk management, built on top of Supabase. This documentation covers all available endpoints, data models, and integration patterns.

## Base URL

- **Development**: `https://your-project.supabase.co`
- **Production**: `https://your-project.supabase.co`

## Authentication

All API requests require authentication using Supabase's JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### Sign Up
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "data": {
    "full_name": "John Doe"
  }
}
```

#### Sign In
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Sign Out
```http
POST /auth/v1/logout
Authorization: Bearer <token>
```

### Vendors

#### Get All Vendors
```http
GET /rest/v1/vendors
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Vendor Name",
    "email": "vendor@example.com",
    "website": "https://vendor.com",
    "industry": "Technology",
    "risk_level": "medium",
    "compliance_status": "compliant",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Vendor
```http
POST /rest/v1/vendors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Vendor",
  "email": "newvendor@example.com",
  "website": "https://newvendor.com",
  "industry": "Technology",
  "risk_level": "low"
}
```

#### Update Vendor
```http
PATCH /rest/v1/vendors?id=eq.uuid
Authorization: Bearer <token>
Content-Type: application/json

{
  "risk_level": "high",
  "compliance_status": "non-compliant"
}
```

#### Delete Vendor
```http
DELETE /rest/v1/vendors?id=eq.uuid
Authorization: Bearer <token>
```

### SBOM Analyses

#### Get SBOM Analyses
```http
GET /rest/v1/sbom_analyses
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "vendor_id": "uuid",
    "file_name": "sbom.json",
    "file_size": 1024,
    "analysis_status": "completed",
    "vulnerabilities_found": 5,
    "critical_vulnerabilities": 1,
    "high_vulnerabilities": 2,
    "medium_vulnerabilities": 2,
    "low_vulnerabilities": 0,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Upload SBOM
```http
POST /rest/v1/sbom_analyses
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendor_id": "uuid",
  "file_name": "sbom.json",
  "file_size": 1024,
  "analysis_status": "pending"
}
```

### Supply Chain Assessments

#### Get Assessments
```http
GET /rest/v1/supply_chain_assessments
Authorization: Bearer <token>
```

#### Create Assessment
```http
POST /rest/v1/supply_chain_assessments
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendor_id": "uuid",
  "assessment_type": "nist_800_161",
  "status": "in_progress",
  "score": 0,
  "max_score": 100
}
```

### Vendor Assessments

#### Get Vendor Assessments
```http
GET /rest/v1/vendor_assessments
Authorization: Bearer <token>
```

#### Create Vendor Assessment
```http
POST /rest/v1/vendor_assessments
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendor_id": "uuid",
  "assessment_name": "Security Assessment",
  "assessment_type": "security",
  "status": "draft",
  "due_date": "2024-12-31",
  "assessor_id": "uuid"
}
```

#### Update Assessment Response
```http
PATCH /rest/v1/vendor_assessment_responses?id=eq.uuid
Authorization: Bearer <token>
Content-Type: application/json

{
  "response": "Yes",
  "evidence": "Documentation provided",
  "notes": "Additional comments"
}
```

## Edge Functions

### Contact Form
```http
POST /functions/v1/contact-form
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "topic": "general",
  "message": "Hello, I'm interested in your services."
}
```

### Stripe Checkout
```http
POST /functions/v1/create-checkout-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "priceId": "price_1234567890",
  "customerEmail": "customer@example.com",
  "successUrl": "https://app.vendorsoluce.com/success",
  "cancelUrl": "https://app.vendorsoluce.com/cancel"
}
```

### Stripe Portal
```http
POST /functions/v1/create-portal-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "cus_1234567890",
  "returnUrl": "https://app.vendorsoluce.com/billing"
}
```

## Data Models

### Vendor
```typescript
interface Vendor {
  id: string;
  name: string;
  email: string;
  website?: string;
  industry: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  compliance_status: 'compliant' | 'non-compliant' | 'pending';
  created_at: string;
  updated_at: string;
}
```

### SBOM Analysis
```typescript
interface SBOMAnalysis {
  id: string;
  vendor_id: string;
  file_name: string;
  file_size: number;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  vulnerabilities_found: number;
  critical_vulnerabilities: number;
  high_vulnerabilities: number;
  medium_vulnerabilities: number;
  low_vulnerabilities: number;
  created_at: string;
}
```

### Supply Chain Assessment
```typescript
interface SupplyChainAssessment {
  id: string;
  vendor_id: string;
  assessment_type: 'nist_800_161' | 'iso_27001' | 'soc_2';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  score: number;
  max_score: number;
  created_at: string;
  updated_at: string;
}
```

### Vendor Assessment
```typescript
interface VendorAssessment {
  id: string;
  vendor_id: string;
  assessment_name: string;
  assessment_type: 'security' | 'compliance' | 'financial' | 'operational';
  status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'overdue';
  due_date: string;
  assessor_id: string;
  created_at: string;
  updated_at: string;
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a message:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

API requests are rate limited:
- **Authenticated users**: 1000 requests per hour
- **Anonymous users**: 100 requests per hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

// Get vendors
const { data: vendors, error } = await supabase
  .from('vendors')
  .select('*')
```

### Python
```bash
pip install supabase
```

```python
from supabase import create_client, Client

url = "https://your-project.supabase.co"
key = "your-anon-key"
supabase: Client = create_client(url, key)

# Get vendors
response = supabase.table('vendors').select('*').execute()
vendors = response.data
```

## Webhooks

### Stripe Webhooks
The platform supports Stripe webhooks for subscription events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Webhook endpoint: `/functions/v1/stripe-webhook`

## Testing

### Postman Collection
A Postman collection is available for testing all API endpoints. Import the collection and configure environment variables:

- `base_url`: Your Supabase project URL
- `anon_key`: Your Supabase anon key
- `jwt_token`: User JWT token for authenticated requests

### cURL Examples

#### Get Vendors
```bash
curl -X GET 'https://your-project.supabase.co/rest/v1/vendors' \
  -H 'Authorization: Bearer <token>' \
  -H 'apikey: <anon-key>'
```

#### Create Vendor
```bash
curl -X POST 'https://your-project.supabase.co/rest/v1/vendors' \
  -H 'Authorization: Bearer <token>' \
  -H 'apikey: <anon-key>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "New Vendor",
    "email": "vendor@example.com",
    "industry": "Technology",
    "risk_level": "medium"
  }'
```

## Support

For API support and questions:
- **Documentation**: [docs.vendorsoluce.com](https://docs.vendorsoluce.com)
- **Support Email**: support@vendorsoluce.com
- **GitHub Issues**: [github.com/vendorsoluce/issues](https://github.com/vendorsoluce/issues)
