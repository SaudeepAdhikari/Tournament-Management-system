import React from 'react';

// Controlled input row for a single team with optional remove button
export default function TeamInputRow({ idx, value, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold shadow-lg">
        {idx + 1}
      </div>
      <input
        className="flex-1 input-glass group-hover:border-white/30"
        value={value}
        onChange={(e) => onChange(idx, e.target.value)}
        placeholder={`Enter team ${idx + 1} name...`}
      />
      {canRemove && (
        <button
          onClick={() => onRemove(idx)}
          className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}
