/**
 * EPS CRM Backend API - Complete Implementation
 * Node.js + Express + MongoDB + Razorpay Integration
 */

// ===========================
// 1. DEPENDENCIES & SETUP
// ===========================
/*
npm install express mongoose cors dotenv razorpay bcryptjs jsonwebtoken multer xlsx nodemailer
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ===========================
// 2. DATABASE SETUP
// ===========================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eps-crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ===========================
// 3. DATABASE SCHEMAS
// ===========================

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'telecaller', 'field_executive', 'accounts'] },
  phone: String,
  profileImage: String,
  department: String,
  joiningDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  company: String,
  industry: String,
  phone: String,
  email: String,
  designation: String,
  address: String,
  status: { type: String, enum: ['new', 'interested', 'negotiation', 'contacted', 'pending', 'closed'] },
  tags: [{ type: String, enum: ['hot', 'warm', 'cold', 'do_not_call'] }],
  source: String,
  businessCardId: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
  assignedTo: mongoose.Schema.Types.ObjectId,
  highlighted: { type: Boolean, default: false },
  notes: String,
  lastContactDate: Date,
  nextFollowupDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Call Log Schema
const CallLogSchema = new mongoose.Schema({
  contactId: mongoose.Schema.Types.ObjectId,
  telecallerId: mongoose.Schema.Types.ObjectId,
  callDate: { type: Date, default: Date.now },
  duration: Number, // in seconds
  status: { type: String, enum: ['connected', 'missed', 'pending', 'busy'] },
  emailSent: Boolean,
  interested: Boolean,
  discussion: String,
  nextAction: String,
  callRecording: String, // URL to recording if available
  createdAt: { type: Date, default: Date.now }
});

// Follow-up Schema
const FollowupSchema = new mongoose.Schema({
  contactId: mongoose.Schema.Types.ObjectId,
  telecallerId: mongoose.Schema.Types.ObjectId,
  dueDate: Date,
  status: { type: String, enum: ['pending', 'done', 'deal_closed', 'rescheduled'] },
  notes: String,
  priority: { type: String, enum: ['low', 'medium', 'high'] },
  lastNotes: String,
  completedDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Meeting Schema
const MeetingSchema = new mongoose.Schema({
  title: String,
  contactId: mongoose.Schema.Types.ObjectId,
  contactName: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  scheduledDate: Date,
  scheduledTime: String,
  location: String,
  meetingType: { type: String, enum: ['call', 'in-person', 'video'] },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'] },
  attendees: [String],
  agenda: String,
  notes: String,
  outcome: String,
  nextSteps: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Activity Log Schema (Field Executive)
const ActivityLogSchema = new mongoose.Schema({
  fieldExecutiveId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ['bni', 'exhibition', 'client_meeting', 'event', 'one_to_one'] },
  eventName: String,
  location: String,
  activityDate: Date,
  startTime: String,
  endTime: String,
  duration: Number, // in hours
  businessCardsCollected: Number,
  connectionsEstablished: Number,
  notes: String,
  attachments: [String],
  createdAt: { type: Date, default: Date.now }
});

// Business Card Schema
const BusinessCardSchema = new mongoose.Schema({
  name: String,
  designation: String,
  company: String,
  phone: String,
  email: String,
  address: String,
  leadType: { type: String, enum: ['hot', 'warm', 'cold'] },
  howMet: String,
  notes: String,
  fieldExecutiveId: mongoose.Schema.Types.ObjectId,
  collectedDate: { type: Date, default: Date.now },
  syncedToContacts: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Event Schema
const EventSchema = new mongoose.Schema({
  eventName: String,
  description: String,
  location: String,
  eventDate: Date,
  eventTime: String,
  eventType: { type: String, enum: ['bni', 'exhibition', 'webinar', 'conference', 'networking'] },
  createdBy: mongoose.Schema.Types.ObjectId,
  attendees: [mongoose.Schema.Types.ObjectId],
  reminders: { type: Boolean, default: true },
  reminderDates: [Date],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Invoice Schema
const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  customerId: mongoose.Schema.Types.ObjectId,
  customerName: String,
  customerEmail: String,
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  totalAmount: Number,
  taxAmount: Number,
  discountAmount: Number,
  finalAmount: Number,
  invoiceDate: { type: Date, default: Date.now },
  dueDate: Date,
  status: { type: String, enum: ['draft', 'sent', 'pending', 'paid', 'overdue'] },
  paymentMethod: String,
  paymentId: String, // Razorpay payment ID
  notes: String,
  attachments: [String],
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Payment Schema (Razorpay Integration)
const PaymentSchema = new mongoose.Schema({
  invoiceId: mongoose.Schema.Types.ObjectId,
  razorpayPaymentId: String,
  razorpayOrderId: String,
  amount: Number,
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'authorized', 'captured', 'failed', 'refunded'] },
  paymentMethod: String,
  email: String,
  phone: String,
  description: String,
  receipt: String,
  notes: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Goal Schema
const GoalSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userRole: String,
  goalType: String, // 'calls', 'meetings', 'deals', etc.
  dailyTarget: Number,
  weeklyTarget: Number,
  monthlyTarget: Number,
  dailyActual: Number,
  weeklyActual: Number,
  monthlyActual: Number,
  month: String,
  year: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', UserSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const CallLog = mongoose.model('CallLog', CallLogSchema);
const Followup = mongoose.model('Followup', FollowupSchema);
const Meeting = mongoose.model('Meeting', MeetingSchema);
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
const BusinessCard = mongoose.model('BusinessCard', BusinessCardSchema);
const Event = mongoose.model('Event', EventSchema);
const Invoice = mongoose.model('Invoice', InvoiceSchema);
const Payment = mongoose.model('Payment', PaymentSchema);
const Goal = mongoose.model('Goal', GoalSchema);

// ===========================
// 4. RAZORPAY SETUP
// ===========================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ===========================
// 5. AUTHENTICATION MIDDLEWARE
// ===========================

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// ===========================
// 6. AUTH ROUTES
// ===========================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 7. CONTACT ROUTES
// ===========================

// Get all contacts
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contact by ID
app.get('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contact
app.post('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contact = new Contact({
      ...req.body,
      createdBy: req.user.id,
      assignedTo: req.user.id
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact
app.put('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete contact
app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 8. CALL LOG ROUTES
// ===========================

app.post('/api/call-logs', authenticateToken, authorizeRole(['telecaller']), async (req, res) => {
  try {
    const callLog = new CallLog({
      ...req.body,
      telecallerId: req.user.id
    });
    await callLog.save();

    // Update contact's last contact date
    await Contact.findByIdAndUpdate(req.body.contactId, {
      lastContactDate: new Date()
    });

    res.status(201).json(callLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/call-logs', authenticateToken, async (req, res) => {
  try {
    const callLogs = await CallLog.find({ telecallerId: req.user.id });
    res.json(callLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 9. FOLLOW-UP ROUTES
// ===========================

app.post('/api/followups', authenticateToken, authorizeRole(['telecaller']), async (req, res) => {
  try {
    const followup = new Followup({
      ...req.body,
      telecallerId: req.user.id
    });
    await followup.save();
    res.status(201).json(followup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/followups', authenticateToken, async (req, res) => {
  try {
    const followups = await Followup.find({ telecallerId: req.user.id });
    res.json(followups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/followups/:id', authenticateToken, async (req, res) => {
  try {
    const followup = await Followup.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(followup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 10. MEETING ROUTES
// ===========================

app.post('/api/meetings', authenticateToken, async (req, res) => {
  try {
    const meeting = new Meeting({
      ...req.body,
      createdBy: req.user.id
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/meetings', authenticateToken, async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 11. ACTIVITY LOG ROUTES
// ===========================

app.post('/api/activities', authenticateToken, authorizeRole(['field_executive']), async (req, res) => {
  try {
    const activity = new ActivityLog({
      ...req.body,
      fieldExecutiveId: req.user.id
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/activities', authenticateToken, async (req, res) => {
  try {
    const activities = await ActivityLog.find({ fieldExecutiveId: req.user.id });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 12. BUSINESS CARD ROUTES
// ===========================

app.post('/api/business-cards', authenticateToken, authorizeRole(['field_executive']), async (req, res) => {
  try {
    const card = new BusinessCard({
      ...req.body,
      fieldExecutiveId: req.user.id
    });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/business-cards', authenticateToken, async (req, res) => {
  try {
    const cards = await BusinessCard.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync business card to contacts
app.post('/api/business-cards/:id/sync', authenticateToken, async (req, res) => {
  try {
    const card = await BusinessCard.findById(req.params.id);
    
    const contact = new Contact({
      name: card.name,
      designation: card.designation,
      company: card.company,
      phone: card.phone,
      email: card.email,
      leadType: card.leadType,
      status: 'new',
      tags: [card.leadType],
      businessCardId: card._id,
      highlighted: true,
      createdBy: req.user.id
    });

    await contact.save();
    await BusinessCard.findByIdAndUpdate(req.params.id, { syncedToContacts: true });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 13. INVOICE ROUTES
// ===========================

app.post('/api/invoices', authenticateToken, authorizeRole(['accounts']), async (req, res) => {
  try {
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice = new Invoice({
      ...req.body,
      invoiceNumber,
      createdBy: req.user.id
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/invoices', authenticateToken, async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 14. RAZORPAY PAYMENT ROUTES
// ===========================

// Create Razorpay order
app.post('/api/payments/create-order', authenticateToken, async (req, res) => {
  try {
    const { invoiceId, amount, email, phone, description } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: invoiceId,
      payment_capture: 1,
      notes: {
        invoiceId,
        userId: req.user.id
      }
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      invoiceId,
      razorpayOrderId: order.id,
      amount,
      email,
      phone,
      description,
      status: 'pending'
    });

    await payment.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
app.post('/api/payments/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (razorpaySignature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        status: 'captured'
      },
      { new: true }
    );

    // Update invoice status
    await Invoice.findByIdAndUpdate(payment.invoiceId, {
      status: 'paid',
      paymentId: razorpayPaymentId
    });

    res.json({ message: 'Payment verified successfully', payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 15. GOAL ROUTES
// ===========================

app.post('/api/goals', authenticateToken, async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      userId: req.user.id
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 16. ANALYTICS ROUTES
// ===========================

app.get('/api/analytics/telecaller', authenticateToken, authorizeRole(['telecaller']), async (req, res) => {
  try {
    const callLogs = await CallLog.find({ telecallerId: req.user.id });
    const followups = await Followup.find({ telecallerId: req.user.id });
    const meetings = await Meeting.find({ createdBy: req.user.id });

    const stats = {
      totalCalls: callLogs.length,
      connectedCalls: callLogs.filter(c => c.status === 'connected').length,
      missedCalls: callLogs.filter(c => c.status === 'missed').length,
      totalFollowups: followups.length,
      pendingFollowups: followups.filter(f => f.status === 'pending').length,
      totalMeetings: meetings.length,
      conversionRate: ((callLogs.filter(c => c.interested).length / callLogs.length) * 100).toFixed(2)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/field-executive', authenticateToken, authorizeRole(['field_executive']), async (req, res) => {
  try {
    const activities = await ActivityLog.find({ fieldExecutiveId: req.user.id });
    const cards = await BusinessCard.find({ fieldExecutiveId: req.user.id });

    const stats = {
      totalActivities: activities.length,
      businessCardsCollected: cards.length,
      totalConnectionsMade: activities.reduce((sum, a) => sum + a.connectionsEstablished, 0),
      avgCardsPerEvent: (cards.length / activities.length).toFixed(2)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 17. FILE UPLOAD (EXCEL INVOICES)
// ===========================

const storage = multer.disk({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.post('/api/invoices/upload', authenticateToken, authorizeRole(['accounts']), upload.single('file'), async (req, res) => {
  try {
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const invoices = await Promise.all(
      data.map(row => {
        const invoice = new Invoice({
          invoiceNumber: `INV-${Date.now()}`,
          customerName: row.customerName,
          customerEmail: row.customerEmail,
          finalAmount: row.amount,
          dueDate: new Date(row.dueDate),
          items: [{
            description: row.description,
            quantity: row.quantity || 1,
            rate: row.rate,
            amount: row.amount
          }],
          createdBy: req.user.id
        });
        return invoice.save();
      })
    );

    res.json({ message: 'Invoices created', invoices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 18. EMAIL NOTIFICATIONS
// ===========================

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/email/send-template', authenticateToken, async (req, res) => {
  try {
    const { to, template, variables } = req.body;

    const templates = {
      meeting: {
        subject: 'Meeting Confirmation',
        html: `<p>Dear ${variables.name},</p><p>Your meeting is confirmed for ${variables.date} at ${variables.time}.</p>`
      },
      proposal: {
        subject: 'Proposal for Your Review',
        html: `<p>Dear ${variables.name},</p><p>Please find attached our proposal.</p>`
      }
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: templates[template].subject,
      html: templates[template].html
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 19. START SERVER
// ===========================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EPS CRM Server running on port ${PORT}`);
});

// ===========================
// 20. ENVIRONMENT VARIABLES (.env)
// ===========================

/*
MONGODB_URI=mongodb://localhost:27017/eps-crm
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PORT=5000
*/

module.exports = app;
