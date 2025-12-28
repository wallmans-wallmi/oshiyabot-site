import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatInterface } from '../ChatInterface'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />
  },
}))

describe('ChatInterface', () => {
  const mockProps = {
    messages: [],
    isTyping: false,
    message: '',
    setMessage: jest.fn(),
    handleSend: jest.fn(),
    handleImageUpload: jest.fn(),
    uploadedImage: null,
    setUploadedImage: jest.fn(),
    handleQuickReply: jest.fn(),
    conversationState: {
      path: 'initial',
      step: 0,
      productData: {}
    },
    isLoggedIn: false,
    onLoginClick: jest.fn(),
    onAccountClick: jest.fn(),
    activeTab: 'chat',
    hasDeals: false,
    unreadDealsCount: 0,
    onDealsClick: jest.fn(),
    onNavigateToPage: jest.fn(),
    isDesktop: false
  }

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    jest.clearAllMocks()
  })

  it('renders user and assistant messages correctly', () => {
    const messages = [
      {
        id: 1,
        type: 'user' as const,
        content: 'Hello',
        timestamp: new Date(),
      },
      {
        id: 2,
        type: 'assistant' as const,
        content: 'Hi there',
        timestamp: new Date(),
      },
    ]

    render(<ChatInterface {...mockProps} messages={messages} />)

    // Use flexible text matching in case text nodes are split
    expect(screen.getByText(/Hello/)).toBeInTheDocument()
    expect(screen.getByText(/Hi there/)).toBeInTheDocument()
    
    // Also verify message containers exist
    expect(screen.getByTestId('message-1')).toBeInTheDocument()
    expect(screen.getByTestId('message-2')).toBeInTheDocument()
  })

  it('displays typing indicator when isTyping is true', () => {
    render(<ChatInterface {...mockProps} isTyping={true} />)

    const typingIndicator = screen.getByTestId('typing-indicator')
    expect(typingIndicator).toBeInTheDocument()
    // Use flexible text matching for Hebrew text
    expect(screen.getByText(/אושייה כותבת/)).toBeInTheDocument()
  })

  it('renders message input with correct placeholder', () => {
    render(<ChatInterface {...mockProps} />)

    const input = screen.getByPlaceholderText('כתבי כאן...')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('sends message on button click', async () => {
    const user = userEvent.setup()
    render(<ChatInterface {...mockProps} message="Test message" />)

    const sendButton = screen.getByTestId('send-button') as HTMLButtonElement
    // When message has content, button should be enabled
    expect(sendButton.disabled).toBe(false)
    
    await user.click(sendButton)
    expect(mockProps.handleSend).toHaveBeenCalledTimes(1)
  })

  it('calls handleImageUpload when uploading a file', () => {
    render(<ChatInterface {...mockProps} />)

    // File input is hidden, use test ID to find it
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput.type).toBe('file')
    
    const file = new File(['test content'], 'test.png', { type: 'image/png' })
    
    // Simulate file selection by firing change event with files
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(mockProps.handleImageUpload).toHaveBeenCalledTimes(1)
    expect(mockProps.handleImageUpload).toHaveBeenCalledWith(expect.any(File))
    expect(mockProps.handleImageUpload).toHaveBeenCalledWith(file)
  })

  it('clicking a quick reply triggers handleQuickReply', async () => {
    const user = userEvent.setup()
    const messagesWithQuickReplies = [
      {
        id: 1,
        type: 'assistant' as const,
        content: 'היי, איך אפשר לעזור?',
        timestamp: new Date(),
        quickReplies: [
          { label: 'חפש לי מוצר', value: 'חפש לי מוצר' },
          { label: 'אני רוצה לעקוב', value: 'אני רוצה לעקוב' }
        ]
      }
    ]

    render(<ChatInterface {...mockProps} messages={messagesWithQuickReplies} />)

    // Verify quick reply buttons are present using common test ID
    const quickReplyButtons = screen.getAllByTestId('quick-reply-button')
    expect(quickReplyButtons).toHaveLength(2)
    
    // Verify the buttons have the correct labels
    expect(screen.getByText(/חפש לי מוצר/)).toBeInTheDocument()
    expect(screen.getByText(/אני רוצה לעקוב/)).toBeInTheDocument()
    
    // Find the specific button by text content and click it
    const quickReplyButton = screen.getByRole('button', { name: /חפש לי מוצר/ })
    await user.click(quickReplyButton)

    expect(mockProps.handleQuickReply).toHaveBeenCalledTimes(1)
    expect(mockProps.handleQuickReply).toHaveBeenCalledWith('חפש לי מוצר')
  })

  it('when uploadedImage is provided, it is displayed with delete button', async () => {
    const user = userEvent.setup()
    render(<ChatInterface {...mockProps} uploadedImage="/some/path.jpg" />)

    // Verify image container is rendered
    const imageContainer = screen.getByTestId('uploaded-image-container')
    expect(imageContainer).toBeInTheDocument()
    
    // Verify image is displayed (mocked Next.js Image renders as img)
    const image = screen.getByAltText('To upload') as HTMLImageElement
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/some/path.jpg')

    // Verify delete button exists and clicking it calls the handler
    const deleteButton = screen.getByTestId('delete-uploaded-image')
    expect(deleteButton).toBeInTheDocument()
    
    await user.click(deleteButton)

    expect(mockProps.setUploadedImage).toHaveBeenCalledTimes(1)
    expect(mockProps.setUploadedImage).toHaveBeenCalledWith(null)
  })
})
