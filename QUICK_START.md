# 🚀 EPS CRM - Quick Start Guide

## 📦 What You've Received

You now have a complete, production-ready EPS CRM system consisting of:

1. **Frontend React Application** (`eps-crm-app.jsx`)
   - Fully functional UI for all three roles
   - Responsive dashboard design
   - Charts and analytics
   - Form management

2. **Backend API Server** (`backend-api-structure.js`)
   - Complete Express.js REST API
   - MongoDB database schemas
   - Razorpay payment integration
   - JWT authentication
   - Email notifications

3. **Complete Documentation** (`SETUP_GUIDE.md`)
   - Detailed setup instructions
   - API endpoint documentation
   - Database schema specifications
   - Troubleshooting guide

4. **Configuration Files**
   - `package.json` - Root package configuration
   - `backend-package.json` - Backend dependencies
   - `frontend-package.json` - Frontend dependencies
   - `.env.example` - Environment variables template

---

## ⚡ 5-Minute Quick Setup

### Step 1: Install Node.js & MongoDB
```bash
# Download Node.js from https://nodejs.org/ (v14 or higher)
# Download MongoDB from https://www.mongodb.com/try/download/community

# Verify installation
node --version
npm --version
mongod --version
```

### Step 2: Project Setup
```bash
# Create project directory
mkdir eps-crm
cd eps-crm

# Create backend folder
mkdir backend
cd backend

# Copy backend API code to server.js
# Copy backend-package.json to package.json
npm install

# Create .env file and add your configuration
cp ../.env.example .env

# Edit .env with your actual values
# - MongoDB URI
# - JWT_SECRET
# - Razorpay keys
# - Email credentials
```

### Step 3: Frontend Setup
```bash
# Go back to root and create frontend folder
cd ..
mkdir frontend
cd frontend

# Copy frontend-package.json to package.json
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "REACT_APP_RAZORPAY_KEY_ID=your_key_id" >> .env

# Copy React app code
# Paste the content of eps-crm-app.jsx into src/App.jsx
```

### Step 4: Start Services
```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Backend
cd backend
npm run dev

# Terminal 3 - Start Frontend
cd frontend
npm start
```

### Step 5: Access Application
```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
```

---

## 🔐 Default Test Users

Create these test users by registering through the login page:

### Telecaller Account
```
Email: telecaller@test.com
Password: Test@123
Role: telecaller
```

### Field Executive Account
```
Email: fieldexec@test.com
Password: Test@123
Role: field_executive
```

### Accounts/Collections Account
```
Email: accounts@test.com
Password: Test@123
Role: accounts
```

---

## 🔧 Configuration Checklist

- [ ] MongoDB running locally or MongoDB Atlas connection string set
- [ ] `.env` file created with all required variables
- [ ] Razorpay account created and API keys added
- [ ] Gmail App Password generated for email service
- [ ] Node modules installed for both backend and frontend
- [ ] No port conflicts (3000 for React, 5000 for API)

---

## 📂 Project Structure

```
eps-crm/
├── backend/
│   ├── server.js (Backend API)
│   ├── package.json
│   ├── .env
│   └── uploads/ (for file uploads)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx (Main React app)
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── .env
│   └── public/
│
├── .env.example
├── SETUP_GUIDE.md
└── README.md
```

---

## 🎯 First Actions After Setup

1. **Login to Application**
   - Select role from dashboard
   - Use test credentials

2. **Explore Telecaller Dashboard**
   - View dashboard metrics
   - Create a new contact
   - Log a call
   - Add follow-up

3. **Explore Field Executive Dashboard**
   - Log an activity
   - Add business card
   - Add event

4. **Test Payments (if Razorpay configured)**
   - Create invoice
   - Try payment with test card: 4111111111111111
   - Verify payment processing

5. **Test Email (if configured)**
   - Send email template
   - Check inbox for notifications

---

## 🚨 Common Issues & Quick Fixes

### "Cannot find module 'express'"
```bash
cd backend
npm install
```

### MongoDB Connection Failed
```bash
# Start MongoDB service
mongod

# Or use MongoDB Atlas cloud:
# Update MONGODB_URI in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eps-crm
```

### Port 3000 Already in Use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### "Cannot find Razorpay keys"
- Get keys from: https://dashboard.razorpay.com/app/keys
- Add to .env file

---

## 📊 Features Overview

### Telecaller Features
- ✅ Dashboard with call metrics
- ✅ Log new calls with detailed information
- ✅ Manage contacts with search
- ✅ Track follow-ups with status updates
- ✅ Set meeting schedules
- ✅ View reminders
- ✅ Email templates library
- ✅ Goal tracking (calls, meetings)
- ✅ Analytics and reporting

### Field Executive Features
- ✅ Dashboard with activity metrics
- ✅ Log activities (BNI, events, meetings)
- ✅ Digitize business cards
- ✅ Auto-sync cards to contacts
- ✅ Manage events & expos
- ✅ Track goals (meetings, BNI)
- ✅ Activity analytics

### Accounts/Collections Features
- ✅ Invoice management
- ✅ Create/edit invoices
- ✅ Upload invoices via Excel
- ✅ Razorpay payment processing
- ✅ Payment tracking
- ✅ Collection reports

---

## 🔗 API Testing

### Test with Postman

1. **Register User**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "Test@123",
  "role": "telecaller"
}
```

2. **Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@test.com",
  "password": "Test@123"
}

Response includes: { user, token }
```

3. **Create Contact**
```
POST http://localhost:5000/api/contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "company": "Tech Corp",
  "industry": "Software",
  "phone": "9876543210",
  "email": "rajesh@tech.com",
  "status": "interested",
  "tags": ["hot"]
}
```

---

## 💾 Database Backup

### Automatic Backups (recommended)
```bash
# Install mongodump and mongorestore
# Create backup script

# Backup command
mongodump --db eps-crm --out ./backups

# Restore command
mongorestore ./backups/eps-crm
```

### Export/Import Data
```bash
# Export to JSON
mongoexport --db eps-crm --collection contacts --out contacts.json

# Import from JSON
mongoimport --db eps-crm --collection contacts --file contacts.json
```

---

## 🌐 Deployment Preparation

### Before Production Deployment

1. **Security**
   - [ ] Change all default passwords
   - [ ] Update JWT_SECRET to strong value
   - [ ] Enable HTTPS/SSL
   - [ ] Set COOKIE_SECURE=true
   - [ ] Enable CSRF protection

2. **Database**
   - [ ] Use MongoDB Atlas (cloud)
   - [ ] Enable authentication
   - [ ] Regular backups enabled
   - [ ] Database indexing optimized

3. **Environment**
   - [ ] NODE_ENV=production
   - [ ] All .env variables configured
   - [ ] Error logging enabled
   - [ ] Performance monitoring setup

4. **Testing**
   - [ ] All features tested
   - [ ] Payment flow tested with test keys
   - [ ] Email notifications working
   - [ ] File uploads working

---

## 📞 Support Resources

### Documentation Files
- `SETUP_GUIDE.md` - Complete setup and configuration
- `README.md` - Project overview
- API Documentation - In SETUP_GUIDE.md

### External Resources
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Razorpay API Documentation](https://razorpay.com/docs/api/)

### Getting Help
1. Check SETUP_GUIDE.md troubleshooting section
2. Review error messages in console
3. Check MongoDB/Node.js logs
4. Verify .env configuration

---

## 📝 Next Steps

1. **Customize**
   - Update company name/logo
   - Adjust color scheme
   - Modify email templates
   - Update default goals

2. **Add Features**
   - Integration with Salesforce/HubSpot
   - SMS notifications (Twilio)
   - WhatsApp integration
   - Advanced reporting

3. **Optimize**
   - Implement caching (Redis)
   - Database indexing
   - API rate limiting
   - Performance monitoring

4. **Deploy**
   - Choose hosting (Heroku, AWS, DigitalOcean)
   - Set up CI/CD pipeline
   - Configure monitoring
   - Plan scaling strategy

---

## 🎓 Learning Path

**Week 1: Basic Setup**
- Complete installation
- Explore all dashboards
- Test all features
- Review API documentation

**Week 2: Customization**
- Modify UI/styling
- Add custom fields
- Configure integrations
- Set up email templates

**Week 3: Deployment**
- Prepare for production
- Deploy to cloud
- Set up monitoring
- Create backup strategy

**Week 4: Optimization**
- Performance tuning
- User feedback implementation
- Bug fixes
- Feature additions

---

## ✅ Success Checklist

- [ ] Application running locally
- [ ] All three dashboards accessible
- [ ] Can create contacts, calls, activities
- [ ] Follow-ups working
- [ ] Meetings can be scheduled
- [ ] Razorpay payment configured
- [ ] Email notifications working
- [ ] Analytics displaying data
- [ ] Goals tracking set up
- [ ] Ready for production deployment

---

## 📄 License

This project is proprietary and confidential. Unauthorized use is prohibited.

---

**Happy CRMing! 🎉**

For questions or issues, refer to SETUP_GUIDE.md or contact support.

Last Updated: May 2024
