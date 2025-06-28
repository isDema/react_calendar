import React from 'react';

export default function AddEventModal({ newEvent, onTitleChange, onDescChange, onStartTimeChange, onEndTimeChange, onAdd, onClose, onRemove
}) {
  if (!newEvent) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -30%)',
      background: '#170122',
      color: 'white',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      zIndex: 1000
    }}>
      <h3>Titolo</h3>
      <input type='text' placeholder="..." value={newEvent.title} onChange={onTitleChange} />
      <br />
      <h3>Descrizione</h3>
      <input type='text' placeholder="..." value={newEvent.desc} onChange={onDescChange} />
      <br />
      <h3>Inizio</h3>
      <input
        type="time"
        value={newEvent.start ? newEvent.start.toTimeString().slice(0, 5) : ''}
        onChange={onStartTimeChange}
      />
      <h3>Fine</h3>
      <input
        type="time"
        value={newEvent.end ? newEvent.end.toTimeString().slice(0, 5) : ''}
        onChange={onEndTimeChange}
      />
      <br />
      <br />
      <button onClick={onAdd}>Aggiungi</button>
      <br />
      <br />
      <button onClick={onClose}>Chiudi</button>
      <br />
      <br />
      <button onClick={onRemove}>Rimuovi</button>
    </div>
  );
}
