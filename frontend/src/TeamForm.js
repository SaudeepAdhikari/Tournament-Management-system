import React, { useState } from 'react';

function TeamForm({ onAdd }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Team name is required');
      return;
    }

    onAdd({ id: Date.now(), name: name.trim(), createdAt: new Date().toISOString() });
    setName('');
    setError('');
  }

  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <input
        className="team-input"
        aria-label="Team name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter team name"
      />
      <button className="team-submit" type="submit">Add Team</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default TeamForm;
