# EPS CRM - Git & GitHub Setup Guide

## 🎯 QUICK START - 10 MINUTES

### Prerequisites
- Download Git: https://git-scm.com/download
- Create GitHub account: https://github.com/signup
- Have all project files ready

---

## 📋 STEP-BY-STEP SETUP

### STEP 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name:** `eps-crm-cloud`
   - **Description:** "Enterprise CRM System with Supabase Cloud Integration"
   - **Public/Private:** Public (easier for deployment)
   - **Add README:** YES
   - **Add .gitignore:** Select "Node"
   - **License:** MIT
3. Click **Create Repository**
4. Copy the HTTPS URL (looks like: `https://github.com/YOUR_USERNAME/eps-crm-cloud.git`)

---

### STEP 2: Setup Git on Your Computer

#### Windows/Mac/Linux:
Open terminal/command prompt and run:

```bash
# Configure Git with your name and email
git config --global user.name "Your Full Name"
git config --global user.email "your@email.com"

# Verify setup
git config --global user.name
git config --global user.email
```

Replace with YOUR actual name and email!

---

### STEP 3: Clone Repository to Your Computer

```bash
# Create a folder for your project
mkdir my-projects
cd my-projects

# Clone the repository
git clone https://github.com/YOUR_USERNAME/eps-crm-cloud.git

# Navigate into the folder
cd eps-crm-cloud
```

Replace `YOUR_USERNAME` with your GitHub username!

---

### STEP 4: Copy All Project Files

Copy these files into the `eps-crm-cloud` folder:

```
eps-crm-cloud/
├── README.md (already there)
├── eps-crm-cloud.html
├── eps-crm-complete.html
├── SUPABASE_SETUP_GUIDE.md
├── CLOUD_QUICK_REFERENCE.txt
├── INDEX.md
├── SETUP_GUIDE.md
├── .gitignore (created automatically)
└── (any other project files)
```

---

### STEP 5: Create .gitignore File

Create a file named `.gitignore` in the root folder with:

```
# Environment variables - NEVER commit these!
.env
.env.local
.env.*.local

# Node modules
node_modules/
npm-debug.log
yarn-error.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Cache
.cache/
dist/

# API Keys - SECURITY!
*-key.txt
*-credentials.json
supabase-credentials.txt
```

**WHY?** Never commit sensitive info like API keys!

---

### STEP 6: Create .env.example File

Create a file named `.env.example`:

```
# Supabase Configuration (EXAMPLE ONLY - Replace with actual values)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here

# Firebase (if using)
FIREBASE_API_KEY=your-firebase-key
FIREBASE_PROJECT_ID=your-project-id

# Application Settings
NODE_ENV=production
APP_NAME=EPS CRM Cloud
APP_VERSION=1.0.0
```

**WHY?** Shows team what environment variables are needed WITHOUT exposing secrets!

---

### STEP 7: Create a Good README.md

Replace the default README with:

```markdown
# 📊 EPS CRM - Cloud-Based System

Enterprise Customer Relationship Management System with Real-Time Cloud Sync

## ✨ Features

- ☁️ **100% Cloud-Based** - Supabase PostgreSQL
- 👥 **Multi-User** - Team collaboration
- 🔄 **Real-Time Sync** - Instant updates
- 📱 **Mobile Friendly** - Responsive design
- 🔒 **Secure** - JWT authentication
- 📊 **Dashboard** - Key metrics & analytics

## 🚀 Quick Start

### 1. Get Supabase Credentials
- Visit https://supabase.com
- Create project
- Copy Project URL & Anon Key

### 2. Setup Database
- Open Supabase SQL Editor
- Copy queries from `SUPABASE_SETUP_GUIDE.md`
- Create all 4 tables

### 3. Configure App
- Open `eps-crm-cloud.html`
- Update lines with your credentials:
```javascript
const SUPABASE_URL = 'your-url';
const SUPABASE_ANON_KEY = 'your-key';
```

### 4. Open in Browser
- Double-click `eps-crm-cloud.html`
- Sign up with email
- Start using!

## 📋 Files

| File | Purpose |
|------|---------|
| `eps-crm-cloud.html` | Main application |
| `SUPABASE_SETUP_GUIDE.md` | Detailed setup |
| `CLOUD_QUICK_REFERENCE.txt` | Quick start |
| `.env.example` | Environment template |

## 🔧 Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Real-Time:** Supabase Realtime
- **Storage:** Supabase Storage

## 🔒 Security

- ✅ Row-Level Security (RLS)
- ✅ JWT Authentication
- ✅ Encrypted Passwords
- ✅ Environment Variables
- ✅ Never commit secrets

## 📚 Documentation

1. Start: `CLOUD_QUICK_REFERENCE.txt`
2. Setup: `SUPABASE_SETUP_GUIDE.md`
3. Full: `SETUP_GUIDE.md`

## 🚀 Deployment

### Option 1: Local
```bash
# Just open the HTML file
open eps-crm-cloud.html
```

### Option 2: Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy on Vercel
# 1. Go to vercel.com
# 2. Import this repo
# 3. Deploy
```

### Option 3: GitHub Pages
```bash
# Already in GitHub
# Enable Pages in Settings
# Your site goes live!
```

## 👥 Team Usage

1. Each team member clones repo
2. Copy `.env.example` to `.env`
3. Add their credentials
4. Open `eps-crm-cloud.html`
5. Sign up and use!

## 🆘 Troubleshooting

**"Failed to connect to cloud"**
- Check Supabase URL
- Check API key
- Verify tables created

**"Login failed"**
- Try sign up first
- Check email format
- Verify Supabase auth enabled

**"Data not saving"**
- Open browser console (F12)
- Check for errors
- Verify RLS policies

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- GitHub Issues: Create an issue
- Community: Supabase Discord

## 📝 License

MIT License - Free to use and modify

## 🎉 Ready to Deploy?

1. ✅ Clone this repo
2. ✅ Get Supabase credentials
3. ✅ Update HTML
4. ✅ Open in browser
5. ✅ Share with team!

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Ready for Production ✅
```

---

### STEP 8: Check Git Status

```bash
# Navigate to project folder
cd eps-crm-cloud

# Check what files are ready to commit
git status
```

You should see something like:
```
On branch main
Changes not staged for commit:
  modified:   README.md
  
Untracked files:
  eps-crm-cloud.html
  SUPABASE_SETUP_GUIDE.md
  CLOUD_QUICK_REFERENCE.txt
  .env.example
```

---

### STEP 9: Add Files to Git

```bash
# Add all files
git add .

# Verify files are staged
git status
```

---

### STEP 10: Create Your First Commit

```bash
# Commit with a message
git commit -m "Initial commit: Add EPS CRM cloud application

- Add eps-crm-cloud.html with Supabase integration
- Add comprehensive setup guide
- Add quick reference card
- Add environment template
- Update README with documentation"
```

**Good commit messages should:**
- Start with action verb (Add, Fix, Update, Remove)
- Be clear and descriptive
- Explain WHAT and WHY

---

### STEP 11: Push to GitHub

```bash
# Push to remote repository
git push origin main

# Or if your default branch is 'master'
git push origin master
```

You should see:
```
Enumerating objects: 10, done.
Counting objects: 100% (10/10), done.
...
To https://github.com/YOUR_USERNAME/eps-crm-cloud.git
   abc1234..def5678  main -> main
```

---

### STEP 12: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/eps-crm-cloud
2. Check all files are there ✅
3. Check README displays nicely
4. Copy the HTTPS URL to share

---

## 📝 COMMON GIT COMMANDS

### Daily Workflow

```bash
# 1. See what changed
git status

# 2. Add files
git add .

# 3. Commit
git commit -m "Your message here"

# 4. Push to GitHub
git push origin main

# 5. Pull latest (if working with team)
git pull origin main
```

### Make Changes & Update

```bash
# Edit eps-crm-cloud.html with your Supabase keys
# Then:

git add eps-crm-cloud.html
git commit -m "Update: Add Supabase credentials"
git push origin main
```

### Check History

```bash
# See all commits
git log

# See changes in last commit
git show

# See difference between versions
git diff
```

### Fix Mistakes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert to specific commit
git checkout <commit-hash>
```

---

## 🔑 SECURITY RULES

### ✅ DO Commit
```
✅ HTML files
✅ Documentation
✅ Configuration templates (.env.example)
✅ Setup guides
✅ README files
✅ License
✅ .gitignore
```

### ❌ DON'T Commit
```
❌ .env files (actual credentials)
❌ API keys
❌ Database passwords
❌ Private keys
❌ Supabase service keys
❌ Any sensitive data
```

---

## 👥 TEAM COLLABORATION

### Setup for Team

1. **Repository Owner:**
   ```bash
   # Create repo and push
   git push origin main
   ```

2. **Team Members:**
   ```bash
   # Clone
   git clone https://github.com/OWNER/eps-crm-cloud.git
   
   # Setup local credentials
   cp .env.example .env
   # Edit .env with YOUR personal credentials
   
   # Never commit .env!
   # (It's in .gitignore)
   ```

3. **Making Changes:**
   ```bash
   # Create branch for feature
   git checkout -b feature/my-feature
   
   # Make changes
   # Add and commit
   git add .
   git commit -m "Add my feature"
   
   # Push branch
   git push origin feature/my-feature
   
   # Create Pull Request on GitHub
   # Get review from team
   # Merge when approved
   ```

---

## 🚀 DEPLOY FROM GIT

### Option 1: Vercel (Recommended)

```bash
# After pushing to GitHub:

# 1. Go to vercel.com
# 2. Click "New Project"
# 3. Select your GitHub repo
# 4. Click "Import"
# 5. Add Environment Variables:
#    SUPABASE_URL = your-url
#    SUPABASE_ANON_KEY = your-key
# 6. Click "Deploy"
# 7. Get live URL!

# Now everyone can access:
https://eps-crm-cloud.vercel.app
```

### Option 2: GitHub Pages

```bash
# 1. Go to repo Settings
# 2. Find "Pages" section
# 3. Select "main" branch
# 4. Click "Save"
# 5. Your site goes live at:
# https://YOUR_USERNAME.github.io/eps-crm-cloud

# Note: Won't work for Supabase URLs unless you add proxy
```

### Option 3: Netlify

```bash
# 1. Go to netlify.com
# 2. Click "New site from Git"
# 3. Select GitHub
# 4. Choose your repo
# 5. Click "Deploy"
# 6. Get live URL
```

---

## 📊 GIT WORKFLOW DIAGRAM

```
Local Computer          GitHub            Deployed Site
     ↓                    ↓                    ↓
1. Edit files       
2. git add .        
3. git commit       →  Push (git push)   →  Deploy
4. git push         →  Repo Updated      →  Live Site

Everyone can:
- Clone the repo
- See changes
- Deploy
- Collaborate
```

---

## ✅ FINAL CHECKLIST

- [ ] Git installed on computer
- [ ] GitHub account created
- [ ] Repository created
- [ ] Repository cloned locally
- [ ] All project files copied
- [ ] .gitignore created
- [ ] .env.example created
- [ ] README.md updated
- [ ] Files added to git
- [ ] First commit created
- [ ] Pushed to GitHub
- [ ] Verified on GitHub website
- [ ] Repository URL copied
- [ ] Ready to share!

---

## 🎉 YOU'RE DONE!

Your project is now:
✅ In version control
✅ Backed up on GitHub
✅ Ready to deploy
✅ Shareable with team
✅ Professional setup

### Next Steps:
1. Get Supabase credentials
2. Update HTML with keys
3. Deploy to Vercel
4. Share URL with team!

---

## 📚 ADDITIONAL RESOURCES

- Git Documentation: https://git-scm.com/doc
- GitHub Help: https://docs.github.com
- Git Cheat Sheet: https://github.github.com/training-kit/
- Interactive Learning: https://learngitbranching.js.org

---

**Ready to push to GitHub?**

Follow steps 1-12 above and you'll be live in minutes! 🚀
