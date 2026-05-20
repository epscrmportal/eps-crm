/**
 * COMMUNICATION HISTORY & AUDIT TRAIL MODULE
 * Tracks all interactions and provides complete communication timeline
 */

window.HistoryModule = {
    events: [],
    
    init: function() {
        console.log('💬 Communication History Module Initialized');
        this.injectUI();
        this.loadFromStorage();
    },
    
    injectUI: function() {
        const mainContent = document.querySelector('.container');
        if (!mainContent) return;
        
        const historyHTML = `
            <div id="historyPanel" style="display: none; margin-top: 30px;">
                <h2>💬 Communication History</h2>
                
                <div style="margin: 20px 0;">
                    <input type="text" id="historySearch" placeholder="Search communications..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                
                <div id="communicationTimeline" style="display: flex; flex-direction: column; gap: 15px;">
                </div>
            </div>
        `;
        
        mainContent.insertAdjacentHTML('afterend', historyHTML);
        
        // Search functionality
        document.addEventListener('change', (e) => {
            if (e.target.id === 'historySearch') {
                this.renderTimeline(e.target.value);
            }
        });
    },
    
    logEvent: function(contactId, type, details) {
        const event = {
            id: Date.now(),
            contactId: contactId,
            type: type, // call, email, meeting, message, status_change, note
            details: details,
            timestamp: new Date(),
            user: window.currentUser?.name || 'Unknown'
        };
        
        this.events.push(event);
        this.saveToStorage();
        this.renderTimeline();
        
        console.log('📝 Event logged:', event);
    },
    
    renderTimeline: function(filter = '') {
        const timeline = document.getElementById('communicationTimeline');
        if (!timeline) return;
        
        let filtered = this.events;
        if (filter) {
            filtered = this.events.filter(e => 
                e.details?.contactName?.toLowerCase().includes(filter.toLowerCase()) ||
                e.details?.message?.toLowerCase().includes(filter.toLowerCase())
            );
        }
        
        if (filtered.length === 0) {
            timeline.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No communication history</div>';
            return;
        }
        
        timeline.innerHTML = filtered.reverse().slice(0, 50).map(event => {
            const icon = {
                'call': '☎️',
                'email': '📧',
                'meeting': '📅',
                'message': '💬',
                'status_change': '🔄',
                'note': '📝'
            }[event.type] || '📌';
            
            const color = {
                'call': '#3b82f6',
                'email': '#8b5cf6',
                'meeting': '#f59e0b',
                'message': '#ec4899',
                'status_change': '#10b981',
                'note': '#6b7280'
            }[event.type] || '#6b7280';
            
            return `
                <div style="
                    border-left: 4px solid ${color};
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                ">
                    <div style="display: flex; align-items: start; gap: 10px;">
                        <span style="font-size: 24px;">${icon}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 500; color: #333;">
                                ${event.details?.contactName || 'Unknown Contact'}
                            </div>
                            <div style="color: #666; margin-top: 4px;">
                                ${event.details?.message || event.details?.note || 'No details'}
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: #999;">
                                <span>${event.user}</span>
                                <span>${this.formatTime(event.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    formatTime: function(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return new Date(date).toLocaleDateString();
    },
    
    getContactHistory: function(contactId) {
        return this.events.filter(e => e.contactId === contactId);
    },
    
    exportAuditLog: function() {
        const csv = 'Timestamp,User,Type,Contact,Details\\n' + 
            this.events.map(e => `"${e.timestamp}","${e.user}","${e.type}","${e.details?.contactName || ''}","${e.details?.message || ''}"`).join('\\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    },
    
    saveToStorage: function() {
        try {
            localStorage.setItem('crm_history', JSON.stringify(this.events));
        } catch (e) {
            console.log('localStorage not available');
        }
    },
    
    loadFromStorage: function() {
        try {
            const saved = localStorage.getItem('crm_history');
            if (saved) {
                this.events = JSON.parse(saved);
            }
        } catch (e) {
            console.log('localStorage not available');
        }
    }
};

// Initialize when module loads
window.HistoryModule.init();

console.log('✅ Communication History Module Ready');
