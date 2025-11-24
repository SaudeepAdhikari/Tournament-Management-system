import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MatchCard from '../components/MatchCard';

test('MatchCard renders teams and reports winner selection', () => {
  const onSelectWinner = jest.fn();
  render(<MatchCard matchId={2} teamA="Team A" teamB="Team B" winner={null} onSelectWinner={onSelectWinner} />);

  const teamAEl = screen.getByText('Team A');
  const teamBEl = screen.getByText('Team B');
  expect(teamAEl).toBeInTheDocument();
  expect(teamBEl).toBeInTheDocument();

  fireEvent.click(teamAEl);
  expect(onSelectWinner).toHaveBeenCalledWith(2, 'Team A');

  fireEvent.click(teamBEl);
  expect(onSelectWinner).toHaveBeenCalledWith(2, 'Team B');
});
