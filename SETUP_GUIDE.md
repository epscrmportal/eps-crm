# EPS CRM - Complete Setup & Documentation Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Installation & Setup](#installation--setup)
4. [Configuration](#configuration)
5. [Feature Documentation](#feature-documentation)
6. [API Endpoints](#api-endpoints)
7. [Database Schema](#database-schema)
8. [Razorpay Integration](#razorpay-integration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**EPS CRM** is a comprehensive Customer Relationship Management system designed for:
- **Telecallers**: Call logging, contact management, follow-ups, meeting scheduling
- **Field Executives**: Activity logging, business card management, event tracking
- **Accounts**: Invoice management, payment processing with Razorpay integration

### Key Features:
- ✅ Role-based access control (Telecaller, Field Executive, Accounts)
- ✅ Complete contact lifecycle management
- ✅ Call logging and follow-up tracking
- ✅ Meeting scheduling system
- ✅ Activity logging for field executives
- ✅ Business card digitization & sync
- ✅ Invoice & payment management
- ✅ Razorpay payment gateway integration
- ✅ Goal tracking and analytics
- ✅ Email templates for communication
- ✅ Excel invoice import/export

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React)                           │
│  ├─ Telecaller Dashboard                             │
│  ├─ Field Executive Dashboard                        │
│  └─ Collections/Accounts Dashboard                   │
└──────────────────┬──────────────────────────────────┘
                   │ API Calls
┌──────────────────▼──────────────────────────────────┐
│        Backend API (Node.js + Express)              │
│  ├─ Authentication & Authorization                  │
│  ├─ Contact Management                              │
│  ├─ Call Logs & Follow-ups                          │
│  ├─ Meeting Management                              │
│  ├─ Invoice Processing                              │
│  ├─ Razorpay Payment Gateway                        │
│  ├─ Email Notifications                             │
│  └─ Analytics & Reporting                           │
└──────────────────┬──────────────────────────────────┘
                   │ 
┌──────────────────▼──────────────────────────────────┐
│         Database (MongoDB)                           │
│  ├─ Users                                            │
│  ├─ Contacts                                         │
│  ├─ Call Logs                                        │
│  ├─ Follow-ups & Meetings                            │
│  ├─ Activities & Business Cards                      │
│  ├─ Invoices & Payments                              │
│  └─ Goals & Analytics                                │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn
- React 17+
- Razorpay Account (for payment integration)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd eps-crm
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Install dependencies
npm install express mongoose cors dotenv razorpay bcryptjs jsonwebtoken multer xlsx nodemailer

# Create .env file
cp .env.example .env

# Start server
npm start
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Step 4: Database Setup
```bash
# MongoDB local setup (if not using MongoDB Atlas)
mongod

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env file
```

---

## ⚙️ Configuration

### 1. Environment Variables (.env)
Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eps-crm
# Or MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eps-crm

# JWT
JWT_SECRET=your_super_secret_jwt_key_12345

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Email Service (Alternative - SendGrid)
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=eps-crm-bucket

# App Settings
APP_NAME=EPS CRM
APP_URL=http://localhost:3000
```

### 2. Frontend Configuration
Update `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`
  },
  // Contacts
  CONTACTS: `${API_BASE_URL}/contacts`,
  // Call Logs
  CALL_LOGS: `${API_BASE_URL}/call-logs`,
  // Follow-ups
  FOLLOWUPS: `${API_BASE_URL}/followups`,
  // Meetings
  MEETINGS: `${API_BASE_URL}/meetings`,
  // Activities
  ACTIVITIES: `${API_BASE_URL}/activities`,
  // Business Cards
  BUSINESS_CARDS: `${API_BASE_URL}/business-cards`,
  // Invoices
  INVOICES: `${API_BASE_URL}/invoices`,
  // Payments
  PAYMENTS: `${API_BASE_URL}/payments`,
  // Analytics
  ANALYTICS: `${API_BASE_URL}/analytics`
};

export default API_ENDPOINTS;
```

---

## 📱 Feature Documentation

### TELECALLER DASHBOARD

#### 1. Dashboard (Overview)
Displays real-time metrics:
- **Total Contacts**: All contacts assigned to telecaller
- **Call Connected**: Count of successful calls
- **Missed Calls**: Count of missed calls
- **Pending Follow-ups**: Follow-ups yet to be completed
- **Meetings Scheduled**: Upcoming meetings
- **Deals Closed**: Completed sales
- **Monthly Activity Chart**: Line chart showing calls, meetings, deals

#### 2. Log New Calls
Complete call logging interface:
```
Form Fields:
├── Customer Name (text)
├── Company Name (text)
├── Industry (dropdown: Software, Finance, Healthcare, etc.)
├── Phone Number (tel)
├── Email (email)
├── Call Status (dropdown: Connected, Missed, Pending)
├── Email Sent (yes/no)
├── Interested (yes/no)
├── Contact Tag (hot/warm/cold/do_not_call)
├── Discussion (textarea)
├── Schedule Meeting (datetime)
├── Follow-up Date (date)
├── Follow-up Note (textarea)
└── Buttons: Save, Clear, Cancel
```

#### 3. Contacts Management
- Search bar (by name or company)
- Contact list with tags
- Highlighting for new contacts
- Contact details display
- Quick edit capability

#### 4. Follow-ups Management
- List of all pending follow-ups
- Due date tracking
- Status update buttons:
  - ✅ Done
  - 💰 Deal Closed
  - 📅 Reschedule
- Notes view and edit

#### 5. Reminders Page
- List of upcoming reminders
- Sorted by due date
- Color-coded by priority
- Quick action buttons

#### 6. Email Templates
Pre-built templates:
- **Meeting Confirmation**: Auto-fill with meeting details
- **Proposal**: Professional proposal template
- **Price Quotation**: Pricing details template
- **Introduction**: Initial outreach template
- **Thank You**: Follow-up gratitude
- **Feedback**: Feedback request template

#### 7. Goals Tracking
Target management:
```
Daily:
├── Calls: 45 target
├── Meetings: 1 target

Weekly:
├── Calls: 270 target
├── Meetings: 7 target

Monthly:
├── Calls: 1350 target
├── Meetings: 30 target
```

Progress bars show actual vs target with percentage.

#### 8. Analytics Dashboard
- **Total Calls Chart**: Line graph of calls over time
- **Call Status Distribution**: Pie chart (Connected/Missed/Pending)
- **Call Conversion Rate**: Percentage of interested leads
- **Meeting Success Rate**: Percentage of scheduled meetings
- **Key Metrics Cards**:
  - Total Calls
  - Call Conversion %
  - Meeting Rate
  - Deal Close Rate

---

### FIELD EXECUTIVE DASHBOARD

#### 1. Dashboard (Overview)
Field executive specific metrics:
- **Total Activities**: Count of all activities
- **Business Cards Collected**: Total cards digitized
- **Connections Made**: New relationships established
- **Events Attended**: Count of events
- **BNI Meetings**: Count of BNI meetings
- **1:1 Meetings**: Count of one-to-one meetings
- **Activity Breakdown Chart**: Bar chart of activity types

#### 2. Log Activity
Log different types of activities:
```
Activity Types:
├── BNI Meeting
├── Exhibition
├── Client Meeting
└── Event

Form Fields:
├── Event Name (text)
├── Location (text)
├── Date (date)
├── Time (time)
├── Duration (text - e.g., "2 hours")
├── Cards Collected (number)
├── Activity Notes (textarea)
└── Buttons: Save, Cancel
```

#### 3. Business Card Management
Digitize and manage business cards:
```
Add Business Card Form:
├── Contact Name (text)
├── Designation (text)
├── Company (text)
├── Phone (tel)
├── Email (email)
├── Lead Type (hot/warm/cold)
├── Notes (textarea)
└── Button: Save Card

Display:
├── Gradient card design
├── All fields visible
├── Lead type badge
└── Auto-sync to Telecaller Contacts
```

#### 4. Events & Expos
Manage events and reminders:
```
Add Event Form:
├── Event Name (text)
├── Location (text)
├── Event Date (date)
└── Button: Add Event

Features:
├── Automatic reminders 1 week before
├── Automatic reminders 1 day before
├── Event list view
└── Attendance tracking
```

#### 5. Goals Tracking
Field executive targets:
```
Daily:
├── Meetings: 2 target

Weekly:
├── Meetings: 12 target

Monthly:
├── Meetings: 48 target
├── BNI 1:1 Meetings: 15 target (monthly)
└── BNI Lead Generation: 20 target (monthly)
```

#### 6. Analytics Dashboard
- **Activity Trend Chart**: Line graph showing activities and cards collected
- **Activity Type Distribution**: Bar chart breakdown
- **Key Metrics Cards**:
  - Total Activities
  - Avg Cards per Event
  - Meeting Conversion %
  - Active Prospects

---

### COLLECTIONS/ACCOUNTS DASHBOARD

#### 1. Dashboard (Overview)
Financial overview:
- **Total Invoices**: Count of all invoices
- **Total Amount**: Sum of all invoice amounts
- **Amount Collected**: Sum of paid amounts
- **Amount Due**: Sum of pending amounts
- **Collection %**: Percentage of collected amount
- **Pending Invoices**: Count of unpaid invoices

#### 2. Invoice Management
```
Features:
├── Create New Invoice
│   ├── Customer Name
│   ├── Email
│   ├── Items (description, qty, rate)
│   ├── Due Date
│   └── Notes
│
├── Upload Excel
│   ├── Bulk import invoices
│   └── Auto-populate fields
│
├── Invoice List
│   ├── Invoice ID (unique auto-generated)
│   ├── Customer Name
│   ├── Amount
│   ├── Due Date
│   ├── Status (draft/sent/pending/paid/overdue)
│   └── Actions (edit, delete, send, pay)
│
└── Invoice Details
    ├── All items listed
    ├── Tax calculation
    ├── Discount application
    ├── Payment status
    └── Download/Print option
```

---

## 🔗 API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "telecaller"
}

Response: { user, token }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { user, token }
```

### Contact Endpoints

#### Get All Contacts
```
GET /api/contacts
Authorization: Bearer {token}
```

#### Create Contact
```
POST /api/contacts
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "company": "Tech Solutions",
  "industry": "Software",
  "phone": "9876543210",
  "email": "rajesh@tech.com",
  "status": "interested",
  "tags": ["hot"]
}
```

#### Update Contact
```
PUT /api/contacts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "negotiation",
  "tags": ["warm"]
}
```

#### Delete Contact
```
DELETE /api/contacts/:id
Authorization: Bearer {token}
```

### Call Log Endpoints

#### Create Call Log
```
POST /api/call-logs
Authorization: Bearer {token}
Content-Type: application/json

{
  "contactId": "60d6f98f4c5a3b2e8f4a5e3c",
  "callDate": "2024-05-15T10:30:00Z",
  "duration": 720,
  "status": "connected",
  "emailSent": true,
  "interested": true,
  "discussion": "Customer interested in demo",
  "nextAction": "Send proposal"
}
```

#### Get Call Logs
```
GET /api/call-logs
Authorization: Bearer {token}
```

### Follow-up Endpoints

#### Create Follow-up
```
POST /api/followups
Authorization: Bearer {token}
Content-Type: application/json

{
  "contactId": "60d6f98f4c5a3b2e8f4a5e3c",
  "dueDate": "2024-05-20T00:00:00Z",
  "status": "pending",
  "notes": "Send proposal and schedule meeting",
  "priority": "high"
}
```

#### Update Follow-up Status
```
PUT /api/followups/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "done",
  "lastNotes": "Customer received proposal, will respond by Friday"
}
```

### Meeting Endpoints

#### Schedule Meeting
```
POST /api/meetings
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Product Demo",
  "contactId": "60d6f98f4c5a3b2e8f4a5e3c",
  "contactName": "Rajesh Kumar",
  "scheduledDate": "2024-05-22T00:00:00Z",
  "scheduledTime": "2:00 PM",
  "location": "Office",
  "meetingType": "in-person",
  "agenda": "Product demo and Q&A"
}
```

#### Get Meetings
```
GET /api/meetings
Authorization: Bearer {token}
```

### Activity Endpoints

#### Log Activity
```
POST /api/activities
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "bni",
  "eventName": "BNI Chamber Networking",
  "location": "Mumbai",
  "activityDate": "2024-05-15T00:00:00Z",
  "startTime": "7:00 AM",
  "endTime": "9:00 AM",
  "duration": 2,
  "businessCardsCollected": 5,
  "connectionsEstablished": 3,
  "notes": "Great connections, interested prospects"
}
```

### Business Card Endpoints

#### Create Business Card
```
POST /api/business-cards
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "designation": "Sales Manager",
  "company": "ABC Corp",
  "phone": "9876543210",
  "email": "john@abccorp.com",
  "leadType": "hot",
  "howMet": "BNI Event",
  "notes": "Very interested in our services"
}
```

#### Sync Card to Contacts
```
POST /api/business-cards/:id/sync
Authorization: Bearer {token}
```

### Invoice Endpoints

#### Create Invoice
```
POST /api/invoices
Authorization: Bearer {token}
Content-Type: application/json

{
  "customerId": "60d6f98f4c5a3b2e8f4a5e3c",
  "customerName": "Rajesh Kumar",
  "customerEmail": "rajesh@tech.com",
  "items": [
    {
      "description": "Software License",
      "quantity": 1,
      "rate": 50000,
      "amount": 50000
    }
  ],
  "totalAmount": 50000,
  "taxAmount": 9000,
  "finalAmount": 59000,
  "dueDate": "2024-05-30T00:00:00Z"
}
```

#### Get Invoices
```
GET /api/invoices
Authorization: Bearer {token}
```

### Payment Endpoints

#### Create Razorpay Order
```
POST /api/payments/create-order
Authorization: Bearer {token}
Content-Type: application/json

{
  "invoiceId": "60d6f98f4c5a3b2e8f4a5e3c",
  "amount": 59000,
  "email": "customer@example.com",
  "phone": "9876543210",
  "description": "Payment for Invoice #INV-001"
}

Response: {
  "id": "order_9lsZiAubEzDdaq",
  "entity": "order",
  "amount": 5900000,
  "currency": "INR",
  "receipt": "INV-001",
  "status": "created",
  "key_id": "rzp_test_xxxxx"
}
```

#### Verify Payment
```
POST /api/payments/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "razorpayOrderId": "order_9lsZiAubEzDdaq",
  "razorpayPaymentId": "pay_9lsZiAubEzDdaq",
  "razorpaySignature": "signature_hash"
}
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin, telecaller, field_executive, accounts),
  phone: String,
  profileImage: String,
  department: String,
  joiningDate: Date,
  isActive: Boolean,
  createdAt: Date
}
```

### Contacts Collection
```javascript
{
  _id: ObjectId,
  name: String,
  company: String,
  industry: String,
  phone: String,
  email: String,
  designation: String,
  address: String,
  status: String (new, interested, negotiation, contacted, pending, closed),
  tags: Array<String> (hot, warm, cold, do_not_call),
  source: String,
  businessCardId: ObjectId,
  createdBy: ObjectId (User reference),
  assignedTo: ObjectId (User reference),
  highlighted: Boolean,
  notes: String,
  lastContactDate: Date,
  nextFollowupDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Call Logs Collection
```javascript
{
  _id: ObjectId,
  contactId: ObjectId,
  telecallerId: ObjectId,
  callDate: Date,
  duration: Number,
  status: String (connected, missed, pending, busy),
  emailSent: Boolean,
  interested: Boolean,
  discussion: String,
  nextAction: String,
  callRecording: String,
  createdAt: Date
}
```

### Invoices Collection
```javascript
{
  _id: ObjectId,
  invoiceNumber: String (unique auto-generated),
  customerId: ObjectId,
  customerName: String,
  customerEmail: String,
  items: Array<{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }>,
  totalAmount: Number,
  taxAmount: Number,
  discountAmount: Number,
  finalAmount: Number,
  invoiceDate: Date,
  dueDate: Date,
  status: String (draft, sent, pending, paid, overdue),
  paymentMethod: String,
  paymentId: String,
  notes: String,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Payments Collection (Razorpay)
```javascript
{
  _id: ObjectId,
  invoiceId: ObjectId,
  razorpayPaymentId: String,
  razorpayOrderId: String,
  amount: Number,
  currency: String (default: 'INR'),
  status: String (pending, authorized, captured, failed, refunded),
  paymentMethod: String,
  email: String,
  phone: String,
  description: String,
  receipt: String,
  notes: Object,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💳 Razorpay Integration

### Setup Steps

1. **Create Razorpay Account**
   - Visit https://razorpay.com
   - Create business account
   - Verify email and phone

2. **Get API Keys**
   - Go to Dashboard → Settings → API Keys
   - Copy Key ID and Key Secret
   - Add to `.env` file

3. **Frontend Implementation**

```javascript
// src/components/PaymentModal.jsx
import React from 'react';

const PaymentModal = ({ invoice }) => {
  const handlePayment = async () => {
    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          invoiceId: invoice._id,
          amount: invoice.finalAmount,
          email: invoice.customerEmail,
          phone: invoice.customerPhone,
          description: `Payment for Invoice #${invoice.invoiceNumber}`
        })
      });

      const order = await orderResponse.json();

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'EPS CRM',
        description: `Invoice #${invoice.invoiceNumber}`,
        order_id: order.id,
        handler: async (response) => {
          // Step 3: Verify payment on backend
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpayOrderId: order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })
          });

          const result = await verifyResponse.json();
          if (result.payment.status === 'captured') {
            alert('Payment successful!');
            // Update UI
          }
        },
        prefill: {
          name: invoice.customerName,
          email: invoice.customerEmail,
          contact: invoice.customerPhone
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      Pay ₹{invoice.finalAmount}
    </button>
  );
};

export default PaymentModal;
```

### Payment Flow Diagram
```
Customer Click Pay
    ↓
Create Order (Backend)
    ↓
Open Razorpay Checkout
    ↓
Customer Enters Card/UPI
    ↓
Razorpay Processes Payment
    ↓
Verify Signature (Backend)
    ↓
Update Invoice Status
    ↓
Send Confirmation Email
```

### Test Credentials
```
Card Number: 4111111111111111
Expiry: Any future month/year
CVV: Any 3 digits
OTP: 123456
```

---

## 🚀 Deployment

### Deploy Backend to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create eps-crm-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set RAZORPAY_KEY_ID=your_key_id
heroku config:set RAZORPAY_KEY_SECRET=your_key_secret

# Deploy
git push heroku main
```

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
REACT_APP_API_URL=https://eps-crm-api.herokuapp.com
REACT_APP_RAZORPAY_KEY_ID=your_key_id
```

### Deploy to AWS

1. **EC2 Instance**
   - Create t2.micro instance
   - Install Node.js and MongoDB
   - Clone repository
   - Configure environment variables
   - Start server with PM2

2. **RDS for Database**
   - Create MongoDB instance
   - Update MONGODB_URI

3. **S3 for File Storage**
   - Create S3 bucket
   - Configure CORS
   - Update AWS credentials

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue 1: MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB service: `mongod`

#### Issue 2: Razorpay Payment Fails
```
Error: Invalid signature
```
**Solution:**
- Verify Razorpay credentials
- Check webhook signature verification
- Ensure test/live mode consistency

#### Issue 3: CORS Errors
```
Access-Control-Allow-Origin error
```
**Solution:**
- Add frontend URL to CORS whitelist in backend
- Update CORS middleware:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yourfrontenddomain.com'
  ]
}));
```

#### Issue 4: Email Not Sending
```
Error: Invalid login credentials
```
**Solution:**
- Use Gmail App Password (not regular password)
- Enable "Less secure app access"
- Generate new app password: https://myaccount.google.com/apppasswords

#### Issue 5: File Upload Fails
```
Error: ENOENT: no such file or directory
```
**Solution:**
- Create uploads directory: `mkdir uploads`
- Verify multer configuration
- Check file permissions

### Debug Mode

Enable debug logging:
```javascript
// In backend .env
DEBUG=eps-crm:*

// In code
const debug = require('debug')('eps-crm:api');
debug('Message');
```

---

## 📞 Support & Contact

For issues and questions:
- Email: support@epscrm.com
- Documentation: https://docs.epscrm.com
- GitHub: https://github.com/epscrm

---

## 📄 License

This project is proprietary and confidential.

---

## 🎓 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

Last Updated: May 2024
Version: 1.0.0
