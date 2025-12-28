import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InlineInputs } from '../InlineInputs'

describe('InlineInputs', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('submits form with correct values when user fills all inputs', async () => {
    const user = userEvent.setup()
    
    const inputs = [
      {
        id: 'name',
        type: 'text' as const,
        placeholder: 'Your name',
      },
      {
        id: 'phone',
        type: 'tel' as const,
        placeholder: 'Phone',
      },
      {
        id: 'agree',
        type: 'checkbox' as const,
        label: 'I agree',
      },
    ]

    render(<InlineInputs inputs={inputs} onSubmit={mockOnSubmit} />)

    // Find and fill the name input
    const nameInput = screen.getByPlaceholderText('Your name')
    await user.type(nameInput, 'Alice')

    // Find and fill the phone input
    const phoneInput = screen.getByPlaceholderText('Phone')
    await user.type(phoneInput, '0501234567')

    // Find and check the checkbox
    const checkbox = screen.getByLabelText('I agree')
    await user.click(checkbox)

    // Find and click the submit button
    const submitButton = screen.getByRole('button', { name: /המשך/ })
    await user.click(submitButton)

    // Assert onSubmit was called with correct values
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Alice',
      phone: '0501234567',
      agree: true,
    })
  })
})

