/**
 * CALL COMPLETION MODAL
 * Pops up when telecaller clicks "Call Done" or similar
 * Allows adding notes, scheduling meetings, and setting reminders
 */

window.CallCompletionModal = {
    currentContactId: null,
    currentContactName: null,

    // Initialize modal
    init: function() {
        this.injectHTML();
        this.attachEventListeners();
        console.log('✅ Call Completion Modal Initialized');
    },

    // Inject HTML for modal
    injectHTML: function() {
        const modalHTML = `
            <!-- Call Completion Modal -->
            <div id="callCompletionModalBackground" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000;"></div>

            <div id="callCompletionModal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 30px rgba(0,0,0,0.3); z-index: 1001; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 15px;">
                    <h2 style="margin: 0; color: #333;">📞 Call Completed</h2>
                    <button onclick="CallCompletionModal.close()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                </div>

                <div id="modalContactInfo" style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <strong id="modalContactName" style="color: #333;"></strong>
                    <div id="modalContactDetails" style="font-size: 12px; color: #666; margin-top: 5px;"></div>
                </div>

                <!-- Tabs -->
                <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #ddd;">
                    <button onclick="CallCompletionModal.switchTab('notes')" class="callModalTab active" style="padding: 10px 15px; background: none; border: none; border-bottom: 3px solid #667eea; cursor: pointer; font-weight: bold; color: #667eea;">📝 Call Notes</button>
                    <button onclick="CallCompletionModal.switchTab('meeting')" class="callModalTab" style="padding: 10px 15px; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-weight: bold; color: #999;">📅 Schedule Meeting</button>
                    <button onclick="CallCompletionModal.switchTab('reminder')" class="callModalTab" style="padding: 10px 15px; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-weight: bold; color: #999;">⏰ Set Reminder</button>
                    <button onclick="CallCompletionModal.switchTab('history')" class="callModalTab" style="padding: 10px 15px; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-weight: bold; color: #999;">📋 History</button>
                </div>

                <!-- TAB 1: CALL NOTES -->
                <div id="notesTab" class="callModalTabContent" style="display: block;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Call Summary *</label>
                        <textarea id="callNotes" placeholder="What did you discuss with the customer? Any important details?" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; min-height: 100px;"></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Call Duration (minutes)</label>
                            <input type="number" id="callDuration" min="0" max="120" placeholder="5" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Next Action</label>
                            <select id="nextAction" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="">Select next action...</option>
                                <option value="follow_up">Follow-up needed</option>
                                <option value="waiting_response">Waiting for response</option>
                                <option value="closed">Deal closed</option>
                                <option value="not_interested">Not interested</option>
                                <option value="schedule_meeting">Schedule meeting</option>
                            </select>
                        </div>
                    </div>

                    <button onclick="CallCompletionModal.saveCallNote()" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer;">✅ Save Call Notes</button>
                </div>

                <!-- TAB 2: SCHEDULE MEETING -->
                <div id="meetingTab" class="callModalTabContent" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Meeting Date *</label>
                        <input type="date" id="meetingDate" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Meeting Time *</label>
                        <input type="time" id="meetingTime" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Location</label>
                        <input type="text" id="meetingLocation" placeholder="Office / Remote / Customer location" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Assign To Field Executive</label>
                        <select id="assignedFieldExec" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <option value="">Select field executive...</option>
                            <option value="Anjali Patel">Anjali Patel</option>
                            <option value="Deepak Sharma">Deepak Sharma</option>
                            <option value="Priya Singh">Priya Singh</option>
                            <option value="Vikram Singh">Vikram Singh</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Meeting Notes</label>
                        <textarea id="meetingNotes" placeholder="Any specific topics to discuss?" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-height: 80px;"></textarea>
                    </div>

                    <button onclick="CallCompletionModal.scheduleMeeting()" style="width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer;">📅 Schedule Meeting</button>
                </div>

                <!-- TAB 3: SET REMINDER -->
                <div id="reminderTab" class="callModalTabContent" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Reminder Date *</label>
                        <input type="date" id="reminderDate" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Reminder Time *</label>
                        <input type="time" id="reminderTime" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">What to Remember *</label>
                        <textarea id="reminderText" placeholder="e.g., Call back to confirm order" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-height: 80px;"></textarea>
                    </div>

                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 5px; margin-bottom: 15px; font-size: 13px; color: #92400e;">
                        You will receive a notification on the reminder date & time
                    </div>

                    <button onclick="CallCompletionModal.setReminder()" style="width: 100%; padding: 12px; background: #f59e0b; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer;">⏰ Set Reminder</button>
                </div>

                <!-- TAB 4: CONTACT HISTORY -->
                <div id="historyTab" class="callModalTabContent" style="display: none;">
                    <div id="historyContent" style="max-height: 400px; overflow-y: auto;">
                        <div style="text-align: center; color: #999; padding: 20px;">Loading contact history...</div>
                    </div>
                </div>

            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    // Attach event listeners
    attachEventListeners: function() {
        // Close modal on background click
        document.getElementById('callCompletionModalBackground').addEventListener('click', () => {
            this.close();
        });
    },

    // Switch tab
    switchTab: function(tabName) {
        // Hide all tabs
        document.querySelectorAll('.callModalTabContent').forEach(tab => {
            tab.style.display = 'none';
        });

        // Remove active styling from all tab buttons
        document.querySelectorAll('.callModalTab').forEach(btn => {
            btn.style.borderBottomColor = 'transparent';
            btn.style.color = '#999';
        });

        // Show selected tab
        document.getElementById(tabName + 'Tab').style.display = 'block';

        // Add active styling to clicked button
        event.target.style.borderBottomColor = '#667eea';
        event.target.style.color = '#667eea';

        // Load history if history tab
        if (tabName === 'history') {
            this.loadContactHistory();
        }
    },

    // Open modal
    open: function(contactId, contactName, contactDetails = '') {
        this.currentContactId = contactId;
        this.currentContactName = contactName;

        document.getElementById('callCompletionModal').style.display = 'block';
        document.getElementById('callCompletionModalBackground').style.display = 'block';

        document.getElementById('modalContactName').textContent = contactName;
        document.getElementById('modalContactDetails').textContent = contactDetails;

        // Set default reminder date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('reminderDate').value = tomorrow.toISOString().split('T')[0];
    },

    // Close modal
    close: function() {
        document.getElementById('callCompletionModal').style.display = 'none';
        document.getElementById('callCompletionModalBackground').style.display = 'none';

        // Clear fields
        document.getElementById('callNotes').value = '';
        document.getElementById('callDuration').value = '';
        document.getElementById('nextAction').value = '';
        document.getElementById('meetingDate').value = '';
        document.getElementById('meetingTime').value = '';
        document.getElementById('meetingLocation').value = '';
        document.getElementById('assignedFieldExec').value = '';
        document.getElementById('meetingNotes').value = '';
        document.getElementById('reminderDate').value = '';
        document.getElementById('reminderTime').value = '';
        document.getElementById('reminderText').value = '';
    },

    // Save call note
    async saveCallNote() {
        const notes = document.getElementById('callNotes').value;
        const duration = document.getElementById('callDuration').value || 0;
        const nextAction = document.getElementById('nextAction').value;

        if (!notes.trim()) {
            alert('Please enter call notes');
            return;
        }

        const result = await window.CrmSupabase.saveCallNote(
            this.currentContactId,
            this.currentContactName,
            notes,
            parseInt(duration),
            nextAction
        );

        if (result.success) {
            alert('✅ Call notes saved successfully!');
            this.close();
        } else {
            alert('❌ Error saving call notes: ' + result.error);
        }
    },

    // Schedule meeting
    async scheduleMeeting() {
        const date = document.getElementById('meetingDate').value;
        const time = document.getElementById('meetingTime').value;
        const location = document.getElementById('meetingLocation').value;
        const assignedTo = document.getElementById('assignedFieldExec').value;
        const notes = document.getElementById('meetingNotes').value;

        if (!date || !time || !assignedTo) {
            alert('Please fill in date, time, and assigned field executive');
            return;
        }

        const result = await window.CrmSupabase.scheduleMeeting(
            this.currentContactId,
            this.currentContactName,
            date,
            time,
            location,
            assignedTo,
            notes
        );

        if (result.success) {
            alert('✅ Meeting scheduled and assigned to ' + assignedTo);
            this.close();
        } else {
            alert('❌ Error scheduling meeting: ' + result.error);
        }
    },

    // Set reminder
    async setReminder() {
        const date = document.getElementById('reminderDate').value;
        const time = document.getElementById('reminderTime').value;
        const text = document.getElementById('reminderText').value;

        if (!date || !text.trim()) {
            alert('Please fill in reminder date and text');
            return;
        }

        // Combine date and time
        const reminderDateTime = date + 'T' + (time || '09:00:00');

        const result = await window.CrmSupabase.createReminder(
            this.currentContactId,
            this.currentContactName,
            reminderDateTime,
            text
        );

        if (result.success) {
            alert('✅ Reminder set for ' + date);
            this.close();
        } else {
            alert('❌ Error setting reminder: ' + result.error);
        }
    },

    // Load and display contact history
    async loadContactHistory() {
        const historyContent = document.getElementById('historyContent');
        historyContent.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">Loading...</div>';

        const result = await window.CrmSupabase.getContactHistory(this.currentContactId);

        if (!result.success) {
            historyContent.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">Unable to load history</div>';
            return;
        }

        let html = '';

        // Call notes
        if (result.notes.length > 0) {
            html += '<div style="margin-bottom: 20px;"><h4 style="color: #333; margin-top: 0;">📝 Call Notes</h4>';
            result.notes.forEach(note => {
                html += `
                    <div style="background: #f0f9ff; padding: 12px; border-radius: 5px; margin-bottom: 8px; border-left: 3px solid #3b82f6;">
                        <div style="font-size: 12px; color: #999;">${new Date(note.created_at).toLocaleDateString()} - ${new Date(note.created_at).toLocaleTimeString()}</div>
                        <div style="color: #333; margin-top: 5px;">${note.notes}</div>
                        ${note.call_duration ? `<div style="font-size: 12px; color: #666; margin-top: 5px;">Duration: ${note.call_duration} mins</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }

        // Scheduled meetings
        if (result.meetings.length > 0) {
            html += '<div style="margin-bottom: 20px;"><h4 style="color: #333; margin-top: 0;">📅 Scheduled Meetings</h4>';
            result.meetings.forEach(meeting => {
                html += `
                    <div style="background: #f0fdf4; padding: 12px; border-radius: 5px; margin-bottom: 8px; border-left: 3px solid #10b981;">
                        <div style="font-weight: bold; color: #333;">${meeting.meeting_date} at ${meeting.meeting_time}</div>
                        <div style="font-size: 12px; color: #666; margin-top: 3px;">Assigned to: ${meeting.assigned_to}</div>
                        ${meeting.location ? `<div style="font-size: 12px; color: #666;">Location: ${meeting.location}</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }

        // Reminders
        if (result.reminders.length > 0) {
            html += '<div><h4 style="color: #333; margin-top: 0;">⏰ Reminders</h4>';
            result.reminders.forEach(reminder => {
                html += `
                    <div style="background: #fffbeb; padding: 12px; border-radius: 5px; margin-bottom: 8px; border-left: 3px solid #f59e0b;">
                        <div style="font-weight: bold; color: #333;">${new Date(reminder.reminder_date).toLocaleDateString()}</div>
                        <div style="color: #666; margin-top: 3px;">${reminder.reminder_text}</div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px;">Status: ${reminder.status}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        if (html === '') {
            html = '<div style="text-align: center; color: #999; padding: 20px;">No history yet</div>';
        }

        historyContent.innerHTML = html;
    }
};

// Initialize when page loads - WITH DELAY
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.CallCompletionModal && typeof window.CallCompletionModal.init === 'function') {
            window.CallCompletionModal.init();
            console.log('✅ Call Completion Modal Initialized');
        }
    }, 1500);
});

console.log('✅ Call Completion Modal Script Loaded');
