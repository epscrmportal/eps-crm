/**
 * REAL-TIME ANALYTICS & PERFORMANCE DASHBOARD MODULE
 * Provides live metrics, charts, and performance analysis
 */

window.AnalyticsModule = {
    metrics: {
        callsMade: 0,
        callsSuccessful: 0,
        meetingsScheduled: 0,
        contactsAdded: 0,
        followUpsCreated: 0,
        conversionRate: 0,
        avgCallDuration: 0
    },
    
    init: function() {
        console.log('📊 Analytics Module Initialized');
        this.injectUI();
        this.loadFromStorage();
        this.renderDashboard();
    },
    
    injectUI: function() {
        const mainContent = document.querySelector('.container');
        if (!mainContent) return;
        
        const analyticsHTML = `
            <div id="analyticsDashboard" style="display: none; margin-top: 30px;">
                <h2>📊 Real-Time Performance Analytics</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 32px; font-weight: bold; color: #3b82f6;" id="metricCalls">0</div>
                        <div style="color: #666; margin-top: 5px;">Calls Made Today</div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 32px; font-weight: bold; color: #10b981;" id="metricMeetings">0</div>
                        <div style="color: #666; margin-top: 5px;">Meetings Scheduled</div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 32px; font-weight: bold; color: #f59e0b;" id="metricContacts">0</div>
                        <div style="color: #666; margin-top: 5px;">Contacts Added</div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 32px; font-weight: bold; color: #8b5cf6;" id="metricConversion">0%</div>
                        <div style="color: #666; margin-top: 5px;">Conversion Rate</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <canvas id="performanceChart" style="max-height: 300px;"></canvas>
                </div>
            </div>
        `;
        
        mainContent.insertAdjacentHTML('afterend', analyticsHTML);
    },
    
    updateMetric: function(metric, value) {
        if (metric in this.metrics) {
            this.metrics[metric] = value;
            this.saveToStorage();
            this.renderDashboard();
        }
    },
    
    renderDashboard: function() {
        // Update metric displays
        const callsEl = document.getElementById('metricCalls');
        const meetingsEl = document.getElementById('metricMeetings');
        const contactsEl = document.getElementById('metricContacts');
        const conversionEl = document.getElementById('metricConversion');
        
        if (callsEl) callsEl.textContent = this.metrics.callsMade;
        if (meetingsEl) meetingsEl.textContent = this.metrics.meetingsScheduled;
        if (contactsEl) contactsEl.textContent = this.metrics.contactsAdded;
        if (conversionEl) {
            const rate = this.metrics.callsMade > 0 
                ? Math.round((this.metrics.callsSuccessful / this.metrics.callsMade) * 100)
                : 0;
            conversionEl.textContent = rate + '%';
        }
        
        // Render chart
        this.renderChart();
    },
    
    renderChart: function() {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Check if chart already exists
        if (window.performanceChartInstance) {
            window.performanceChartInstance.destroy();
        }
        
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not loaded');
            return;
        }
        
        window.performanceChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Calls Made',
                        data: [12, 15, 10, 18, 14, 16, this.metrics.callsMade],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Meetings Scheduled',
                        data: [5, 6, 4, 7, 6, 5, this.metrics.meetingsScheduled],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weekly Performance Trend'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    }
                }
            }
        });
    },
    
    saveToStorage: function() {
        try {
            localStorage.setItem('crm_analytics', JSON.stringify(this.metrics));
        } catch (e) {
            console.log('localStorage not available');
        }
    },
    
    loadFromStorage: function() {
        try {
            const saved = localStorage.getItem('crm_analytics');
            if (saved) {
                this.metrics = { ...this.metrics, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.log('localStorage not available');
        }
    }
};

// Initialize when module loads
window.AnalyticsModule.init();

console.log('✅ Analytics Module Ready');
