
import { useEffect, useRef, useState } from 'react';

export function useKitchenSounds() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification sounds
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    
    // Use a simple beep sound data URL
    audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBy+P2O7PdykDN3nE9OGTQQwKRLDh68xlHA';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playReadyAlert = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.warn('Could not play sound:', error);
      });
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return {
    soundEnabled,
    toggleSound,
    playReadyAlert
  };
}
