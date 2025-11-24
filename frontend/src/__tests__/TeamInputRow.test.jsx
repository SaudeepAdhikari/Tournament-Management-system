import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamInputRow from '../components/TeamInputRow';

test('TeamInputRow renders and calls onChange and onRemove', () => {
  const handleChange = jest.fn();
  const handleRemove = jest.fn();

  render(<TeamInputRow idx={0} value="" onChange={handleChange} onRemove={handleRemove} canRemove={true} />);

  const input = screen.getByPlaceholderText(/Team 1 name/i);
  expect(input).toBeInTheDocument();

  fireEvent.change(input, { target: { value: 'Alpha FC' } });
  expect(handleChange).toHaveBeenCalledWith(0, 'Alpha FC');

  const removeBtn = screen.getByText(/remove/i);
  fireEvent.click(removeBtn);
  expect(handleRemove).toHaveBeenCalledWith(0);
});
