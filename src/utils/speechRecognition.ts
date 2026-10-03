/**
 * Web Speech Recognition helper for Voice-to-Task input.
 * Supports both Bengali ('bn-BD') and English ('en-US').
 */

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: unknown) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function startVoiceListening(
  onTranscript: (text: string) => void,
  onStateChange: (isListening: boolean) => void,
  lang: 'bn-BD' | 'en-US' = 'bn-BD'
): () => void {
  if (!isSpeechRecognitionSupported()) {
    onStateChange(false);
    return () => {};
  }

  const SpeechRec = (window as unknown as { SpeechRecognition: new () => SpeechRecognitionInstance }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

  try {
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onstart = () => {
      onStateChange(true);
    };

    recognition.onend = () => {
      onStateChange(false);
    };

    recognition.onerror = () => {
      onStateChange(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript.trim();
        if (transcript) {
          onTranscript(transcript);
        }
      }
      onStateChange(false);
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  } catch (e) {
    console.error('Failed to start speech recognition', e);
    onStateChange(false);
    return () => {};
  }
}
