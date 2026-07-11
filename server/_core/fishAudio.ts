import { ENV } from "./env";

/**
 * Fish Audio TTS API integration
 * Uses the free S2.1 Pro model for text-to-speech generation
 * Documentation: https://docs.fish.audio/api-reference/introduction
 */

export interface FishAudioTTSOptions {
  text: string;
  referenceId?: string;
  format?: "mp3" | "wav" | "pcm";
  speed?: number;
  pitch?: number;
}

export interface FishAudioTTSResponse {
  audioBuffer: Buffer;
  format: string;
}

/**
 * Generate speech from text using Fish Audio's free S2.1 Pro model
 * 
 * @param options - TTS configuration options
 * @returns Promise with audio buffer and format
 * 
 * @example
 * const { audioBuffer, format } = await generateSpeech({
 *   text: "Hello, world!",
 *   referenceId: "your_model_id",
 *   format: "mp3"
 * });
 */
export async function generateSpeech(
  options: FishAudioTTSOptions
): Promise<FishAudioTTSResponse> {
  const {
    text,
    referenceId,
    format = "mp3",
    speed = 1.0,
    pitch = 1.0,
  } = options;

  if (!ENV.fishAudioApiKey) {
    throw new Error("Fish Audio API key is not configured. Set FISH_AUDIO_API_KEY environment variable.");
  }

  if (!text || text.trim().length === 0) {
    throw new Error("Text is required for TTS generation");
  }

  const body = {
    text,
    reference_id: referenceId,
    format,
    speed,
    pitch,
  };

  try {
    const response = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.fishAudioApiKey}`,
        "Content-Type": "application/json",
        model: "s2.1-pro-free",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fish Audio API request failed: ${response.status} ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    return {
      audioBuffer,
      format,
    };
  } catch (error) {
    console.error("[Fish Audio] TTS generation failed:", error);
    throw error;
  }
}

/**
 * Generate speech and upload to storage
 * 
 * @param options - TTS configuration options
 * @param key - Storage key for the audio file
 * @returns Promise with storage URL
 * 
 * @example
 * const url = await generateSpeechAndStore({
 *   text: "Welcome to our platform",
 *   format: "mp3"
 * }, "welcome-message.mp3");
 */
export async function generateSpeechAndStore(
  options: FishAudioTTSOptions,
  key: string
): Promise<string> {
  const { storagePut } = await import("../storage");
  
  const { audioBuffer, format } = await generateSpeech(options);
  const mimeType = `audio/${format}`;
  
  const { url } = await storagePut(key, audioBuffer, mimeType);
  
  return url;
}
