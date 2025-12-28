import { render, screen, fireEvent } from '@testing-library/react'
import { AccountPreviewCard } from '../AccountPreviewCard'

describe('AccountPreviewCard', () => {
  it('renders without crashing and shows the main heading', () => {
    const mockOnNavigate = jest.fn()
    render(<AccountPreviewCard onNavigate={mockOnNavigate} />)
    
    expect(screen.getByText('האזור שלי')).toBeInTheDocument()
  })

  it('renders all the three feature items', () => {
    const mockOnNavigate = jest.fn()
    render(<AccountPreviewCard onNavigate={mockOnNavigate} />)
    
    expect(screen.getByText('המעקבים שלי')).toBeInTheDocument()
    expect(screen.getByText('הוספת מוצר חדש')).toBeInTheDocument()
    expect(screen.getByText('הגדרות חשבון')).toBeInTheDocument()
  })

  it('clicking the call-to-action button triggers the onNavigate callback exactly once', () => {
    const mockOnNavigate = jest.fn()
    render(<AccountPreviewCard onNavigate={mockOnNavigate} />)
    
    const button = screen.getByText('למעבר לאזור האישי')
    fireEvent.click(button)
    
    expect(mockOnNavigate).toHaveBeenCalledTimes(1)
  })
})

