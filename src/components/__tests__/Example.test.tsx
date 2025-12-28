import { render, screen } from '@testing-library/react'

describe('Example test', () => {
  it('renders a heading', () => {
    render(<h1>Hello, world!</h1>)
    expect(screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument()
  })
})

