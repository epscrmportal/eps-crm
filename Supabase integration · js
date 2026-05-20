/**
 * SUPABASE INTEGRATION MODULE
 * Handles call notes, scheduled meetings, reminders, and contact history
 */

// Supabase configuration
const SUPABASE_URL = 'https://rbxxvlrmcvrqentmctfb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJieHh2bHJtY3ZycWVudG1jdGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNTA5NjMsImV4cCI6MjA5NDgyNjk2M30.g6vgxJJGBQK6kbXGLVBigqOfhsXC6obHXka54zaahqM';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.CrmSupabase = {
    // Save call note
    async saveCallNote(contactId, contactName, notes, callDuration, nextAction) {
        try {
            const { data, error } = await supabase
                .from('call_notes')
                .insert({
                    contact_id: contactId,
                    contact_name: contactName,
                    notes: notes,
                    call_duration: callDuration,
                    next_action: nextAction,
                    created_by: window.currentUser?.name || 'Unknown'
                });

            if (error) throw error;
            console.log('✅ Call note saved:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error saving call note:', error);
            return { success: false, error: error.message };
        }
    },

    // Schedule meeting
    async scheduleMeeting(contactId, contactName, meetingDate, meetingTime, location, assignedTo, notes) {
        try {
            const { data, error } = await supabase
                .from('scheduled_meetings')
                .insert({
                    contact_id: contactId,
                    contact_name: contactName,
                    meeting_date: meetingDate,
                    meeting_time: meetingTime,
                    location: location,
                    assigned_to: assignedTo,
                    notes: notes,
                    created_by: window.currentUser?.name || 'Unknown'
                });

            if (error) throw error;
            console.log('✅ Meeting scheduled:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error scheduling meeting:', error);
            return { success: false, error: error.message };
        }
    },

    // Create reminder
    async createReminder(contactId, contactName, reminderDate, reminderText) {
        try {
            const { data, error } = await supabase
                .from('reminders')
                .insert({
                    contact_id: contactId,
                    contact_name: contactName,
                    reminder_date: reminderDate,
                    reminder_text: reminderText,
                    created_by: window.currentUser?.name || 'Unknown'
                });

            if (error) throw error;
            console.log('✅ Reminder created:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error creating reminder:', error);
            return { success: false, error: error.message };
        }
    },

    // Get contact history
    async getContactHistory(contactId) {
        try {
            const { data: notes, error: notesError } = await supabase
                .from('call_notes')
                .select('*')
                .eq('contact_id', contactId)
                .order('created_at', { ascending: false });

            const { data: meetings, error: meetingsError } = await supabase
                .from('scheduled_meetings')
                .select('*')
                .eq('contact_id', contactId)
                .order('created_at', { ascending: false });

            const { data: reminders, error: remindersError } = await supabase
                .from('reminders')
                .select('*')
                .eq('contact_id', contactId)
                .order('created_at', { ascending: false });

            if (notesError || meetingsError || remindersError) throw new Error('Error fetching history');

            return {
                success: true,
                notes: notes || [],
                meetings: meetings || [],
                reminders: reminders || []
            };
        } catch (error) {
            console.error('❌ Error fetching contact history:', error);
            return { success: false, notes: [], meetings: [], reminders: [] };
        }
    },

    // Get all reminders for today
    async getTodayReminders() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('reminders')
                .select('*')
                .eq('status', 'pending')
                .gte('reminder_date', today)
                .lte('reminder_date', today + 'T23:59:59');

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            console.error('❌ Error fetching today reminders:', error);
            return { success: false, data: [] };
        }
    }
};

console.log('✅ Supabase Integration Module Loaded');
