import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Mock Data Generator
const generateMockData = {
  contacts: [
    { id: 1, name: 'Rajesh Kumar', company: 'Tech Solutions', industry: 'Software', phone: '9876543210', email: 'rajesh@tech.com', status: 'interested', tags: ['hot'], highlighted: true },
    { id: 2, name: 'Priya Singh', company: 'Digital Hub', industry: 'Marketing', phone: '9876543211', email: 'priya@hub.com', status: 'contacted', tags: ['warm'] },
    { id: 3, name: 'Arun Patel', company: 'Finance Corp', industry: 'Finance', phone: '9876543212', email: 'arun@finance.com', status: 'pending', tags: ['cold'] },
  ],
  callLogs: [
    { id: 1, contact: 'Rajesh Kumar', date: '2024-05-15', status: 'connected', duration: '12 min', notes: 'Interested in demo' },
  ],
  followups: [
    { id: 1, contact: 'Rajesh Kumar', dueDate: '2024-05-20', status: 'pending', note: 'Send proposal' },
    { id: 2, contact: 'Priya Singh', dueDate: '2024-05-18', status: 'pending', note: 'Schedule meeting' },
  ],
  meetings: [
    { id: 1, contact: 'Rajesh Kumar', date: '2024-05-22', time: '2:00 PM', status: 'scheduled' },
  ],
  monthlyActivity: [
    { month: 'Jan', calls: 120, meetings: 8, deals: 2 },
    { month: 'Feb', calls: 150, meetings: 10, deals: 3 },
    { month: 'Mar', calls: 180, meetings: 12, deals: 4 },
    { month: 'Apr', calls: 160, meetings: 11, deals: 3 },
    { month: 'May', calls: 190, meetings: 14, deals: 5 },
  ]
};

// Email Templates
const EMAIL_TEMPLATES = {
  meeting: {
    subject: 'Meeting Confirmation',
    body: 'Dear [Name],\n\nThank you for scheduling a meeting with us. We look forward to discussing your needs on [Date] at [Time].\n\nBest regards,\n[Your Name]'
  },
  proposal: {
    subject: 'Proposal for Your Review',
    body: 'Dear [Name],\n\nPlease find attached our proposal. We believe this solution will perfectly fit your requirements.\n\nBest regards,\n[Your Name]'
  },
  price: {
    subject: 'Price Quotation',
    body: 'Dear [Name],\n\nHere is our detailed quotation for your review. Please contact us if you have any questions.\n\nBest regards,\n[Your Name]'
  },
  intro: {
    subject: 'Introduction - [Company Name]',
    body: 'Dear [Name],\n\nWe are reaching out to introduce our services which can help your business grow.\n\nBest regards,\n[Your Name]'
  },
  thank: {
    subject: 'Thank You',
    body: 'Dear [Name],\n\nThank you for your time and consideration. We appreciate the opportunity to work with you.\n\nBest regards,\n[Your Name]'
  },
  feedback: {
    subject: 'Feedback Request',
    body: 'Dear [Name],\n\nWe would love to hear your feedback on our service. Please take a moment to share your thoughts.\n\nBest regards,\n[Your Name]'
  }
};

// Telecaller Dashboard Component
const TelecallerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contacts, setContacts] = useState(generateMockData.contacts);
  const [callLogs, setCallLogs] = useState(generateMockData.callLogs);
  const [followups, setFollowups] = useState(generateMockData.followups);
  const [meetings, setMeetings] = useState(generateMockData.meetings);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('meeting');
  const [newCall, setNewCall] = useState({
    contactName: '',
    company: '',
    industry: 'Software',
    phone: '',
    email: '',
    callStatus: 'pending',
    emailSent: 'no',
    interested: 'no',
    tag: 'warm',
    discussion: '',
    meetingDate: '',
    followupDate: '',
    followupNote: ''
  });

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCall = () => {
    if (newCall.contactName && newCall.phone) {
      const contact = {
        id: contacts.length + 1,
        name: newCall.contactName,
        company: newCall.company,
        industry: newCall.industry,
        phone: newCall.phone,
        email: newCall.email,
        status: newCall.interested === 'yes' ? 'interested' : 'pending',
        tags: [newCall.tag]
      };
      setContacts([...contacts, contact]);
      setNewCall({
        contactName: '',
        company: '',
        industry: 'Software',
        phone: '',
        email: '',
        callStatus: 'pending',
        emailSent: 'no',
        interested: 'no',
        tag: 'warm',
        discussion: '',
        meetingDate: '',
        followupDate: '',
        followupNote: ''
      });
      setShowForm(false);
    }
  };

  const handleClearForm = () => {
    setNewCall({
      contactName: '',
      company: '',
      industry: 'Software',
      phone: '',
      email: '',
      callStatus: 'pending',
      emailSent: 'no',
      interested: 'no',
      tag: 'warm',
      discussion: '',
      meetingDate: '',
      followupDate: '',
      followupNote: ''
    });
  };

  const handleScheduleMeeting = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact && newCall.meetingDate) {
      const meeting = {
        id: meetings.length + 1,
        contact: contact.name,
        date: newCall.meetingDate,
        time: '2:00 PM',
        status: 'scheduled'
      };
      setMeetings([...meetings, meeting]);
      setNewCall({ ...newCall, meetingDate: '' });
    }
  };

  const handleUpdateFollowupStatus = (followupId, newStatus) => {
    setFollowups(followups.map(f =>
      f.id === followupId ? { ...f, status: newStatus } : f
    ));
  };

  // Dashboard Content
  const dashboardContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DashCard label="Total Contacts" value={contacts.length} icon="📇" />
        <DashCard label="Call Connected" value="42" icon="☎️" />
        <DashCard label="Missed Calls" value="8" icon="📞" />
        <DashCard label="Pending Follow-ups" value={followups.filter(f => f.status === 'pending').length} icon="⏰" />
        <DashCard label="Meetings Scheduled" value={meetings.length} icon="📅" />
        <DashCard label="Deals Closed" value="3" icon="🎉" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={generateMockData.monthlyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="meetings" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="deals" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Log New Calls Content
  const logCallsContent = (
    <div className="bg-white p-6 rounded-lg shadow">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
        >
          + Log New Call
        </button>
      ) : (
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={newCall.contactName}
              onChange={(e) => setNewCall({ ...newCall, contactName: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={newCall.company}
              onChange={(e) => setNewCall({ ...newCall, company: e.target.value })}
              className="border p-2 rounded"
            />
            <select
              value={newCall.industry}
              onChange={(e) => setNewCall({ ...newCall, industry: e.target.value })}
              className="border p-2 rounded"
            >
              <option>Software</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Retail</option>
              <option>Marketing</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              value={newCall.phone}
              onChange={(e) => setNewCall({ ...newCall, phone: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newCall.email}
              onChange={(e) => setNewCall({ ...newCall, email: e.target.value })}
              className="border p-2 rounded"
            />
            <select
              value={newCall.callStatus}
              onChange={(e) => setNewCall({ ...newCall, callStatus: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="pending">Call Status - Pending</option>
              <option value="connected">Call Status - Connected</option>
              <option value="missed">Call Status - Missed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <select
              value={newCall.emailSent}
              onChange={(e) => setNewCall({ ...newCall, emailSent: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="no">Email Sent - No</option>
              <option value="yes">Email Sent - Yes</option>
            </select>
            <select
              value={newCall.interested}
              onChange={(e) => setNewCall({ ...newCall, interested: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="no">Interested - No</option>
              <option value="yes">Interested - Yes</option>
            </select>
            <select
              value={newCall.tag}
              onChange={(e) => setNewCall({ ...newCall, tag: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="hot">Hot Lead</option>
              <option value="warm">Warm Lead</option>
              <option value="cold">Cold Lead</option>
              <option value="dnd">Do Not Call</option>
            </select>
          </div>

          <textarea
            placeholder="What did you discuss?"
            value={newCall.discussion}
            onChange={(e) => setNewCall({ ...newCall, discussion: e.target.value })}
            className="border p-2 rounded w-full"
            rows="3"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={newCall.meetingDate}
              onChange={(e) => setNewCall({ ...newCall, meetingDate: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={newCall.followupDate}
              onChange={(e) => setNewCall({ ...newCall, followupDate: e.target.value })}
              className="border p-2 rounded"
            />
          </div>

          <textarea
            placeholder="Follow-up Note"
            value={newCall.followupNote}
            onChange={(e) => setNewCall({ ...newCall, followupNote: e.target.value })}
            className="border p-2 rounded w-full"
            rows="2"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSaveCall}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Save Call Log
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Clear Form
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );

  // Contacts Content
  const contactsContent = (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by name or company..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`border p-4 rounded-lg ${contact.highlighted ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.company} • {contact.industry}</p>
                <p className="text-sm text-gray-600">{contact.phone} • {contact.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <span key={tag} className={`px-2 py-1 rounded text-xs font-semibold ${
                    tag === 'hot' ? 'bg-red-200 text-red-800' :
                    tag === 'warm' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Follow-ups Content
  const followupsContent = (
    <div className="space-y-3">
      {followups.map((followup) => (
        <div key={followup.id} className="border p-4 rounded-lg bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{followup.contact}</p>
              <p className="text-sm text-gray-600">Due: {followup.dueDate}</p>
              <p className="text-sm text-gray-600">Note: {followup.note}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateFollowupStatus(followup.id, 'done')}
                className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
              >
                Done
              </button>
              <button
                onClick={() => handleUpdateFollowupStatus(followup.id, 'closed')}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              >
                Deal Closed
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Reminders Content
  const remindersContent = (
    <div className="space-y-3">
      {followups.filter(f => f.status === 'pending').map((reminder) => (
        <div key={reminder.id} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
          <p className="font-semibold text-orange-900">{reminder.contact}</p>
          <p className="text-sm text-orange-800">Due: {reminder.dueDate}</p>
          <p className="text-sm text-orange-800">{reminder.note}</p>
        </div>
      ))}
    </div>
  );

  // Email Templates Content
  const emailContent = (
    <div className="space-y-4">
      <select
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="meeting">Meeting Confirmation</option>
        <option value="proposal">Proposal</option>
        <option value="price">Price Quotation</option>
        <option value="intro">Introduction</option>
        <option value="thank">Thank You</option>
        <option value="feedback">Feedback</option>
      </select>

      <div className="bg-white p-4 rounded-lg border">
        <p className="text-sm text-gray-600 mb-2">Subject:</p>
        <p className="font-semibold mb-4">{EMAIL_TEMPLATES[selectedTemplate].subject}</p>
        <p className="text-sm text-gray-600 mb-2">Body:</p>
        <p className="text-sm whitespace-pre-wrap">{EMAIL_TEMPLATES[selectedTemplate].body}</p>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
        Use This Template
      </button>
    </div>
  );

  // Goals Content
  const goalsContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GoalCard title="Daily Calls" current="38" target="45" />
      <GoalCard title="Weekly Calls" current="265" target="270" />
      <GoalCard title="Monthly Calls" current="1200" target="1350" />
      <GoalCard title="Daily Meetings" current="0" target="1" />
      <GoalCard title="Weekly Meetings" current="6" target="7" />
      <GoalCard title="Monthly Meetings" current="28" target="30" />
    </div>
  );

  // Analytics Content
  const analyticsContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticCard label="Total Calls" value="1200" change="+15%" color="blue" />
        <AnalyticCard label="Call Conversion" value="42%" change="+5%" color="green" />
        <AnalyticCard label="Meeting Rate" value="28" change="+2%" color="purple" />
        <AnalyticCard label="Deal Close Rate" value="12%" change="+3%" color="orange" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Call Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Connected', value: 520 },
                { name: 'Missed', value: 180 },
                { name: 'Pending', value: 500 }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {[0, 1, 2].map((index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <h1 className="text-3xl font-bold">Telecaller Dashboard</h1>
        <p className="text-blue-100">Welcome back! Manage your calls and contacts</p>
      </div>

      <div className="flex border-b bg-white">
        {[
          { key: 'dashboard', label: '📊 Dashboard' },
          { key: 'logcalls', label: '☎️ Log Calls' },
          { key: 'contacts', label: '📇 Contacts' },
          { key: 'followups', label: '⏰ Follow-ups' },
          { key: 'reminders', label: '🔔 Reminders' },
          { key: 'emails', label: '📧 Email Templates' },
          { key: 'goals', label: '🎯 Goals' },
          { key: 'analytics', label: '📈 Analytics' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 font-semibold border-b-2 ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'dashboard' && dashboardContent}
        {activeTab === 'logcalls' && logCallsContent}
        {activeTab === 'contacts' && contactsContent}
        {activeTab === 'followups' && followupsContent}
        {activeTab === 'reminders' && remindersContent}
        {activeTab === 'emails' && emailContent}
        {activeTab === 'goals' && goalsContent}
        {activeTab === 'analytics' && analyticsContent}
      </div>
    </div>
  );
};

// Field Executive Dashboard Component
const FieldExecutiveDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activities, setActivities] = useState([
    { id: 1, type: 'BNI', location: 'Mumbai', date: '2024-05-15', duration: '2 hours', cardsCollected: 5 }
  ]);
  const [businessCards, setBusinessCards] = useState([
    { id: 1, name: 'John Doe', designation: 'Manager', company: 'ABC Corp', phone: '9876543210', email: 'john@abc.com', type: 'hot' }
  ]);
  const [events, setEvents] = useState([
    { id: 1, name: 'Tech Summit', date: '2024-05-20', location: 'Bangalore' }
  ]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'BNI',
    location: '',
    date: '',
    time: '',
    duration: '',
    cardsCollected: 0,
    notes: ''
  });

  const dashboardContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DashCard label="Total Activities" value="24" icon="🎯" />
        <DashCard label="Business Cards" value={businessCards.length} icon="🤝" />
        <DashCard label="Connections Made" value="18" icon="👥" />
        <DashCard label="Events Attended" value="8" icon="📅" />
        <DashCard label="BNI Meetings" value="12" icon="💼" />
        <DashCard label="1:1 Meetings" value="6" icon="👨‍💼" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Activity Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: 'BNI', count: 12 },
            { name: 'Events', count: 8 },
            { name: 'Meetings', count: 6 },
            { name: 'Exhibitions', count: 5 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const logActivityContent = (
    <div className="space-y-4">
      {!showActivityForm ? (
        <button
          onClick={() => setShowActivityForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
        >
          + Log Activity
        </button>
      ) : (
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={newActivity.type}
              onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="BNI">BNI Meeting</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Client Meeting">Client Meeting</option>
              <option value="Event">Event</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={newActivity.location}
              onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={newActivity.date}
              onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="time"
              value={newActivity.time}
              onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2 hours)"
              value={newActivity.duration}
              onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Cards Collected"
              value={newActivity.cardsCollected}
              onChange={(e) => setNewActivity({ ...newActivity, cardsCollected: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <textarea
            placeholder="Activity Notes"
            value={newActivity.notes}
            onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
            className="border p-2 rounded w-full"
            rows="3"
          />
          <div className="flex gap-4">
            <button type="button" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Save Activity
            </button>
            <button
              type="button"
              onClick={() => setShowActivityForm(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 mt-6">
        {activities.map((activity) => (
          <div key={activity.id} className="border p-4 rounded-lg bg-white">
            <p className="font-semibold">{activity.type}</p>
            <p className="text-sm text-gray-600">{activity.location} • {activity.date}</p>
            <p className="text-sm text-gray-600">{activity.duration} • {activity.cardsCollected} cards collected</p>
          </div>
        ))}
      </div>
    </div>
  );

  const businessCardContent = (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Add Business Card</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Contact Name" className="border p-2 rounded" />
            <input type="text" placeholder="Designation" className="border p-2 rounded" />
            <input type="text" placeholder="Company" className="border p-2 rounded" />
            <input type="tel" placeholder="Phone" className="border p-2 rounded" />
            <input type="email" placeholder="Email" className="border p-2 rounded" />
            <select className="border p-2 rounded">
              <option value="hot">Hot Lead</option>
              <option value="warm">Warm Lead</option>
              <option value="cold">Cold Lead</option>
            </select>
          </div>
          <textarea placeholder="Notes" className="border p-2 rounded w-full" rows="3" />
          <button type="button" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Save Card
          </button>
        </form>
      </div>

      <div className="space-y-3 mt-6">
        {businessCards.map((card) => (
          <div key={card.id} className="border p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <p className="font-semibold">{card.name}</p>
            <p className="text-sm text-gray-600">{card.designation} at {card.company}</p>
            <p className="text-sm text-gray-600">{card.phone} • {card.email}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
              card.type === 'hot' ? 'bg-red-200 text-red-800' :
              card.type === 'warm' ? 'bg-yellow-200 text-yellow-800' :
              'bg-blue-200 text-blue-800'
            }`}>
              {card.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const eventsContent = (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Add Event/Expo</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Event Name" className="border p-2 rounded" />
            <input type="text" placeholder="Location" className="border p-2 rounded" />
            <input type="date" className="border p-2 rounded" />
          </div>
          <button type="button" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Add Event
          </button>
        </form>
      </div>

      <div className="space-y-3 mt-6">
        {events.map((event) => (
          <div key={event.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
            <p className="font-semibold">{event.name}</p>
            <p className="text-sm text-gray-600">{event.location} • {event.date}</p>
            <p className="text-xs text-blue-600 mt-2">⏰ Reminder: 1 week & 1 day before</p>
          </div>
        ))}
      </div>
    </div>
  );

  const goalsContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GoalCard title="Daily Meetings" current="1" target="2" />
      <GoalCard title="Weekly Meetings" current="8" target="12" />
      <GoalCard title="Monthly Meetings" current="32" target="48" />
      <GoalCard title="BNI Meetings (Monthly)" current="12" target="15" />
      <GoalCard title="BNI 1:1 Meetings (Weekly)" current="1" target="2" />
      <GoalCard title="BNI Lead Generation (Monthly)" current="15" target="20" />
    </div>
  );

  const analyticsContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticCard label="Total Activities" value="24" change="+10%" color="blue" />
        <AnalyticCard label="Avg Cards/Event" value="5.2" change="+2%" color="green" />
        <AnalyticCard label="Meeting Conversion" value="38%" change="+8%" color="purple" />
        <AnalyticCard label="Active Prospects" value="42" change="+15%" color="orange" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[
            { week: 'W1', activities: 3, cards: 12 },
            { week: 'W2', activities: 5, cards: 18 },
            { week: 'W3', activities: 4, cards: 15 },
            { week: 'W4', activities: 6, cards: 22 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="activities" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="cards" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
        <h1 className="text-3xl font-bold">Field Executive Dashboard</h1>
        <p className="text-green-100">Manage activities, events, and connections</p>
      </div>

      <div className="flex border-b bg-white overflow-x-auto">
        {[
          { key: 'dashboard', label: '📊 Dashboard' },
          { key: 'activity', label: '📝 Log Activity' },
          { key: 'cards', label: '🎴 Business Cards' },
          { key: 'events', label: '🎪 Events & Expos' },
          { key: 'goals', label: '🎯 Goals' },
          { key: 'analytics', label: '📈 Analytics' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 font-semibold border-b-2 whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'dashboard' && dashboardContent}
        {activeTab === 'activity' && logActivityContent}
        {activeTab === 'cards' && businessCardContent}
        {activeTab === 'events' && eventsContent}
        {activeTab === 'goals' && goalsContent}
        {activeTab === 'analytics' && analyticsContent}
      </div>
    </div>
  );
};

// Collections Dashboard Component
const CollectionsDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [invoices, setInvoices] = useState([
    { id: 1, customer: 'Rajesh Kumar', amount: 50000, dueDate: '2024-05-20', status: 'pending' },
    { id: 2, customer: 'Priya Singh', amount: 75000, dueDate: '2024-05-15', status: 'paid' }
  ]);

  const dashboardContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashCard label="Total Invoices" value={invoices.length} icon="📄" />
        <DashCard label="Total Amount" value="₹" + invoices.reduce((a, b) => a + b.amount, 0) icon="💰" />
        <DashCard label="Collected" value="₹75,000" icon="✅" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-2">Amount Due</p>
          <p className="text-2xl font-bold">₹50,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-2">Pending Invoices</p>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-2">Collection %</p>
          <p className="text-2xl font-bold">60%</p>
        </div>
      </div>
    </div>
  );

  const invoiceContent = (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Create Invoice
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          + Upload Excel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-semibold">Invoice ID</th>
              <th className="p-4 text-left font-semibold">Customer</th>
              <th className="p-4 text-left font-semibold">Amount</th>
              <th className="p-4 text-left font-semibold">Due Date</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t hover:bg-gray-50">
                <td className="p-4">#{invoice.id.toString().padStart(5, '0')}</td>
                <td className="p-4">{invoice.customer}</td>
                <td className="p-4 font-semibold">₹{invoice.amount.toLocaleString()}</td>
                <td className="p-4">{invoice.dueDate}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    invoice.status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
        <h1 className="text-3xl font-bold">Collections Dashboard</h1>
        <p className="text-purple-100">Manage invoices and collections</p>
      </div>

      <div className="flex border-b bg-white">
        {[
          { key: 'dashboard', label: '📊 Dashboard' },
          { key: 'invoices', label: '💳 Invoices' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 font-semibold border-b-2 ${
              activeTab === tab.key
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'dashboard' && dashboardContent}
        {activeTab === 'invoices' && invoiceContent}
      </div>
    </div>
  );
};

// Helper Components
const DashCard = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <p className="text-3xl mb-2">{icon}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const GoalCard = ({ title, current, target }) => {
  const percentage = Math.round((current / target) * 100);
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="font-semibold mb-2">{title}</p>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">{current}/{target}</span>
        <span className="text-sm font-bold text-blue-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const AnalyticCard = ({ label, value, change, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  return (
    <div className={`${colors[color]} p-4 rounded-lg`}>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <div className="flex justify-between items-end">
        <p className="text-2xl font-bold">{value}</p>
        <span className="text-sm font-semibold">{change}</span>
      </div>
    </div>
  );
};

// Main App Component with Role Selection
export default function EPSCRMApp() {
  const [userRole, setUserRole] = useState(null);

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">EPS CRM System</h1>
          <p className="text-gray-600 mb-8">Select your role to continue</p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setUserRole('telecaller')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg w-full"
            >
              Telecaller Dashboard
            </button>
            <button
              onClick={() => setUserRole('fieldexec')}
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 font-semibold text-lg w-full"
            >
              Field Executive Dashboard
            </button>
            <button
              onClick={() => setUserRole('collections')}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 font-semibold text-lg w-full"
            >
              Collections Dashboard
            </button>
          </div>

          <button
            onClick={() => setUserRole(null)}
            className="mt-8 text-gray-600 hover:text-gray-800 w-full"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (userRole === 'telecaller') return <TelecallerDashboard />;
  if (userRole === 'fieldexec') return <FieldExecutiveDashboard />;
  if (userRole === 'collections') return <CollectionsDashboard />;
}
