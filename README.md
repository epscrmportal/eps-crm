# 🎯 EPS CRM - Complete Customer Relationship Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-PROPRIETARY-red.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-green.svg)

A comprehensive, production-ready CRM system designed for telecallers, field executives, and accounts teams with integrated payment processing via Razorpay.

---

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🎧 Telecaller Features
- **Dashboard**: Real-time metrics (calls, meetings, deals, followups)
- **Call Logging**: Complete call tracking with discussion notes
- **Contact Management**: Search, filter, and organize contacts
- **Follow-up Tracking**: Automated follow-up scheduling and reminders
- **Meeting Scheduling**: Calendar integration and meeting management
- **Reminders**: Smart reminders for pending follow-ups
- **Email Templates**: Pre-built templates for various scenarios
- **Goal Tracking**: Daily/Weekly/Monthly call and meeting targets
- **Analytics**: Comprehensive performance analytics and reports

### 🚀 Field Executive Features
- **Activity Logging**: Log BNI meetings, events, exhibitions
- **Business Cards**: Digitize and manage business cards
- **Auto-Sync**: Automatically sync cards to telecaller contacts
- **Event Management**: Track and manage events with reminders
- **Goal Tracking**: Meeting and BNI targets
- **Analytics**: Activity trends and performance metrics

### 💰 Accounts/Collections Features
- **Invoice Management**: Create, edit, and manage invoices
- **Bulk Import**: Upload invoices via Excel
- **Payment Processing**: Razorpay integration for online payments
- **Payment Tracking**: Monitor collection status
- **Collection Reports**: Comprehensive financial reports

### 🔐 System Features
- **Role-Based Access**: Separate dashboards for each role
- **Authentication**: JWT-based secure authentication
- **Email Notifications**: Automated email templates
- **Analytics**: Advanced reporting and insights
- **Responsive Design**: Works on desktop and mobile
- **Scalable Architecture**: Built for growth

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────┐
│   Frontend Layer (React)                │
│   ├─ Telecaller Dashboard               │
│   ├─ Field Executive Dashboard          │
│   └─ Accounts Dashboard                 │
└────────────────┬────────────────────────┘
                 │ REST API / Websockets
┌────────────────▼────────────────────────┐
│   Backend Layer (Node.js/Express)       │
│   ├─ Authentication & Authorization     │
│   ├─ Business Logic                     │
│   ├─ Payment Processing                 │
│   └─ Email Notifications                │
└────────────────┬────────────────────────┘
                 │ Database Driver
┌────────────────▼────────────────────────┐
│   Data Layer (MongoDB)                  │
│   ├─ Users & Roles                      │
│   ├─ Contacts & Calls                   │
│   ├─ Activities & Meetings              │
│   └─ Invoices & Payments                │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- npm v6+

### 5-Minute Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd eps-crm

# 2. Install backend
cd backend
cp ../.env.example .env
npm install

# 3. Install frontend
cd ../frontend
npm install

# 4. Configure .env with your values
# - MongoDB URI
# - Razorpay API Keys
# - Email credentials

# 5. Start services
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm start

# Access at http://localhost:3000
```

---

## 📦 Installation

### Detailed Installation Guide

See [QUICK_START.md](./QUICK_START.md) for step-by-step installation instructions.

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Node.js | 14.x | 18.x LTS |
| MongoDB | 4.4 | 6.x |
| RAM | 2GB | 4GB+ |
| Storage | 1GB | 10GB+ |
| CPU | 2 cores | 4+ cores |

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repo-url>
   cd eps-crm
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eps-crm

# JWT
JWT_SECRET=your_secret_key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

See [.env.example](./.env.example) for all available options.

---

## 📱 Usage Guide

### Telecaller Workflow

1. **Login** with Telecaller credentials
2. **View Dashboard** - Check metrics and targets
3. **Log Call** - Record customer interactions
4. **Manage Contacts** - Search and filter contacts
5. **Schedule Follow-ups** - Set follow-up dates
6. **Track Reminders** - Get notified of pending actions
7. **View Analytics** - Monitor performance

### Field Executive Workflow

1. **Login** with Field Executive credentials
2. **Log Activities** - Record BNI meetings, events
3. **Add Business Cards** - Digitize contact information
4. **Manage Events** - Schedule and track events
5. **Monitor Goals** - Track meeting targets
6. **View Analytics** - Analyze activity trends

### Accounts Workflow

1. **Login** with Accounts credentials
2. **Create Invoices** - Generate customer invoices
3. **Upload Bulk** - Import invoices via Excel
4. **Process Payments** - Integrate with Razorpay
5. **Track Collections** - Monitor payment status
6. **Generate Reports** - View collection analytics

---

## 🔗 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

#### Contacts
- `GET /contacts` - List all contacts
- `POST /contacts` - Create contact
- `GET /contacts/:id` - Get contact details
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

#### Call Logs
- `POST /call-logs` - Create call log
- `GET /call-logs` - Get call logs
- `PUT /call-logs/:id` - Update call log

#### Follow-ups
- `POST /followups` - Create follow-up
- `GET /followups` - Get follow-ups
- `PUT /followups/:id` - Update follow-up status

#### Invoices & Payments
- `POST /invoices` - Create invoice
- `GET /invoices` - Get invoices
- `POST /payments/create-order` - Create Razorpay order
- `POST /payments/verify` - Verify payment

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete API documentation.

---

## 💳 Razorpay Integration

### Setup Steps

1. **Create Razorpay Account**
   - Visit https://razorpay.com
   - Sign up for business account
   - Verify credentials

2. **Get API Keys**
   - Go to Settings → API Keys
   - Copy Key ID and Key Secret
   - Add to `.env` file

3. **Test Integration**
   - Use test keys for development
   - Test card: 4111 1111 1111 1111
   - Any future date and CVV

4. **Production Keys**
   - Switch to live keys after testing
   - Update `.env` before deployment

### Payment Flow
```
Customer Creates Invoice
    ↓
Click "Pay Now"
    ↓
Backend Creates Razorpay Order
    ↓
Frontend Opens Razorpay Checkout
    ↓
Customer Enters Payment Details
    ↓
Razorpay Processes Payment
    ↓
Backend Verifies Signature
    ↓
Update Invoice Status to "Paid"
    ↓
Send Confirmation Email
```

---

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create eps-crm-api

# Set environment variables
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Deploy to AWS

1. **EC2 Instance**
   - Create t2.micro instance
   - Install Node.js and MongoDB
   - Clone repository

2. **Configure & Start**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Database**
   - Use RDS for MongoDB
   - Or use MongoDB Atlas (recommended)

### Production Checklist

- [ ] Use HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Update JWT_SECRET to strong value
- [ ] Use MongoDB Atlas (cloud)
- [ ] Set secure CORS origins
- [ ] Enable error logging
- [ ] Configure backups
- [ ] Set up monitoring
- [ ] Use PM2 for process management

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Use MongoDB Atlas for cloud

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill process on port
lsof -i :5000
kill -9 <PID>
```

#### Razorpay Payment Fails
- Verify API keys are correct
- Check test/live mode consistency
- Ensure webhook signature is valid

#### Email Not Sending
- Use Gmail App Password (not regular password)
- Generate at: https://myaccount.google.com/apppasswords
- Enable "Less secure app access"

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

---

## 📊 Project Structure

```
eps-crm/
├── backend/
│   ├── server.js              # Main server file
│   ├── routes/                # API routes
│   ├── models/                # Database models
│   ├── middleware/            # Authentication, validation
│   ├── controllers/           # Business logic
│   ├── config/                # Configuration files
│   ├── package.json
│   ├── .env
│   └── uploads/               # File uploads
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   ├── context/           # React context
│   │   └── styles/            # CSS files
│   ├── public/
│   ├── package.json
│   └── .env
│
├── docs/
│   ├── SETUP_GUIDE.md         # Complete setup guide
│   ├── QUICK_START.md         # Quick start guide
│   ├── API.md                 # API documentation
│   └── DATABASE.md            # Database schema
│
├── .env.example
├── package.json
└── README.md
```

---

## 🔄 Workflow Diagrams

### Telecaller Call Flow
```
Login → Dashboard → Log Call → Add Contact → Schedule Follow-up → Reminder → Track Call Status
```

### Field Executive Activity Flow
```
Login → Log Activity → Collect Business Card → Sync to Contacts → Schedule Event → Track Metrics
```

### Invoice & Payment Flow
```
Create Invoice → Send to Customer → Customer Pays (Razorpay) → Verify Payment → Mark Paid → Send Receipt
```

---

## 📈 Analytics & Reporting

### Telecaller Analytics
- Total calls and call conversion rates
- Meeting success rates
- Top performing contacts
- Monthly activity trends

### Field Executive Analytics
- Activities per month
- Business cards collected
- Events attended
- Connection metrics

### Collections Analytics
- Total invoiced amount
- Collection percentage
- Payment trends
- Outstanding invoices

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **CORS Protection** - Cross-origin request filtering
- **Rate Limiting** - API rate limiting
- **Input Validation** - Server-side validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Sanitized output
- **HTTPS/SSL** - Secure data transmission

---

## 📝 Change Log

### Version 1.0.0 (2024-05-15)
- Initial release
- All core features implemented
- Razorpay integration
- Full documentation

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

---

## 📄 License

This project is **PROPRIETARY AND CONFIDENTIAL**. 
Unauthorized use, reproduction, or distribution is strictly prohibited.

---

## 📞 Support

- **Documentation**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Quick Start**: See [QUICK_START.md](./QUICK_START.md)
- **Issues**: Check [SETUP_GUIDE.md#troubleshooting](./SETUP_GUIDE.md)
- **Contact**: support@epscrm.com

---

## 🙏 Acknowledgments

Built with:
- React.js - UI Framework
- Express.js - Backend Framework
- MongoDB - Database
- Razorpay - Payment Gateway
- Recharts - Data Visualization
- Tailwind CSS - Styling

---

## 📊 Stats

- **Lines of Code**: 5000+
- **API Endpoints**: 50+
- **Database Collections**: 11
- **React Components**: 20+
- **Features**: 100+
- **Documentation Pages**: 10+

---

**Last Updated**: May 2024  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

---

## 🎉 Get Started Now!

1. Read [QUICK_START.md](./QUICK_START.md) for 5-minute setup
2. Review [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed configuration
3. Explore the application and customize to your needs
4. Deploy to production

**Happy CRMing! 🚀**
