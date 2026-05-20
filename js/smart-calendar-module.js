/**
 * SMART CALENDAR & AVAILABILITY MODULE
 * Manages calendar sync, availability, and meeting scheduling
 */

window.CalendarModule = {
    events: [],
    userAvailability: {
        timezone: 'Asia/Kolkata',
        workStartTime: '09:00',
        workEndTime: '18:00',
        isOnVacation: false,
        vacationDates: []
    },
    
    init: function() {
        console.log('📅 Calendar Module Initialized');
        this.injectUI();
        this.loadFromStorage();
        this.renderCalendar();
    },
    
    injectUI: function() {
        const mainContent = document.querySelector('.container');
        if (!mainContent) return;
        
        const calendarHTML = `
            <div id="calendarPanel" style="display: none; margin-top: 30px;">
                <h2>📅 Smart Calendar & Availability</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>⚙️ Your Availability</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                        <div>
                            <label>Timezone</label>
                            <select id="userTimezone" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;">
                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                <option value="Asia/Kolkata">Europe/London (GMT)</option>
                                <option value="America/New_York">America/New_York (EST)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label>Work Start Time</label>
                            <input type="time" id="workStartTime" value="09:00" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;">
                        </div>
                        
                        <div>
                            <label>Work End Time</label>
                            <input type="time" id="workEndTime" value="18:00" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;">
                        </div>
                        
                        <div style="display: flex; align-items: flex-end;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="vacationMode" style="cursor: pointer;">
                                On Vacation
                            </label>
                        </div>
                    </div>
                    
                    <button onclick="CalendarModule.saveAvailability()" style="margin-top: 15px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">💾 Save Settings</button>
                </div>
                
                <h3 style="margin-top: 30px;">📆 This Week's Schedule</h3>
                <div id="weekCalendar" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-top: 15px;">
                </div>
                
                <h3 style="margin-top: 30px;">📋 Upcoming Meetings</h3>
                <div id="upcomingMeetings" style="display: flex; flex-direction: column; gap: 10px;">
                </div>
            </div>
        `;
        
        mainContent.insertAdjacentHTML('afterend', calendarHTML);
    },
    
    renderCalendar: function() {
        const calendar = document.getElementById('weekCalendar');
        if (!calendar) return;
        
        const today = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        let html = '';
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dayName = days[date.getDay()];
            const dayNum = date.getDate();
            const dayEvents = this.events.filter(e => 
                new Date(e.date).toDateString() === date.toDateString()
            ).length;
            
            html += `
                <div style="
                    background: ${date.toDateString() === today.toDateString() ? '#3b82f6' : 'white'};
                    color: ${date.toDateString() === today.toDateString() ? 'white' : '#333'};
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                ">
                    <div style="font-weight: bold;">${dayName}</div>
                    <div style="font-size: 20px; margin: 8px 0;">${dayNum}</div>
                    <div style="font-size: 12px;">${dayEvents} events</div>
                </div>
            `;
        }
        
        calendar.innerHTML = html;
    },
    
    addEvent: function(eventData) {
        const event = {
            id: Date.now(),
            title: eventData.title,
            date: eventData.date,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            type: eventData.type || 'meeting', // meeting, call, break
            description: eventData.description || '',
            createdAt: new Date()
        };
        
        this.events.push(event);
        this.saveToStorage();
        this.renderCalendar();
        this.renderUpcomingMeetings();
    },
    
    renderUpcomingMeetings: function() {
        const meetingsList = document.getElementById('upcomingMeetings');
        if (!meetingsList) return;
        
        const upcoming = this.events
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
        
        if (upcoming.length === 0) {
            meetingsList.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No upcoming meetings</div>';
            return;
        }
        
        meetingsList.innerHTML = upcoming.map(event => `
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <div style="font-weight: 500; color: #333;">${event.title}</div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #666;">
                    <span>${new Date(event.date).toLocaleDateString()} ${event.startTime}</span>
                    <span>${event.type === 'meeting' ? '📅' : '☎️'}</span>
                </div>
            </div>
        `).join('');
    },
    
    saveAvailability: function() {
        this.userAvailability.timezone = document.getElementById('userTimezone').value;
        this.userAvailability.workStartTime = document.getElementById('workStartTime').value;
        this.userAvailability.workEndTime = document.getElementById('workEndTime').value;
        this.userAvailability.isOnVacation = document.getElementById('vacationMode').checked;
        
        this.saveToStorage();
        
        if (window.ModuleManager) {
            window.ModuleManager.notify('success', 'Settings Saved', 'Your availability settings have been updated');
        }
    },
    
    saveToStorage: function() {
        try {
            localStorage.setItem('crm_calendar', JSON.stringify({
                events: this.events,
                availability: this.userAvailability
            }));
        } catch (e) {
            console.log('localStorage not available');
        }
    },
    
    loadFromStorage: function() {
        try {
            const saved = localStorage.getItem('crm_calendar');
            if (saved) {
                const data = JSON.parse(saved);
                this.events = data.events || [];
                this.userAvailability = data.availability || this.userAvailability;
                
                // Update UI
                document.getElementById('userTimezone').value = this.userAvailability.timezone;
                document.getElementById('workStartTime').value = this.userAvailability.workStartTime;
                document.getElementById('workEndTime').value = this.userAvailability.workEndTime;
                document.getElementById('vacationMode').checked = this.userAvailability.isOnVacation;
            }
        } catch (e) {
            console.log('localStorage not available');
        }
    }
};

// Initialize when module loads
window.CalendarModule.init();

console.log('✅ Calendar Module Ready');
