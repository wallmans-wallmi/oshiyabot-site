import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OTPVerification } from '../OTPVerification'

describe('OTPVerification', () => {
  const mockOnVerify = jest.fn()
  const mockOnResend = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all 6 input boxes and the masked phone number properly', () => {
    render(
      <OTPVerification
        phoneNumber="0501234567"
        onClose={mockOnClose}
        onVerify={mockOnVerify}
        onResend={mockOnResend}
      />
    )

    // Check all 6 inputs are rendered
    expect(screen.getByLabelText('Digit 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Digit 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Digit 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Digit 4')).toBeInTheDocument()
    expect(screen.getByLabelText('Digit 5')).toBeInTheDocument()
    expect(screen.getByLabelText('Digit 6')).toBeInTheDocument()

    // Check masked phone number
    expect(screen.getByText(/050\*\*\*4567/)).toBeInTheDocument()
  })

  it('typing a digit into the first input moves focus to the next input', async () => {
    const user = userEvent.setup()
    render(
      <OTPVerification
        phoneNumber="0501234567"
        onClose={mockOnClose}
        onVerify={mockOnVerify}
        onResend={mockOnResend}
      />
    )

    const firstInput = screen.getByLabelText('Digit 1')
    const secondInput = screen.getByLabelText('Digit 2')

    await user.type(firstInput, '1')

    expect(secondInput).toHaveFocus()
  })

  it('typing 6 digits in a row triggers onVerify with the full code', async () => {
    const user = userEvent.setup()
    render(
      <OTPVerification
        phoneNumber="0501234567"
        onClose={mockOnClose}
        onVerify={mockOnVerify}
        onResend={mockOnResend}
      />
    )

    const inputs = [
      screen.getByLabelText('Digit 1'),
      screen.getByLabelText('Digit 2'),
      screen.getByLabelText('Digit 3'),
      screen.getByLabelText('Digit 4'),
      screen.getByLabelText('Digit 5'),
      screen.getByLabelText('Digit 6'),
    ]

    // Type each digit sequentially
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], String(i + 1))
    }

    expect(mockOnVerify).toHaveBeenCalledTimes(1)
    expect(mockOnVerify).toHaveBeenCalledWith('123456')
  })

  it('clicking the "לא קיבלתי קוד - שלחו שוב" button triggers onResend', async () => {
    const user = userEvent.setup()
    render(
      <OTPVerification
        phoneNumber="0501234567"
        onClose={mockOnClose}
        onVerify={mockOnVerify}
        onResend={mockOnResend}
      />
    )

    const resendButton = screen.getByText('לא קיבלתי קוד - שלחו שוב')
    await user.click(resendButton)

    expect(mockOnResend).toHaveBeenCalledTimes(1)
  })

  it('clicking the close (X) button triggers onClose', async () => {
    const user = userEvent.setup()
    render(
      <OTPVerification
        phoneNumber="0501234567"
        onClose={mockOnClose}
        onVerify={mockOnVerify}
        onResend={mockOnResend}
      />
    )

    const closeButton = screen.getByLabelText('סגור')
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})

