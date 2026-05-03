import { describe, it, expect, vi } from 'vitest'
import { askElectionAI } from '../ai'

// Mock the AI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel = vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => 'Mocked AI Response'
          }
        })
      })
    }
  }
})

describe('askElectionAI', () => {
  const mockContext = {
    name: 'Test User',
    age: 25,
    registered: true,
    currentState: 'Voter Verification'
  }

  it('should return a response from the AI model', async () => {
    const response = await askElectionAI(mockContext, 'How do I vote?')
    expect(response).toBe('Mocked AI Response')
  })
})
