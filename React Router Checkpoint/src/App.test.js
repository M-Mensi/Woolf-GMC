import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter
      initialEntries={[initialEntry]}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </MemoryRouter>
  );
}

test('opens a movie details page with its description and trailer', () => {
  renderApp();

  fireEvent.click(screen.getByRole('link', { name: /the matrix/i }));

  expect(screen.getByRole('heading', { name: 'The Matrix' })).toBeInTheDocument();
  expect(
    screen.getByText(/A programmer discovers reality is a simulation/i)
  ).toBeInTheDocument();
  expect(
    screen.getByTitle('The Matrix trailer').getAttribute('src')
  ).toBe('https://www.youtube.com/embed/vKQi3bBA1y8');
});

test('navigates back to the movie home page', () => {
  renderApp('/movies/1');

  fireEvent.click(screen.getByRole('link', { name: /back to home/i }));

  expect(
    screen.getByRole('heading', { name: 'My Movie & TV Show App' })
  ).toBeInTheDocument();
});

test('adds a movie with its trailer and opens its details page', () => {
  renderApp();

  fireEvent.change(screen.getByPlaceholderText('Title'), {
    target: { value: 'New Movie' },
  });
  fireEvent.change(screen.getByPlaceholderText('Poster URL'), {
    target: { value: 'https://example.com/poster.jpg' },
  });
  fireEvent.change(screen.getByPlaceholderText('Description'), {
    target: { value: 'A new movie description.' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Trailer embed URL/), {
    target: { value: 'https://www.youtube.com/embed/example123' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Add Movie' }));

  fireEvent.click(screen.getByRole('link', { name: /New Movie/i }));

  expect(screen.getByText('A new movie description.')).toBeInTheDocument();
  expect(screen.getByTitle('New Movie trailer').getAttribute('src')).toBe(
    'https://www.youtube.com/embed/example123'
  );
});
