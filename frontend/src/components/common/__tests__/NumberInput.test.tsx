import "@testing-library/jest-dom";
import { render, fireEvent } from '@testing-library/react';
import NumberInput from '../NumberInput';

test('NumberInput button click updates selection', () => {
  const onSelect = jest.fn();
  const { getByText } = render(<NumberInput onSelect={onSelect} />);

  const numberButton = getByText('1');
  fireEvent.click(numberButton);
  expect(onSelect).toHaveBeenCalledWith(1);
});
