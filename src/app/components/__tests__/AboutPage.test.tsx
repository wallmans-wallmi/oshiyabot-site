import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AboutPage } from '../AboutPage'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />
  },
}))

describe('AboutPage', () => {
  const mockOnNavigateToWhat = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the avatar and key text', () => {
    render(<AboutPage onNavigateToWhat={mockOnNavigateToWhat} />)

    // Check avatar is rendered with correct alt text
    const avatar = screen.getByAltText('רעות - מייסדת Oshiya')
    expect(avatar).toBeInTheDocument()

    // Check key Hebrew text is present
    expect(screen.getByText(/מי אני/)).toBeInTheDocument()
    expect(screen.getByText(/היי! אני רעות/)).toBeInTheDocument()
    expect(screen.getByText(/מכורה לקניות/)).toBeInTheDocument()
  })

  it('calls onNavigateToWhat when "מה אני" button is clicked', async () => {
    const user = userEvent.setup()
    render(<AboutPage onNavigateToWhat={mockOnNavigateToWhat} />)

    // Find and click the "מה אני" button
    const whatButton = screen.getByRole('button', { name: /מה אני/ })
    await user.click(whatButton)

    expect(mockOnNavigateToWhat).toHaveBeenCalledTimes(1)
  })

  it('shows and triggers onClose when not in desktop mode', async () => {
    const user = userEvent.setup()
    render(<AboutPage onNavigateToWhat={mockOnNavigateToWhat} onClose={mockOnClose} isDesktop={false} />)

    // Check close button is visible with correct aria-label
    const closeButton = screen.getByRole('button', { name: /סגור/ })
    expect(closeButton).toBeInTheDocument()

    // Click the close button
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('ensures close button is hidden on desktop mode', () => {
    render(<AboutPage onNavigateToWhat={mockOnNavigateToWhat} onClose={mockOnClose} isDesktop={true} />)

    // Close button should not be present when isDesktop is true
    const closeButton = screen.queryByRole('button', { name: /סגור/ })
    expect(closeButton).not.toBeInTheDocument()

    // "מה אני" button should still be present
    const whatButton = screen.getByRole('button', { name: /מה אני/ })
    expect(whatButton).toBeInTheDocument()
  })
})

