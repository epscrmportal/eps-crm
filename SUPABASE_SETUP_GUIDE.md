# EPS CRM - Cloud Setup Guide with Supabase

## 🚀 QUICK SETUP (5 minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "Start Your Project"
3. Sign up with email
4. Create a new project (name: "eps-crm")
5. Wait for project to initialize (2-3 minutes)

### Step 2: Get Your Credentials
1. In Supabase dashboard, go to Settings → API
2. Copy:
   - **Project URL** (Supabase URL)
   - **anon public** key (Supabase Anon Key)
3. Keep these safe!

### Step 3: Create Database Tables
Copy and paste each SQL query in Supabase SQL Editor:

#### Table 1: Create CONTACTS table
```sql
CREATE TABLE contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  contact_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  status VARCHAR(50),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all contacts" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert contacts" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON contacts
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Table 2: Create CALLS table
```sql
CREATE TABLE calls (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  contact_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  call_status VARCHAR(50) NOT NULL,
  call_date DATE NOT NULL,
  call_notes TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all calls" ON calls
  FOR SELECT USING (true);

CREATE POLICY "Users can insert calls" ON calls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calls" ON calls
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Table 3: Create MEETINGS table
```sql
CREATE TABLE meetings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  contact_name VARCHAR(255) NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  meeting_type VARCHAR(50) NOT NULL,
  meeting_location TEXT,
  agenda TEXT NOT NULL,
  participant_name VARCHAR(255),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all meetings" ON meetings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings" ON meetings
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Table 4: Create ORDERS table
```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  receiver_name VARCHAR(255),
  receiver_phone VARCHAR(20),
  origin_city VARCHAR(100),
  destination_city VARCHAR(100),
  service_type VARCHAR(50),
  shipping_method VARCHAR(50),
  number_of_boxes INT,
  weight_kg DECIMAL,
  dimensions_length DECIMAL,
  dimensions_width DECIMAL,
  dimensions_height DECIMAL,
  amount DECIMAL,
  payment_method VARCHAR(50),
  status VARCHAR(50),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);
```

### Step 4: Update HTML File
1. Open `eps-crm-cloud.html`
2. Find these lines (around line 500):
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

3. Replace with YOUR credentials:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### Step 5: Test It!
1. Open the HTML file in browser
2. Click "Sign Up" and create account
3. Log in
4. Navigate to Telecaller → Log Call
5. Fill form and click "Save Call"
6. Check Supabase dashboard → Tables → calls (should see your entry!)
7. All users who log in will see the same data!

---

## 📊 DATABASE STRUCTURE

### CONTACTS Table
- `id` - Unique identifier
- `contact_name` - Person's name
- `company_name` - Company
- `phone_number` - Phone
- `email` - Email
- `status` - Active/Inactive
- `user_id` - Who created it
- `created_at` - Timestamp

### CALLS Table
- `id` - Unique identifier
- `contact_name` - Who was called
- `company_name` - Their company
- `phone_number` - Phone dialed
- `call_status` - Completed/Missed/Pending
- `call_date` - Date of call
- `call_notes` - Details
- `user_id` - Who made the call
- `created_at` - Timestamp

### MEETINGS Table
- `id` - Unique identifier
- `contact_name` - Meeting with
- `meeting_date` - When
- `meeting_time` - What time
- `meeting_type` - Call/Video/In-person/Email
- `meeting_location` - Where or link
- `agenda` - Purpose
- `participant_name` - Others attending
- `user_id` - Who scheduled it

### ORDERS Table
- All order details
- Customer info
- Shipping info
- Dimensions
- Amount
- Status tracking

---

## ✅ FEATURES

### ✅ Fully Cloud-Based
- All data saved to Supabase
- Real-time updates
- Visible to all team members

### ✅ Multi-User
- Each user can login
- Authentication included
- Data segregated by user where needed
- Some data shared across team

### ✅ Real-Time Sync
- When one person adds a call
- Everyone sees it immediately
- No manual refresh needed

### ✅ Mobile & Desktop
- Responsive design
- Works on all devices
- Progressive Web App ready

---

## 🔒 SECURITY

### Row Level Security (RLS) Enabled
- Users can only modify their own records
- Can view all records (team visibility)
- Can't delete others' data

### Authentication
- Email/password signup
- Secure JWT tokens
- Session management

### Data Backup
- Supabase auto-backups
- 30-day backup history
- One-click restore

---

## 🚀 DEPLOYMENT OPTIONS

### Option 1: Self-Hosted
- Save HTML file
- Open in browser locally
- Works offline (with local cache)
- Syncs when online

### Option 2: Vercel (Recommended)
1. Commit HTML to GitHub
2. Import to Vercel
3. Get live URL
4. Share with team
5. Everyone accesses same cloud data

### Option 3: GitHub Pages
1. Push HTML to GitHub
2. Enable Pages
3. Get public URL
4. All users see same cloud data

---

## 📱 USAGE

### For Telecallers:
1. Login with email
2. Go to "Log Call" tab
3. Fill contact details
4. Save → Instantly in cloud
5. Everyone sees it!

### For Field Executives:
1. Login with email
2. Schedule meetings
3. Add activities
4. All saved to cloud

### For Collections Team:
1. Login with email
2. Create orders
3. Track payments
4. Real-time updates

### For Managers:
1. See all team activity
2. Monitor metrics
3. Export reports
4. Access anytime, anywhere

---

## 🆘 TROUBLESHOOTING

### "Failed to connect to cloud"
- Check Supabase URL is correct
- Check Anon Key is correct
- Verify tables were created
- Check internet connection

### "Login failed"
- Try sign up first
- Check email is correct
- Verify password

### "Data not saving"
- Check browser console (F12)
- Verify user is authenticated
- Check RLS policies in Supabase

### "Can't see other's data"
- Check RLS SELECT policy
- Verify "USING (true)" in policy
- Refresh page

---

## 📞 SUPPORT

Need help?
1. Check Supabase docs: https://supabase.com/docs
2. Join Supabase community Discord
3. Check browser console for errors
4. Verify table structures match above

---

## 🎉 THAT'S IT!

Your EPS CRM is now fully cloud-based and team-accessible!

**Key Points:**
✅ All data in cloud (Supabase)
✅ Multiple users can access simultaneously
✅ Real-time updates
✅ Secure with authentication
✅ Scalable & reliable
✅ Free tier available

**Next Steps:**
1. Get Supabase URL & Key
2. Create database tables (copy SQL above)
3. Update HTML with credentials
4. Test login & data save
5. Share URL with team
6. Everyone logs in and uses!

---

**Version: 1.0**
**Last Updated: 2024**
**Support: Supabase Community**
