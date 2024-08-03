import "@testing-library/jest-dom";
import { render, fireEvent } from '@testing-library/react';
import Grid from '../Grid';
import config from "../../../config";

const mockBoard = Array(config.gridSize * config.gridSize).fill(undefined);

test('Grid cell click triggers appropriate function', () => {
  const handleCellClick = jest.fn();
  const { getAllByRole } = render(
    <Grid board={mockBoard} onCellClick={handleCellClick} errorDetails={[]} cellColors={Array(config.gridSize * config.gridSize).fill('')} />
  );

  const firstCell = getAllByRole('textbox')[0];
  fireEvent.click(firstCell);
  expect(handleCellClick).toHaveBeenCalledWith(0);
});
