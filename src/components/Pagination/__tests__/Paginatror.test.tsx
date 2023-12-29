import { render, screen, fireEvent } from '@testing-library/react';
import Paginator from '../Paginator';

describe('Paginator', () => {
  const mockSetPage = jest.fn();

  test('renders correctly with initial data', () => {
    const data = { next: 'url?page=2', previous: null, results: new Array(20), count: 100 };
    render(<Paginator data={data} setPage={mockSetPage} />);

    expect(screen.getByText(/Pagina 1 di 5/i)).toBeInTheDocument();
  });

  test('calls setPage with the correct argument when "First" is clicked', () => {
    const data = { next: 'url?page=3', previous: 'url?page=1', results: new Array(20), count: 100 };
    render(<Paginator data={data} setPage={mockSetPage} />);

    fireEvent.click(screen.getByTestId('paginator-first'));
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  test('calls setPage with the correct argument when "Previous" is clicked', () => {
    const data = { next: 'url?page=3', previous: 'url?page=1', results: new Array(20), count: 100 };
    render(<Paginator data={data} setPage={mockSetPage} />);

    fireEvent.click(screen.getByTestId('paginator-prev'));
    expect(mockSetPage).toHaveBeenCalledWith(1); // because the current page would be 2
  });

  test('calls setPage with the correct argument when "Next" is clicked', () => {
    const data = { next: 'url?page=3', previous: 'url?page=1', results: new Array(20), count: 100 };
    render(<Paginator data={data} setPage={mockSetPage} />);

    fireEvent.click(screen.getByTestId('paginator-next'));
    expect(mockSetPage).toHaveBeenCalledWith(3); // because the current page would be 2
  });

  test('calls setPage with the correct argument when "Last" is clicked', () => {
    const data = { next: 'url?page=5', previous: 'url?page=4', results: new Array(20), count: 100 };
    render(<Paginator data={data} setPage={mockSetPage} />);

    fireEvent.click(screen.getByTestId('paginator-last'));
    expect(mockSetPage).toHaveBeenCalledWith(5); // because the total pages would be 5
  });
});
