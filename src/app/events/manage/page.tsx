'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/lib/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  ListOrdered, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  X, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

const EVENT_TYPES = ['Donation', 'Cleanup', 'Plantation', 'Healthcare', 'Education', 'Other'];

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [updating, setUpdating] = useState(false);

  // Delete Confirm Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const data = await api.get<EventItem[]>('/events/user/my-events');
      setEvents(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // Handle Edit Input Change
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editingEvent) return;
    setEditingEvent({
      ...editingEvent,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Update
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!editingEvent.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!editingEvent.location.trim()) {
      toast.error('Location is required');
      return;
    }
    if (editingEvent.eventDate < todayStr) {
      toast.error('Event date must be in the future');
      return;
    }

    try {
      setUpdating(true);
      const res = await api.put<{ message: string }>(`/events/${editingEvent._id}`, editingEvent);
      toast.success(res.message || 'Event updated successfully!');
      setEditingEvent(null);
      fetchMyEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
    } finally {
      setUpdating(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      const res = await api.delete<{ message: string }>(`/events/${deletingId}`);
      toast.success(res.message || 'Event deleted successfully');
      setDeletingId(null);
      setEvents(events.filter((ev) => ev._id !== deletingId));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider">
              <ListOrdered className="w-4 h-4" />
              <span>Organizer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight">
              Manage Your Hosted Events
            </h1>
            <p className="text-sm text-base-content/70">
              Update event itineraries, manage dates, or remove drives you have initiated.
            </p>
          </div>

          <Link
            href="/events/create"
            className="btn btn-sm sm:btn-md bg-green-600 hover:bg-green-700 text-white border-none rounded-xl font-bold flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* Content Table / List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-base-200 rounded-2xl w-full"></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="bg-base-100 border border-base-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr className="bg-base-200/60 text-base-content/80 text-xs uppercase tracking-wider">
                    <th>Event</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Volunteers</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev._id} className="hover:bg-base-200/50 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={ev.thumbnail}
                            alt={ev.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-base-300"
                          />
                          <div className="font-bold text-base-content line-clamp-1 max-w-xs">
                            <Link href={`/events/${ev._id}`} className="hover:text-green-600 transition-colors">
                              {ev.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-sm badge-outline font-semibold">
                          {ev.eventType}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 font-medium text-xs text-base-content/80">
                          <Calendar className="w-3.5 h-3.5 text-green-600" />
                          <span>{ev.eventDate}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-xs text-base-content/80 max-w-[180px] truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-xs text-base-content/80">
                          <Users className="w-3.5 h-3.5 text-blue-500" />
                          <span>{ev.attendeesCount || 0}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingEvent(ev)}
                            className="btn btn-xs btn-outline btn-info rounded-lg flex items-center gap-1"
                            title="Edit Event"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setDeletingId(ev._id)}
                            className="btn btn-xs btn-outline btn-error rounded-lg flex items-center gap-1"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-base-200/40 rounded-3xl border border-dashed border-base-300 p-8 space-y-3">
            <ListOrdered className="w-12 h-12 mx-auto text-base-content/40" />
            <h3 className="text-xl font-bold text-base-content">No Created Events Yet</h3>
            <p className="text-sm text-base-content/60 max-w-md mx-auto">
              You haven't posted any social development drives yet. Start by creating a community event today!
            </p>
            <Link href="/events/create" className="btn btn-sm bg-green-600 text-white rounded-xl">
              Host an Event
            </Link>
          </div>
        )}

        {/* EDIT EVENT MODAL */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-base-100 border border-base-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-base-200">
                <h3 className="text-xl font-extrabold text-base-content">Update Event Details</h3>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="btn btn-sm btn-circle btn-ghost text-base-content"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/70">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editingEvent.title}
                    onChange={handleEditChange}
                    required
                    className="input input-bordered w-full rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-base-content/70">Category</label>
                    <select
                      name="eventType"
                      value={editingEvent.eventType}
                      onChange={handleEditChange}
                      className="select select-bordered w-full rounded-xl text-sm"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-base-content/70">Event Date</label>
                    <input
                      type="date"
                      name="eventDate"
                      min={todayStr}
                      value={editingEvent.eventDate}
                      onChange={handleEditChange}
                      required
                      className="input input-bordered w-full rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/70">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editingEvent.location}
                    onChange={handleEditChange}
                    required
                    className="input input-bordered w-full rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/70">Thumbnail Image URL</label>
                  <input
                    type="text"
                    name="thumbnail"
                    value={editingEvent.thumbnail}
                    onChange={handleEditChange}
                    required
                    placeholder="/images/events/... or https://..."
                    className="input input-bordered w-full rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-base-content/70">Description</label>
                  <textarea
                    rows={4}
                    name="description"
                    value={editingEvent.description}
                    onChange={handleEditChange}
                    required
                    className="textarea textarea-bordered w-full rounded-xl text-sm leading-relaxed"
                  ></textarea>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-base-200">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="btn btn-sm btn-ghost rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none rounded-xl px-5"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-base-100 border border-base-200 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-base-content">Delete This Event?</h3>
              <p className="text-sm text-base-content/70">
                Are you sure you want to remove this community initiative? Registered volunteers will no longer be able to view it.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="btn btn-sm btn-ghost rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="btn btn-sm btn-error text-white rounded-xl px-5"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Event'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}

