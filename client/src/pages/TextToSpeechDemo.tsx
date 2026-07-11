import { TextToSpeech } from "@/components/TextToSpeech";

export default function TextToSpeechDemo() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Text-to-Speech Demo</h1>
          <p className="text-muted-foreground">
            Experience our AI-powered text-to-speech using Fish Audio's free S2.1 Pro model
          </p>
        </div>

        <TextToSpeech />

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">About Fish Audio S2.1 Pro</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Most expressive, emotionally controllable real-time voice model</li>
            <li>• Supports multiple languages with native-level quality</li>
            <li>• Free API access available until July 2026</li>
            <li>• Perfect for educational content, audiobooks, and voiceovers</li>
            <li>• Adjustable speed and pitch for customized output</li>
          </ul>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Use Cases in Education</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Convert lesson content to audio for accessibility</li>
            <li>• Create audio versions of course materials</li>
            <li>• Generate voiceovers for video tutorials</li>
            <li>• Provide audio feedback on student submissions</li>
            <li>• Support different learning styles with audio options</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
