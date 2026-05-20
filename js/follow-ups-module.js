/**
 * AUTOMATED FOLLOW-UP SYSTEM MODULE
 * Manages follow-up rules, scheduling, and automatic actions
 */

window.FollowUpModule = {
    followUps: [],
    rules: [
        {
            id: 1,
            name: 'No Response in 3 Days',
            trigger: 'no_response',
            triggerDays: 3,
            action: 'create_reminder',
            enabled: true
        },
        {
            id: 2,
            name: 'Post-Meeting Follow-up',
            trigger: 'meeting_completed',
            action: 'send_template',
            templateId: 'thank_you',
            enabled: true
        }
    ],
    
    init: function() {
        console.log('🔄 Follow-Up Module Initialized');
        this.injectUI();
        this.startAutoFollowUpCheck();
    },
    
    injectUI: function() {
        const mainContent = document.querySelector('.container');
        if (!mainContent) return;
        
        const followUpHTML = `
            <div id="followUpPanel" style="display: none; margin-top: 30px;">
                <h2>🔄 Automated Follow-Ups</h2>
                
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <strong style="color: #059669;">✅ Auto Follow-up System Active</strong>
                    <p style="color: #666; margin-top: 5px;">System will automatically create reminders and tasks based on configured rules.</p>
                </div>
                
                <h3>📋 Active Rules</h3>
                <div id="rulesList" style="display: grid; gap: 10px;">
                </div>
                
                <h3 style="margin-top: 30px;">🔔 Pending Follow-ups</h3>
                <div id="followUpsList" style="display: grid; gap: 10px;">
                </div>
            </div>
        `;
        
        mainContent.insertAdjacentHTML('afterend', followUpHTML);
        this.renderRules();
    },
    
    renderRules: function() {
        const rulesList = document.getElementById('rulesList');
        if (!rulesList) return;
        
        rulesList.innerHTML = this.rules.map(rule => `
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #333;">${rule.name}</div>
                        <div style="font-size: 12px; color: #666; margin-top: 3px;">
                            ${rule.trigger === 'no_response' ? `Trigger: No response after ${rule.triggerDays} days` : 'Trigger: Meeting completed'}
                        </div>
                    </div>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" ${rule.enabled ? 'checked' : ''} onchange="FollowUpModule.toggleRule(${rule.id}, this.checked)" style="cursor: pointer;">
                        <span style="color: #666; font-size: 12px;">Enabled</span>
                    </label>
                </div>
            </div>
        `).join('');
    },
    
    toggleRule: function(ruleId, enabled) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            rule.enabled = enabled;
            if (window.ModuleManager) {
                window.ModuleManager.notify(
                    'success',
                    'Rule Updated',
                    rule.enabled ? `Rule "${rule.name}" is now active` : `Rule "${rule.name}" is now inactive`
                );
            }
        }
    },
    
    createFollowUp: function(contactId, contactName, followUpDate, reason) {
        const followUp = {
            id: Date.now(),
            contactId: contactId,
            contactName: contactName,
            scheduledDate: followUpDate,
            reason: reason,
            status: 'pending',
            createdAt: new Date()
        };
        
        this.followUps.push(followUp);
        this.saveToStorage();
        this.renderFollowUps();
        
        if (window.ModuleManager) {
            window.ModuleManager.notify('info', 'Follow-up Scheduled', `Follow-up with ${contactName} scheduled for ${followUpDate}`);
        }
    },
    
    completeFollowUp: function(followUpId) {
        const followUp = this.followUps.find(f => f.id === followUpId);
        if (followUp) {
            followUp.status = 'completed';
            followUp.completedAt = new Date();
            this.saveToStorage();
            this.renderFollowUps();
        }
    },
    
    renderFollowUps: function() {
        const followUpsList = document.getElementById('followUpsList');
        if (!followUpsList) return;
        
        const pending = this.followUps.filter(f => f.status === 'pending');
        
        if (pending.length === 0) {
            followUpsList.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No pending follow-ups</div>';
            return;
        }
        
        followUpsList.innerHTML = pending.map(f => `
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #333;">${f.contactName}</div>
                        <div style="font-size: 12px; color: #666; margin-top: 3px;">
                            Reason: ${f.reason}
                        </div>
                        <div style="font-size: 12px; color: #999; margin-top: 3px;">
                            Scheduled: ${f.scheduledDate}
                        </div>
                    </div>
                    <button onclick="FollowUpModule.completeFollowUp(${f.id})" style="padding: 8px 12px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">✅ Done</button>
                </div>
            </div>
        `).join('');
    },
    
    startAutoFollowUpCheck: function() {
        // Check every hour for follow-ups due
        setInterval(() => {
            const now = new Date();
            const pending = this.followUps.filter(f => f.status === 'pending');
            
            pending.forEach(f => {
                const dueDate = new Date(f.scheduledDate);
                if (dueDate <= now) {
                    if (window.ModuleManager) {
                        window.ModuleManager.notify(
                            'alert',
                            'Follow-up Due',
                            `Time to follow up with ${f.contactName}. Reason: ${f.reason}`
                        );
                    }
                }
            });
        }, 3600000); // Every hour
    },
    
    saveToStorage: function() {
        try {
            localStorage.setItem('crm_followups', JSON.stringify(this.followUps));
        } catch (e) {
            console.log('localStorage not available');
        }
    }
};

// Initialize when module loads
window.FollowUpModule.init();

console.log('✅ Follow-Up Module Ready');
