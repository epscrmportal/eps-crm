/**
 * BULK OPERATIONS & SMART FILTERS MODULE
 * Provides advanced filtering, bulk actions, and smart suggestions
 */

window.BulkOperationsModule = {
    savedFilters: [],
    
    init: function() {
        console.log('🔍 Bulk Operations Module Initialized');
        this.injectUI();
        this.loadFromStorage();
    },
    
    injectUI: function() {
        const mainContent = document.querySelector('.container');
        if (!mainContent) return;
        
        const bulkHTML = `
            <div id="bulkOperationsPanel" style="display: none; margin-top: 30px;">
                <h2>🔍 Bulk Operations & Smart Filters</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>🔎 Advanced Filters</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px;">
                        <div>
                            <label>Status</label>
                            <select id="filterStatus" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="">All Statuses</option>
                                <option value="warm">Warm Lead</option>
                                <option value="called">Called</option>
                                <option value="interested">Interested</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        
                        <div>
                            <label>Location</label>
                            <select id="filterLocation" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="">All Locations</option>
                                <option value="mumbai">Mumbai</option>
                                <option value="delhi">Delhi</option>
                                <option value="bangalore">Bangalore</option>
                                <option value="pune">Pune</option>
                            </select>
                        </div>
                        
                        <div>
                            <label>Last Called</label>
                            <select id="filterLastCalled" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="">Any Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="never">Never</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button onclick="BulkOperationsModule.applyFilters()" class="btn-primary" style="padding: 10px 20px;">🔎 Apply Filters</button>
                        <button onclick="BulkOperationsModule.saveFilter()" class="btn-secondary" style="padding: 10px 20px;">💾 Save Filter</button>
                        <button onclick="BulkOperationsModule.clearFilters()" class="btn-secondary" style="padding: 10px 20px;">🔄 Reset</button>
                    </div>
                </div>
                
                <h3 style="margin-top: 30px;">⚡ Bulk Actions</h3>
                <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <div style="margin: 15px 0;">
                        <label>
                            <input type="checkbox" id="selectAll"> Select All Matching Results
                        </label>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button onclick="BulkOperationsModule.bulkClaim()" class="btn-success" style="padding: 8px 15px;">🟢 Bulk Claim</button>
                        <button onclick="BulkOperationsModule.bulkAssign()" class="btn-primary" style="padding: 8px 15px;">📝 Bulk Assign to FE</button>
                        <button onclick="BulkOperationsModule.bulkExport()" class="btn-primary" style="padding: 8px 15px;">📥 Bulk Export</button>
                        <button onclick="BulkOperationsModule.bulkSendEmail()" class="btn-primary" style="padding: 8px 15px;">📧 Bulk Email</button>
                    </div>
                </div>
                
                <h3 style="margin-top: 30px;">💡 Smart Suggestions</h3>
                <div id="smartSuggestions" style="display: grid; gap: 10px;">
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px;">
                        <div style="font-weight: 500; color: #92400e;">🔥 Hot Leads</div>
                        <p style="color: #78350f; margin-top: 5px;">12 leads ready to convert. High probability of closure.</p>
                        <button onclick="BulkOperationsModule.applySmartFilter('hot_leads')" style="margin-top: 10px; padding: 8px 15px; background: #f59e0b; color: white; border: none; border-radius: 5px; cursor: pointer;">Apply Filter</button>
                    </div>
                    
                    <div style="background: #fecdd3; border-left: 4px solid #f87171; padding: 15px; border-radius: 8px;">
                        <div style="font-weight: 500; color: #831843;">⚠️ Overdue Follow-ups</div>
                        <p style="color: #be123c; margin-top: 5px;">5 leads with overdue follow-ups. Need immediate attention.</p>
                        <button onclick="BulkOperationsModule.applySmartFilter('overdue')" style="margin-top: 10px; padding: 8px 15px; background: #f87171; color: white; border: none; border-radius: 5px; cursor: pointer;">Apply Filter</button>
                    </div>
                </div>
            </div>
        `;
        
        mainContent.insertAdjacentHTML('afterend', bulkHTML);
    },
    
    applyFilters: function() {
        const status = document.getElementById('filterStatus').value;
        const location = document.getElementById('filterLocation').value;
        const lastCalled = document.getElementById('filterLastCalled').value;
        
        const filters = { status, location, lastCalled };
        
        if (window.ModuleManager) {
            window.ModuleManager.notify('info', 'Filters Applied', `Showing results with filters: ${JSON.stringify(filters)}`);
        }
    },
    
    saveFilter: function() {
        const filterName = prompt('Enter filter name:');
        if (!filterName) return;
        
        const filter = {
            id: Date.now(),
            name: filterName,
            status: document.getElementById('filterStatus').value,
            location: document.getElementById('filterLocation').value,
            lastCalled: document.getElementById('filterLastCalled').value
        };
        
        this.savedFilters.push(filter);
        this.saveToStorage();
        
        if (window.ModuleManager) {
            window.ModuleManager.notify('success', 'Filter Saved', `Filter "${filterName}" saved for quick access`);
        }
    },
    
    clearFilters: function() {
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterLocation').value = '';
        document.getElementById('filterLastCalled').value = '';
        document.getElementById('selectAll').checked = false;
    },
    
    bulkClaim: function() {
        alert('🟢 Bulk Claim\\n\\nSelected 12 leads will be claimed.\\n\\nThis will set their status to "Working" under your name.');
    },
    
    bulkAssign: function() {
        const fieldExec = prompt('Select Field Executive to assign to:', 'Anjali Patel');
        if (fieldExec) {
            alert(`📝 Bulk Assign\\n\\nSelected leads will be assigned to ${fieldExec}`);
        }
    },
    
    bulkExport: function() {
        alert('📥 Export\\n\\nSelected leads will be exported as Excel file.\\n\\nFile: leads-export-' + new Date().toISOString().split('T')[0] + '.xlsx');
    },
    
    bulkSendEmail: function() {
        const template = prompt('Select email template:', 'default');
        if (template) {
            alert(`📧 Bulk Email\\n\\nEmail will be sent to all selected leads using "${template}" template.`);
        }
    },
    
    applySmartFilter: function(filterType) {
        if (filterType === 'hot_leads') {
            document.getElementById('filterStatus').value = 'interested';
            this.applyFilters();
        } else if (filterType === 'overdue') {
            document.getElementById('filterLastCalled').value = 'never';
            this.applyFilters();
        }
    },
    
    saveToStorage: function() {
        try {
            localStorage.setItem('crm_saved_filters', JSON.stringify(this.savedFilters));
        } catch (e) {
            console.log('localStorage not available');
        }
    },
    
    loadFromStorage: function() {
        try {
            const saved = localStorage.getItem('crm_saved_filters');
            if (saved) {
                this.savedFilters = JSON.parse(saved);
            }
        } catch (e) {
            console.log('localStorage not available');
        }
    }
};

// Initialize when module loads
window.BulkOperationsModule.init();

console.log('✅ Bulk Operations Module Ready');
