import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Loader2, Play, StopCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface TextToSpeechProps {
  text?: string;
  onAudioGenerated?: (audioData: string) => void;
  readOnly?: boolean;
}

export function TextToSpeech({ text: initialText, onAudioGenerated, readOnly = false }: TextToSpeechProps) {
  const [text, setText] = useState(initialText || "");
  const [format, setFormat] = useState<"mp3" | "wav" | "pcm">("mp3");
  const [speed, setSpeed] = useState([1.0]);
  const [pitch, setPitch] = useState([1.0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const generateMutation = trpc.tts.generate.useMutation({
    onSuccess: (data) => {
      if (onAudioGenerated) {
        onAudioGenerated(data.audioData);
      }
      playAudio(data.audioData);
    },
  });

  const playAudio = (audioData: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(audioData);
    audio.onended = () => {
      setIsPlaying(false);
    };
    audio.onerror = () => {
      setIsPlaying(false);
      console.error("Audio playback failed");
    };
    
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleGenerate = () => {
    if (!text.trim()) return;
    
    stopAudio();
    generateMutation.mutate({
      text,
      format,
      speed: speed[0],
      pitch: pitch[0],
    });
  };

  const handleStop = () => {
    stopAudio();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Text to Speech
        </CardTitle>
        <CardDescription>
          Convert text to natural-sounding speech using Fish Audio AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tts-text">Text</Label>
          <Textarea
            id="tts-text"
            placeholder="Enter text to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            readOnly={readOnly}
            rows={4}
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tts-format">Format</Label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger id="tts-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="wav">WAV</SelectItem>
                <SelectItem value="pcm">PCM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tts-speed">Speed: {speed[0].toFixed(1)}x</Label>
            <Slider
              id="tts-speed"
              min={0.5}
              max={2.0}
              step={0.1}
              value={speed}
              onValueChange={setSpeed}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tts-pitch">Pitch: {pitch[0].toFixed(1)}x</Label>
            <Slider
              id="tts-pitch"
              min={0.5}
              max={2.0}
              step={0.1}
              value={pitch}
              onValueChange={setPitch}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={!text.trim() || generateMutation.isPending}
            className="flex-1"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generate Speech
              </>
            )}
          </Button>

          {isPlaying && (
            <Button onClick={handleStop} variant="outline">
              <StopCircle className="mr-2 h-4 w-4" />
              Stop
            </Button>
          )}
        </div>

        {generateMutation.error && (
          <div className="text-sm text-destructive">
            Failed to generate speech: {generateMutation.error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
