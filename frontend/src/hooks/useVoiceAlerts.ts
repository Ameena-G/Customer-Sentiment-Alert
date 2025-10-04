import { useRef } from 'react'

interface VoiceAlertsOptions {
  enabled: boolean
  onlyHighSeverity?: boolean
}

export function useVoiceAlerts(options: VoiceAlertsOptions) {
  const { enabled, onlyHighSeverity = true } = options
  const hasSpokenRef = useRef(new Set<number>())

  const speak = (text: string) => {
    if (!enabled || !('speechSynthesis' in window)) {
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Small delay to ensure cancel completes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9 // Slower for clarity
      utterance.pitch = 1.0
      utterance.volume = 1.0 // Full volume
      utterance.lang = 'en-US'

      // Use a more authoritative voice if available
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang === 'en-US'
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      // Handle speech interruption
      utterance.onend = () => {
        // Speech completed successfully
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
      }

      window.speechSynthesis.speak(utterance)
    }, 100)
  }

  const announceAlert = (severity: string, alertId: number) => {
    // Don't announce the same alert twice
    if (hasSpokenRef.current.has(alertId)) {
      return
    }

    hasSpokenRef.current.add(alertId)

    // Clean up old IDs to prevent memory leak
    if (hasSpokenRef.current.size > 100) {
      const idsArray = Array.from(hasSpokenRef.current)
      hasSpokenRef.current = new Set(idsArray.slice(-50))
    }

    let message = ''
    
    switch (severity.toLowerCase()) {
      case 'critical':
        message = 'Critical alert detected! Immediate action required.'
        break
      case 'high':
        message = 'High priority alert detected.'
        break
      case 'medium':
        if (!onlyHighSeverity) {
          message = 'Medium priority alert.'
        }
        break
      case 'low':
        if (!onlyHighSeverity) {
          message = 'New alert detected.'
        }
        break
    }

    if (message) {
      speak(message)
    }
  }

  const testVoice = () => {
    speak('Voice alerts are now enabled. You will be notified of critical sentiment.')
  }

  return { announceAlert, testVoice, speak }
}
