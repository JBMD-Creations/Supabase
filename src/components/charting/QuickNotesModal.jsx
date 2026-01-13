import { useState, useEffect } from 'react';
import './QuickNotesModal.css';

const QuickNotesModal = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('hd-quick-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, pinned

  // Quick note templates
  const TEMPLATES = [
    { id: 'supply', label: 'Supply Issue', text: 'Supply issue: ' },
    { id: 'equipment', label: 'Equipment', text: 'Equipment note: ' },
    { id: 'staffing', label: 'Staffing', text: 'Staffing: ' },
    { id: 'followup', label: 'Follow-up', text: 'Follow-up needed: ' },
    { id: 'reminder', label: 'Reminder', text: 'Reminder: ' },
  ];

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('hd-quick-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now(),
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
      pinned: false,
      completed: false
    };

    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const togglePin = (id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    ));
  };

  const toggleComplete = (id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, completed: !n.completed } : n
    ));
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;

    setNotes(prev => prev.map(n =>
      n.id === editingId ? { ...n, text: editText.trim() } : n
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const useTemplate = (template) => {
    setNewNote(prev => prev + template.text);
  };

  const clearCompleted = () => {
    setNotes(prev => prev.filter(n => !n.completed));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(n => {
      if (filter === 'active') return !n.completed;
      if (filter === 'pinned') return n.pinned;
      return true;
    })
    .sort((a, b) => {
      // Pinned first, then by date
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const completedCount = notes.filter(n => n.completed).length;

  if (!isOpen) return null;

  return (
    <div className="quick-notes-overlay" onClick={onClose}>
      <div className="quick-notes-panel" onClick={e => e.stopPropagation()}>
        <div className="quick-notes-header">
          <h2>Quick Notes</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Quick Templates */}
        <div className="templates-bar">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              className="template-btn"
              onClick={() => useTemplate(template)}
            >
              {template.label}
            </button>
          ))}
        </div>

        {/* Add Note Input */}
        <div className="add-note-section">
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a quick note... (Enter to save)"
            rows="2"
          />
          <button
            className="add-note-btn"
            onClick={addNote}
            disabled={!newNote.trim()}
          >
            Add Note
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notes.length})
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({notes.length - completedCount})
          </button>
          <button
            className={`filter-tab ${filter === 'pinned' ? 'active' : ''}`}
            onClick={() => setFilter('pinned')}
          >
            Pinned ({notes.filter(n => n.pinned).length})
          </button>
          {completedCount > 0 && (
            <button className="clear-completed-btn" onClick={clearCompleted}>
              Clear Completed ({completedCount})
            </button>
          )}
        </div>

        {/* Notes List */}
        <div className="notes-list">
          {filteredNotes.length === 0 ? (
            <div className="empty-notes">
              <span className="empty-icon">📝</span>
              <p>No notes yet. Add one above!</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className={`note-item ${note.completed ? 'completed' : ''} ${note.pinned ? 'pinned' : ''}`}
              >
                {editingId === note.id ? (
                  <div className="note-edit">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={handleEditKeyPress}
                      autoFocus
                      rows="2"
                    />
                    <div className="edit-actions">
                      <button className="save-edit-btn" onClick={saveEdit}>Save</button>
                      <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="note-content">
                      <div className="note-actions-left">
                        <button
                          className={`action-btn complete-btn ${note.completed ? 'active' : ''}`}
                          onClick={() => toggleComplete(note.id)}
                          title={note.completed ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {note.completed ? '✓' : '○'}
                        </button>
                      </div>
                      <div className="note-text-container">
                        <p className="note-text">{note.text}</p>
                        <span className="note-time">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="note-actions">
                      <button
                        className={`action-btn pin-btn ${note.pinned ? 'active' : ''}`}
                        onClick={() => togglePin(note.id)}
                        title={note.pinned ? 'Unpin' : 'Pin'}
                      >
                        📌
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => startEdit(note)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteNote(note.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="quick-notes-footer">
          <p>Notes are saved locally and persist across sessions</p>
        </div>
      </div>
    </div>
  );
};

export default QuickNotesModal;
