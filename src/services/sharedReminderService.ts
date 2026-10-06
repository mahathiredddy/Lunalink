/**
 * Shared Reminder & Calendar Service for LunaLink
 * 
 * PURPOSE:
 * Help the user and trusted partner coordinate practical support.
 * 
 * PRIVACY RULES:
 * 1. The shared calendar must NOT expose the user's entire personal health calendar by default.
 * 2. The user chooses what is shared on a granular, per-reminder basis.
 * 3. Default for "Share this reminder with my partner" is OFF (false) for private information.
 * 4. Partner view displays ONLY reminders explicitly marked with isSharedWithPartner = true.
 * 5. Cycle-health information remains completely separate from shared practical reminders.
 */

import { SharedReminder, ReminderActivity, ReminderCategory, ReminderRepeat } from '../types';

const STORAGE_KEY_REMINDERS = 'lunalink_shared_reminders_v1';
const STORAGE_KEY_ACTIVITIES = 'lunalink_reminder_activities_v1';

// Reference date for initial state: September 2026
// 2026-09-13 is Sunday (Today)
// Tomorrow: 2026-09-14 (Monday)
// Friday: 2026-09-18
// Saturday: 2026-09-19

export const INITIAL_REMINDERS: SharedReminder[] = [
  {
    id: 'rem-1',
    title: 'Pick up comfort supplies',
    date: '2026-09-14', // Tomorrow
    time: '6:00 PM',
    category: 'Supplies',
    repeat: 'None',
    notes: 'Herbal ginger tea, dark chocolate (70%+), and fresh heating pads.',
    isSharedWithPartner: true,
    isCompleted: false,
    createdBy: 'user',
    createdByName: 'You',
    createdAt: '2026-09-13T10:00:00Z',
  },
  {
    id: 'rem-2',
    title: 'Appointment',
    date: '2026-09-18', // Friday
    time: '10:30 AM',
    category: 'Appointment',
    repeat: 'None',
    notes: 'Routine health checkup with Dr. Bennett. May need a calm ride home afterwards.',
    isSharedWithPartner: true,
    isCompleted: false,
    createdBy: 'user',
    createdByName: 'You',
    createdAt: '2026-09-12T14:30:00Z',
  },
  {
    id: 'rem-3',
    title: 'Check in',
    date: '2026-09-19', // Saturday
    time: 'Evening',
    category: 'Support',
    repeat: 'Weekly',
    notes: 'Gentle check-in after busy week. Low energy evening preferred.',
    isSharedWithPartner: true,
    isCompleted: false,
    createdBy: 'user',
    createdByName: 'You',
    createdAt: '2026-09-11T16:00:00Z',
  },
  {
    id: 'rem-4',
    title: 'Restock electrolyte powders',
    date: '2026-09-16',
    time: 'Morning',
    category: 'Supplies',
    repeat: 'None',
    notes: 'Citrus electrolyte mix from pantry.',
    isSharedWithPartner: true,
    isCompleted: true,
    completedAt: '2026-09-13T09:00:00Z',
    createdBy: 'partner',
    createdByName: 'Alex',
    createdAt: '2026-09-10T11:00:00Z',
  },
  {
    id: 'rem-5',
    title: 'Personal symptom reflections & journaling',
    date: '2026-09-15',
    time: '9:00 AM',
    category: 'Personal',
    repeat: 'None',
    notes: 'Private notes for personal cycle tracking. Not shared.',
    isSharedWithPartner: false, // DEFAULT OFF FOR PRIVATE INFORMATION
    isCompleted: false,
    createdBy: 'user',
    createdByName: 'You',
    createdAt: '2026-09-13T08:30:00Z',
  },
  {
    id: 'rem-6',
    title: 'Hydration & quiet evening walk',
    date: '2026-09-21',
    time: '7:30 PM',
    category: 'Support',
    repeat: 'None',
    notes: 'Only if energy levels feel comfortable.',
    isSharedWithPartner: true,
    isCompleted: false,
    createdBy: 'user',
    createdByName: 'You',
    createdAt: '2026-09-13T12:00:00Z',
  },
];

export const INITIAL_REMINDER_ACTIVITIES: ReminderActivity[] = [
  {
    id: 'act-1',
    reminderId: 'rem-1',
    action: 'created',
    reminderTitle: 'Pick up comfort supplies',
    actorName: 'You',
    actorRole: 'user',
    timestamp: '2026-09-13T10:00:00Z',
    details: 'Created and shared with partner for Tomorrow at 6:00 PM',
  },
  {
    id: 'act-2',
    reminderId: 'rem-4',
    action: 'completed',
    reminderTitle: 'Restock electrolyte powders',
    actorName: 'Alex (Partner)',
    actorRole: 'partner',
    timestamp: '2026-09-13T09:00:00Z',
    details: 'Alex marked task complete',
  },
  {
    id: 'act-3',
    reminderId: 'rem-2',
    action: 'created',
    reminderTitle: 'Appointment',
    actorName: 'You',
    actorRole: 'user',
    timestamp: '2026-09-12T14:30:00Z',
    details: 'Scheduled for Friday at 10:30 AM',
  },
  {
    id: 'act-4',
    reminderId: 'rem-3',
    action: 'created',
    reminderTitle: 'Check in',
    actorName: 'You',
    actorRole: 'user',
    timestamp: '2026-09-11T16:00:00Z',
    details: 'Weekly support check-in shared with Alex',
  },
  {
    id: 'act-5',
    reminderId: 'rem-5',
    action: 'created',
    reminderTitle: 'Personal symptom reflections & journaling',
    actorName: 'You',
    actorRole: 'user',
    timestamp: '2026-09-13T08:30:00Z',
    details: 'Kept private (partner cannot view)',
  },
];

export const sharedReminderService = {
  getReminders(): SharedReminder[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_REMINDERS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(INITIAL_REMINDERS));
        return INITIAL_REMINDERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_REMINDERS;
    }
  },

  saveReminders(reminders: SharedReminder[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.error('Failed to save reminders to localStorage', e);
    }
  },

  getActivities(): ReminderActivity[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(INITIAL_REMINDER_ACTIVITIES));
        return INITIAL_REMINDER_ACTIVITIES;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_REMINDER_ACTIVITIES;
    }
  },

  logActivity(activity: Omit<ReminderActivity, 'id' | 'timestamp'>): ReminderActivity {
    const activities = this.getActivities();
    const newAct: ReminderActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newAct, ...activities].slice(0, 50); // Keep last 50
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save activities to localStorage', e);
    }
    return newAct;
  },

  /**
   * Filter reminders for partner view.
   * STRICT SAFETY RULE: Return ONLY reminders where isSharedWithPartner === true.
   */
  getPartnerVisibleReminders(reminders: SharedReminder[]): SharedReminder[] {
    return reminders.filter((r) => r.isSharedWithPartner);
  },

  addReminder(
    data: Omit<SharedReminder, 'id' | 'createdAt' | 'isCompleted'>
  ): { reminder: SharedReminder; activity: ReminderActivity } {
    const reminders = this.getReminders();
    const newReminder: SharedReminder = {
      ...data,
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    const updatedReminders = [newReminder, ...reminders];
    this.saveReminders(updatedReminders);

    const activity = this.logActivity({
      reminderId: newReminder.id,
      action: 'created',
      reminderTitle: newReminder.title,
      actorName: newReminder.createdByName || 'You',
      actorRole: newReminder.createdBy || 'user',
      details: newReminder.isSharedWithPartner
        ? `Shared with partner for ${newReminder.date} at ${newReminder.time}`
        : `Created as private reminder (${newReminder.date})`,
    });

    return { reminder: newReminder, activity };
  },

  updateReminder(
    id: string,
    updates: Partial<Omit<SharedReminder, 'id' | 'createdAt'>>
  ): { reminder: SharedReminder | null; activity?: ReminderActivity } {
    const reminders = this.getReminders();
    const idx = reminders.findIndex((r) => r.id === id);
    if (idx === -1) return { reminder: null };

    const old = reminders[idx];
    const updated: SharedReminder = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    reminders[idx] = updated;
    this.saveReminders(reminders);

    let activityDetails = 'Updated reminder details';
    if (updates.isSharedWithPartner !== undefined && updates.isSharedWithPartner !== old.isSharedWithPartner) {
      activityDetails = updates.isSharedWithPartner
        ? 'Explicitly shared with partner'
        : 'Privacy enabled: unshared from partner view';
    }

    const activity = this.logActivity({
      reminderId: updated.id,
      action: updates.isSharedWithPartner !== undefined && updates.isSharedWithPartner !== old.isSharedWithPartner
        ? 'sharing_toggled'
        : 'updated',
      reminderTitle: updated.title,
      actorName: 'You',
      actorRole: 'user',
      details: activityDetails,
    });

    return { reminder: updated, activity };
  },

  deleteReminder(id: string): { success: boolean; activity?: ReminderActivity } {
    const reminders = this.getReminders();
    const target = reminders.find((r) => r.id === id);
    if (!target) return { success: false };

    const filtered = reminders.filter((r) => r.id !== id);
    this.saveReminders(filtered);

    const activity = this.logActivity({
      reminderId: id,
      action: 'deleted',
      reminderTitle: target.title,
      actorName: 'You',
      actorRole: 'user',
      details: 'Reminder removed from calendar',
    });

    return { success: true, activity };
  },

  toggleComplete(id: string): { reminder: SharedReminder | null; activity?: ReminderActivity } {
    const reminders = this.getReminders();
    const idx = reminders.findIndex((r) => r.id === id);
    if (idx === -1) return { reminder: null };

    const current = reminders[idx];
    const newCompleted = !current.isCompleted;
    const updated: SharedReminder = {
      ...current,
      isCompleted: newCompleted,
      completedAt: newCompleted ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };
    reminders[idx] = updated;
    this.saveReminders(reminders);

    const activity = this.logActivity({
      reminderId: updated.id,
      action: newCompleted ? 'completed' : 'uncompleted',
      reminderTitle: updated.title,
      actorName: 'You',
      actorRole: 'user',
      details: newCompleted ? 'Marked as completed' : 'Reopened / marked incomplete',
    });

    return { reminder: updated, activity };
  },
};
