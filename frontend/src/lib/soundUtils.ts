/**
 * Utility functions to safely play notification sounds
 * Handles browser autoplay policies and audio context restrictions
 */

let audioContext: AudioContext | null = null;

export const initAudioContext = async () => {
  if (!audioContext) {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
    } catch (error) {
      console.warn("AudioContext not available:", error);
    }
  }
  return audioContext;
};

/**
 * Play a notification sound safely
 * Respects browser autoplay policies and user preferences
 */
export const playNotificationSound = async (soundUrl?: string) => {
  try {
    // Don't play if user prefers no sound notifications
    const userPreference = localStorage.getItem("soundNotificationsEnabled");
    if (userPreference === "false") {
      return;
    }

    // Use default sound or provided sound URL
    const url = soundUrl || "/sounds/notification.mp3";

    // Create audio element with proper attributes
    const audio = new Audio(url);
    audio.volume = 0.5; // Set reasonable volume

    // Resume audio context if needed (fixes autoplay policy issues)
    const context = await initAudioContext();
    if (context && context.state === "suspended") {
      await context.resume();
    }

    // Attempt to play with error handling
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (error.name === "NotAllowedError") {
          console.debug(
            "Audio playback not allowed by browser autoplay policy",
          );
        } else if (error.name === "NotSupportedError") {
          console.debug("Audio format not supported");
        } else {
          console.warn("Error playing notification sound:", error);
        }
      });
    }
  } catch (error) {
    console.warn("Failed to play notification sound:", error);
  }
};

/**
 * Set user preference for notification sounds
 */
export const setSoundNotificationsEnabled = (enabled: boolean) => {
  localStorage.setItem("soundNotificationsEnabled", String(enabled));
};

/**
 * Get user preference for notification sounds
 */
export const areSoundNotificationsEnabled = (): boolean => {
  const preference = localStorage.getItem("soundNotificationsEnabled");
  return preference !== "false"; // Default to true
};
