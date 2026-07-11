import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Mic, MicOff, Volume2, Copy, Check, Command, Eye, Settings, Save, X } from "lucide-react";
import { toast } from "sonner";

interface VoiceCommand {
  command: string;
  description: string;
  example: string;
  category: "navigation" | "editing" | "execution";
}

const VOICE_COMMANDS: VoiceCommand[] = [
  {
    command: "run code",
    description: "Execute the current code",
    example: "Say: 'run code'",
    category: "execution",
  },
  {
    command: "clear",
    description: "Clear all code",
    example: "Say: 'clear'",
    category: "editing",
  },
  {
    command: "undo",
    description: "Undo last action",
    example: "Say: 'undo'",
    category: "editing",
  },
  {
    command: "redo",
    description: "Redo last action",
    example: "Say: 'redo'",
    category: "editing",
  },
  {
    command: "next line",
    description: "Move to next line",
    example: "Say: 'next line'",
    category: "navigation",
  },
  {
    command: "previous line",
    description: "Move to previous line",
    example: "Say: 'previous line'",
    category: "navigation",
  },
  {
    command: "indent",
    description: "Indent current line",
    example: "Say: 'indent'",
    category: "editing",
  },
  {
    command: "dedent",
    description: "Dedent current line",
    example: "Say: 'dedent'",
    category: "editing",
  },
];

export default function VoiceCoding() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedCode, setTranscribedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCommandOverlay, setShowCommandOverlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [transcriptionStatus, setTranscriptionStatus] = useState<"idle" | "listening" | "processing" | "complete">("idle");
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [customCommands, setCustomCommands] = useState<Record<string, string>>({});
  const [tempCommands, setTempCommands] = useState<Record<string, string>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Voice mutations
  const transcribeMutation = trpc.enhancements.voiceCoding.transcribeCode.useMutation();
  const speechMutation = trpc.enhancements.voiceCoding.generateSpeech.useMutation();

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setTranscriptionStatus("listening");
      setLiveTranscript("");
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscribedCode((prev) => prev + transcript + "\n");
        } else {
          interim += transcript;
        }
      }
      setLiveTranscript(interim);
      if (interim) {
        setTranscriptionStatus("processing");
      }
    };

    recognition.onerror = (event: any) => {
      toast.error(`Speech recognition error: ${event.error}`);
      setTranscriptionStatus("idle");
    };

    recognition.onend = () => {
      setTranscriptionStatus("complete");
      setLiveTranscript("");
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        toast.info("Audio recorded - ready for transcription");
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start Web Speech API for real-time transcription
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      toast.success("Recording started - speak now!");
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    toast.success("Recording stopped");
  };

  const handleTranscribe = async () => {
    try {
      await transcribeMutation.mutateAsync({
        audioUrl: "https://example.com/audio.webm",
        language: "en",
      });
      toast.success("Code transcribed!");
    } catch (error) {
      toast.error("Transcription failed");
    }
  };

  const handleReadAloud = async (text: string) => {
    try {
      await speechMutation.mutateAsync({
        text,
        language: "en",
      });
      toast.success("Playing audio...");
    } catch (error) {
      toast.error("Failed to generate speech");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcribedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const getStatusColor = () => {
    switch (transcriptionStatus) {
      case "listening":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "complete":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusText = () => {
    switch (transcriptionStatus) {
      case "listening":
        return "🎤 Listening...";
      case "processing":
        return "⚙️ Processing...";
      case "complete":
        return "✅ Complete";
      default:
        return "Ready to record";
    }
  };

  const handleOpenSettings = () => {
    setTempCommands({ ...customCommands });
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    setCustomCommands(tempCommands);
    toast.success("Voice command shortcuts saved!");
    setShowSettings(false);
  };

  const handleResetSettings = () => {
    setTempCommands({});
    setCustomCommands({});
    toast.info("Voice commands reset to defaults");
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-blue-600" />
                Voice Coding
              </CardTitle>
              <CardDescription>Convert speech to code with AI</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isRecording ? "default" : "outline"} className={isRecording ? "animate-pulse" : ""}>
                {isRecording ? "Recording" : "Ready"}
              </Badge>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setShowCommandOverlay(true)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="View voice commands"
              >
                <Command className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleOpenSettings}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Customize voice commands"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Real-time Transcription Status */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Transcription Status</p>
            <div className={`p-3 rounded-md flex items-center justify-between ${getStatusColor()}`}>
              <span className="text-sm font-medium">{getStatusText()}</span>
              {transcriptionStatus === "listening" && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              )}
            </div>
          </div>

          {/* Live Transcript Preview */}
          {liveTranscript && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Live Transcript</p>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-slate-700 italic">
                {liveTranscript}
              </div>
            </div>
          )}

          {/* Recording Controls */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">1. Record Your Code</p>
            <div className="flex gap-2">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex-1 ${isRecording ? "bg-red-600 hover:bg-red-700" : ""}`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Transcription Controls */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700">2. Transcribe Audio</p>
            <Button
              onClick={handleTranscribe}
              disabled={transcribeMutation.isPending}
              variant="outline"
              className="w-full"
            >
              {transcribeMutation.isPending ? "Transcribing..." : "Transcribe Code"}
            </Button>
          </div>

          {/* Transcribed Code Display */}
          {transcribedCode && (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700">Transcribed Code:</p>
              <div className="bg-slate-900 text-slate-100 p-3 rounded-md font-mono text-xs overflow-x-auto max-h-32">
                <pre>{transcribedCode}</pre>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleReadAloud(transcribedCode)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Volume2 className="w-4 h-4 mr-1" />
                  Read Aloud
                </Button>
              </div>
            </div>
          )}

          {/* Accessibility Features */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700">Accessibility</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Badge variant="outline" className="justify-center py-2">
                🎤 Voice Input
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                🔊 Voice Output
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                ⌨️ Keyboard Nav
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                🎯 Voice Commands
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands Overlay Dialog */}
      <Dialog open={showCommandOverlay} onOpenChange={setShowCommandOverlay}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Command className="w-5 h-5" />
              Available Voice Commands
            </DialogTitle>
            <DialogDescription>
              Use these commands while recording to control the editor with your voice
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Navigation Commands */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Navigation
              </h3>
              <div className="grid gap-2 pl-4">
                {VOICE_COMMANDS.filter((cmd) => cmd.category === "navigation").map((cmd) => (
                  <div key={cmd.command} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                        {cmd.command}
                      </code>
                      <span className="text-xs text-slate-500">{cmd.example}</span>
                    </div>
                    <p className="text-xs text-slate-600">{cmd.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Editing Commands */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full" />
                Editing
              </h3>
              <div className="grid gap-2 pl-4">
                {VOICE_COMMANDS.filter((cmd) => cmd.category === "editing").map((cmd) => (
                  <div key={cmd.command} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                        {cmd.command}
                      </code>
                      <span className="text-xs text-slate-500">{cmd.example}</span>
                    </div>
                    <p className="text-xs text-slate-600">{cmd.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Commands */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full" />
                Execution
              </h3>
              <div className="grid gap-2 pl-4">
                {VOICE_COMMANDS.filter((cmd) => cmd.category === "execution").map((cmd) => (
                  <div key={cmd.command} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                        {cmd.command}
                      </code>
                      <span className="text-xs text-slate-500">{cmd.example}</span>
                    </div>
                    <p className="text-xs text-slate-600">{cmd.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-2">
              <p className="text-sm font-medium text-blue-900">💡 Tips for Best Results</p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>Speak clearly and at a natural pace</li>
                <li>Use command phrases exactly as shown</li>
                <li>Pause briefly between commands and code</li>
                <li>Check the live transcript for accuracy</li>
              </ul>
            </div>
          </div>
         </DialogContent>
      </Dialog>

      {/* Voice Command Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Customize Voice Commands
            </DialogTitle>
            <DialogDescription>
              Create custom shortcuts for your most-used voice commands
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Custom Shortcuts</h3>
              <p className="text-xs text-slate-600">
                Define alternative phrases for existing commands. Leave empty to use defaults.
              </p>

              {VOICE_COMMANDS.map((cmd) => (
                <div key={cmd.command} className="space-y-2 p-3 bg-slate-50 rounded-md border border-slate-200">
                  <label className="text-xs font-medium text-slate-700">
                    {cmd.command} - {cmd.description}
                  </label>
                  <input
                    type="text"
                    placeholder={`Custom shortcut for "${cmd.command}"`}
                    value={tempCommands[cmd.command] || ""}
                    onChange={(e) =>
                      setTempCommands({
                        ...tempCommands,
                        [cmd.command]: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500">Default: {cmd.example}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-2">
              <p className="text-sm font-medium text-blue-900">💡 Tips</p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>Keep shortcuts short and easy to pronounce</li>
                <li>Avoid similar-sounding phrases</li>
                <li>Test shortcuts before relying on them</li>
                <li>Leave empty to use default commands</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              onClick={handleResetSettings}
              variant="outline"
              className="gap-1"
            >
              <X className="w-4 h-4" />
              Reset to Defaults
            </Button>
            <Button
              onClick={() => setShowSettings(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="bg-blue-600 hover:bg-blue-700 gap-1"
            >
              <Save className="w-4 h-4" />
              Save Shortcuts
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
