import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageUploaderBox } from '../ImageUploaderBox'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />
  },
}))

interface MockFileReaderInstance {
  readAsDataURL: jest.Mock
  result: string
  onloadend: (() => void) | null
  readyState: number
  error: Error | null
  lastFile?: File
}

describe('ImageUploaderBox', () => {
  let mockOnImageUpload: jest.Mock
  let mockOnImageRemove: jest.Mock
  let FileReaderConstructor: jest.Mock<MockFileReaderInstance>

  beforeEach(() => {
    mockOnImageUpload = jest.fn()
    mockOnImageRemove = jest.fn()

    // Mock FileReader constructor - create a new instance each time
    FileReaderConstructor = jest.fn(function(this: unknown) {
      const instance: MockFileReaderInstance = {
        readAsDataURL: jest.fn(function(file: File) {
          // Store the file for verification
          instance.lastFile = file
          // Simulate async behavior by calling onloadend in next tick
          setTimeout(() => {
            instance.result = 'data:image/png;base64,mockPreviewData'
            instance.readyState = 2 // DONE
            if (instance.onloadend) {
              instance.onloadend()
            }
          }, 0)
        }),
        result: '',
        onloadend: null,
        readyState: 0, // EMPTY
        error: null,
      }
      return instance
    }) as jest.Mock<MockFileReaderInstance>

    global.FileReader = FileReaderConstructor as unknown as typeof FileReader

    // Add static properties to FileReader mock
    ;(global.FileReader as unknown as { EMPTY: number; LOADING: number; DONE: number }).EMPTY = 0
    ;(global.FileReader as unknown as { EMPTY: number; LOADING: number; DONE: number }).LOADING = 1
    ;(global.FileReader as unknown as { EMPTY: number; LOADING: number; DONE: number }).DONE = 2

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const createMockFile = (name: string, type: string, size: number): File => {
    const file = new File(['test content'], name, { type })
    Object.defineProperty(file, 'size', {
      writable: false,
      value: size,
    })
    return file
  }

  it('renders correctly in its empty state (no preview)', () => {
    render(<ImageUploaderBox />)

    expect(screen.getByText(/העלאת תמונה או הדבקה/)).toBeInTheDocument()
    expect(screen.getByText(/גררו תמונה לכאן/)).toBeInTheDocument()
    expect(screen.getByText(/לחצו להעלאה/)).toBeInTheDocument()
    expect(screen.getByText(/הדביקו תמונה מהלוח/)).toBeInTheDocument()
  })

  it('clicking the upload area triggers the hidden file input click', () => {
    const fileInputClick = jest.fn()
    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} />)

    const uploadArea = screen.getByRole('button', { name: /העלאת תמונה/ })
    const fileInput = uploadArea.querySelector('input[type="file"]') as HTMLInputElement

    if (fileInput) {
      fileInput.click = fileInputClick
      fireEvent.click(uploadArea)
      expect(fileInputClick).toHaveBeenCalledTimes(1)
    }
  })

  it('uploading a valid image file calls the onImageUpload callback with the file and preview data', async () => {
    const validFile = createMockFile('test.png', 'image/png', 1024 * 1024) // 1MB

    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} />)

    const fileInput = screen.getByRole('button', { name: /העלאת תמונה/ }).querySelector('input[type="file"]') as HTMLInputElement

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [validFile] } })

      await waitFor(() => {
        expect(FileReaderConstructor).toHaveBeenCalled()
        const lastResult = FileReaderConstructor.mock.results[FileReaderConstructor.mock.results.length - 1]
        const fileReaderInstance = lastResult?.value as MockFileReaderInstance | undefined
        expect(fileReaderInstance?.readAsDataURL).toHaveBeenCalledWith(validFile)
      })

      // Wait for FileReader to complete and state update
      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalledWith(validFile, 'data:image/png;base64,mockPreviewData')
      }, { timeout: 1000 })
    }
  })

  it('uploading an unsupported file type shows the correct error message and does not call onImageUpload', async () => {
    const invalidFile = createMockFile('test.pdf', 'application/pdf', 1024 * 1024)

    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} />)

    const fileInput = screen.getByRole('button', { name: /העלאת תמונה/ }).querySelector('input[type="file"]') as HTMLInputElement

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      await waitFor(() => {
        expect(screen.getByText(/סוג קובץ לא נתמך/)).toBeInTheDocument()
      })

      expect(mockOnImageUpload).not.toHaveBeenCalled()
      expect(FileReaderConstructor).not.toHaveBeenCalled()
    }
  })

  it('uploading a file that exceeds the maxSizeMB shows the correct error message', async () => {
    const largeFile = createMockFile('test.png', 'image/png', 11 * 1024 * 1024) // 11MB

    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} maxSizeMB={10} />)

    const fileInput = screen.getByRole('button', { name: /העלאת תמונה/ }).querySelector('input[type="file"]') as HTMLInputElement

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [largeFile] } })

      await waitFor(() => {
        expect(screen.getByText(/הקובץ גדול מדי/)).toBeInTheDocument()
        expect(screen.getByText(/גודל מקסימלי: 10MB/)).toBeInTheDocument()
      })

      expect(mockOnImageUpload).not.toHaveBeenCalled()
      expect(FileReaderConstructor).not.toHaveBeenCalled()
    }
  })

  it('clicking the remove button clears the preview and calls onImageRemove', async () => {
    const validFile = createMockFile('test.png', 'image/png', 1024 * 1024)

    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} onImageRemove={mockOnImageRemove} />)

    const fileInput = screen.getByRole('button', { name: /העלאת תמונה/ }).querySelector('input[type="file"]') as HTMLInputElement

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [validFile] } })

      await waitFor(() => {
        expect(screen.getByAltText('תצוגה מקדימה')).toBeInTheDocument()
      }, { timeout: 1000 })

      const removeButton = screen.getByRole('button', { name: /הסר תמונה/ })
      fireEvent.click(removeButton)

      await waitFor(() => {
        expect(mockOnImageRemove).toHaveBeenCalledTimes(1)
      })

      expect(screen.queryByAltText('תצוגה מקדימה')).not.toBeInTheDocument()
      expect(screen.getByText(/העלאת תמונה או הדבקה/)).toBeInTheDocument()
    }
  })

  it('pasting an image from the clipboard uploads it correctly if valid', async () => {
    const validFile = createMockFile('test.png', 'image/png', 1024 * 1024)

    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} />)

    const uploadArea = screen.getByRole('button', { name: /העלאת תמונה/ })

    // Mock clipboardData.items
    const mockClipboardItem = {
      type: 'image/png',
      getAsFile: jest.fn(() => validFile),
    }

    const mockClipboardData = {
      items: [mockClipboardItem],
    }

    fireEvent.paste(uploadArea, {
      clipboardData: mockClipboardData as unknown as DataTransfer,
    })

    await waitFor(() => {
      expect(FileReaderConstructor).toHaveBeenCalled()
      const lastResult = FileReaderConstructor.mock.results[FileReaderConstructor.mock.results.length - 1]
      const fileReaderInstance = lastResult?.value as MockFileReaderInstance | undefined
      expect(fileReaderInstance?.readAsDataURL).toHaveBeenCalledWith(validFile)
    })

    await waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith(validFile, 'data:image/png;base64,mockPreviewData')
    }, { timeout: 1000 })
  })

  it('drag-and-drop behavior uploads the image correctly when a valid image file is dropped', async () => {
    const validFile = createMockFile('test.png', 'image/png', 1024 * 1024)

    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} />)

    const uploadArea = screen.getByRole('button', { name: /העלאת תמונה/ })

    // Simulate drag and drop
    fireEvent.dragEnter(uploadArea, {
      dataTransfer: {
        files: [validFile],
      } as unknown as DataTransfer,
    })

    fireEvent.dragOver(uploadArea, {
      dataTransfer: {
        files: [validFile],
      } as unknown as DataTransfer,
    })

    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [validFile],
      } as unknown as DataTransfer,
    })

    await waitFor(() => {
      expect(FileReaderConstructor).toHaveBeenCalled()
      const lastResult = FileReaderConstructor.mock.results[FileReaderConstructor.mock.results.length - 1]
      const fileReaderInstance = lastResult?.value as MockFileReaderInstance | undefined
      expect(fileReaderInstance?.readAsDataURL).toHaveBeenCalledWith(validFile)
    })

    await waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith(validFile, 'data:image/png;base64,mockPreviewData')
    }, { timeout: 1000 })
  })

  it('does not allow upload when disabled', () => {
    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} disabled={true} />)

    const uploadArea = screen.getByRole('button', { name: /העלאת תמונה/ })
    const fileInput = uploadArea.querySelector('input[type="file"]') as HTMLInputElement

    expect(fileInput?.disabled).toBe(true)
    expect(uploadArea).toHaveAttribute('tabIndex', '-1')
  })

  it('does not trigger file input click when preview exists', () => {
    const fileInputClick = jest.fn()
    render(<ImageUploaderBox onImageUpload={mockOnImageUpload} initialPreview="data:image/png;base64,test" />)

    const uploadArea = screen.getByRole('button', { name: /העלאת תמונה/ })
    const fileInput = uploadArea.querySelector('input[type="file"]') as HTMLInputElement

    if (fileInput) {
      fileInput.click = fileInputClick
      fireEvent.click(uploadArea)
      expect(fileInputClick).not.toHaveBeenCalled()
    }
  })
})

