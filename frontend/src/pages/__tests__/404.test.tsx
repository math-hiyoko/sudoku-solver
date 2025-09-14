import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFoundPage from '../404';

// Mock Gatsby's Link component
jest.mock('gatsby', () => ({
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

describe('NotFoundPage', () => {
  test('renders 404 page elements', () => {
    render(<NotFoundPage />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist.")).toBeInTheDocument();
  });

  test('renders link back to home page', () => {
    render(<NotFoundPage />);
    
    const homeLink = screen.getByText('Back to Sudoku Solver');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  test('has correct styling and layout', () => {
    render(<NotFoundPage />);
    
    const title = screen.getByText('404');
    const subtitle = screen.getByText('Page Not Found');
    const message = screen.getByText("The page you're looking for doesn't exist.");
    const link = screen.getByText('Back to Sudoku Solver');
    
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });
});