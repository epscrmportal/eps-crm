/**
 * REAL-TIME NOTIFICATIONS & ALERTS MODULE
 * Provides popup alerts, notification center, and notification preferences
 */

window.NotificationModule = {
    notifications: [],
    
    // Initialize notifications
    init: function() {
        console.log('📢 Notifications Module Initialized');
        this.injectUI();
        this.startListening();
    },
    
    // Inject UI components
    injectUI: function() {
        // Add notification bell icon to header
        const header = document.querySelector('.header');
        if (!header) return;
        
        const bellHTML = `
            <div id="notificationBell" style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
                <button id="notificationBellBtn" style="
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    position: relative;
                ">
                    🔔
                    <span id="notificationBadge" style="
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: #ef4444;
                        color: white;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: bold;
                        display: none;
                    ">0</span>
                </button>
                
                <!-- Notification Panel -->
                <div id="notificationPanel" style="
                    display: none;
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                    width: 350px;
                    max-height: 500px;
                    overflow-y: auto;
                    z-index: 999;
                ">
                    <div style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">
                        Notifications
                    </div>
                    <div id="notificationsList" style="padding: 10px;"></div>
                </div>
            </div>
        `;
        
        // Insert after header
        header.insertAdjacentHTML('afterend', bellHTML);
        
        // Add click handler
        document.getElementById('notificationBellBtn').addEventListener('click', () => {
            const panel = document.getElementById('notificationPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('notificationPanel');
            const bell = document.getElementById('notificationBell');
            if (!bell.contains(e.target) && panel) {
                panel.style.display = 'none';
            }
        });
    },
    
    // Create a notification
    create: function(notificationData) {
        const notification = {
            id: Date.now(),
            type: notificationData.type || 'info', // info, warning, alert, success
            title: notificationData.title,
            message: notificationData.message || '',
            data: notificationData.data || {},
            timestamp: new Date(),
            isRead: false,
            isArchived: false
        };
        
        this.notifications.unshift(notification);
        
        // Show toast notification
        this.showToast(notification);
        
        // Update badge
        this.updateBadge();
        
        // Update notification list
        this.updateNotificationsList();
        
        // Store in localStorage
        this.saveTolocalStorage();
        
        return notification;
    },
    
    // Show toast notification (popup)
    showToast: function(notification) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        const bgColor = {
            'info': '#3b82f6',
            'warning': '#f59e0b',
            'alert': '#ef4444',
            'success': '#10b981'
        }[notification.type] || '#3b82f6';
        
        toast.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: start;">
                <div style="color: ${bgColor}; font-size: 20px;">
                    ${notification.type === 'success' ? '✅' : notification.type === 'alert' ? '⚠️' : notification.type === 'warning' ? '⚡' : 'ℹ️'}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #333;">${notification.title}</div>
                    <div style="color: #666; font-size: 13px;">${notification.message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },
    
    // Update badge count
    updateBadge: function() {
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    },
    
    // Update notifications list in panel
    updateNotificationsList: function() {
        const list = document.getElementById('notificationsList');
        if (!list) return;
        
        if (this.notifications.length === 0) {
            list.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No notifications</div>';
            return;
        }
        
        list.innerHTML = this.notifications.slice(0, 10).map(n => `
            <div style="
                padding: 12px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                background: ${n.isRead ? 'white' : '#f9f9f9'};
                transition: background 0.2s;
            " onclick="NotificationModule.markAsRead(${n.id})">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #333;">${n.title}</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">${n.message}</div>
                        <div style="font-size: 11px; color: #999; margin-top: 4px;">
                            ${this.formatTime(n.timestamp)}
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); NotificationModule.archiveNotification(${n.id})" style="
                        background: none;
                        border: none;
                        color: #ccc;
                        cursor: pointer;
                        font-size: 16px;
                    ">×</button>
                </div>
            </div>
        `).join('');
    },
    
    // Mark notification as read
    markAsRead: function(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.updateBadge();
            this.updateNotificationsList();
            this.saveTolocalStorage();
        }
    },
    
    // Archive notification
    archiveNotification: function(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index > -1) {
            this.notifications[index].isArchived = true;
            this.updateBadge();
            this.updateNotificationsList();
            this.saveTolocalStorage();
        }
    },
    
    // Format timestamp
    formatTime: function(date) {
        const now = new Date();
        const diff = now - date;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    },
    
    // Save to localStorage
    saveTolocalStorage: function() {
        try {
            localStorage.setItem('crm_notifications', JSON.stringify(this.notifications));
        } catch (e) {
            console.log('localStorage not available');
        }
    },
    
    // Load from localStorage
    loadFromLocalStorage: function() {
        try {
            const saved = localStorage.getItem('crm_notifications');
            if (saved) {
                this.notifications = JSON.parse(saved);
                this.updateBadge();
                this.updateNotificationsList();
            }
        } catch (e) {
            console.log('localStorage not available');
        }
    },
    
    // Start listening for events
    startListening: function() {
        // This will listen for ModuleManager notifications
        console.log('Listening for notification events...');
        
        // Load saved notifications
        this.loadFromLocalStorage();
    }
};

// Initialize when module loads
window.NotificationModule.init();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Notifications Module Ready');
