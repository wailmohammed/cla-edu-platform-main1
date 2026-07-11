import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, FileText, BookOpen, Download } from "lucide-react";

interface MultiModalLearningProps {
  lessonId: number;
  title: string;
}

export default function MultiModalLearning({ lessonId, title }: MultiModalLearningProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const transcript = `
    In this lesson, we'll explore the fundamentals of Python programming.
    
    Python is a high-level, interpreted programming language known for its simplicity and readability.
    It was created by Guido van Rossum in 1991 and has since become one of the most popular programming languages.
    
    Key features of Python include:
    - Simple and readable syntax
    - Dynamic typing
    - Automatic memory management
    - Extensive standard library
    - Support for multiple programming paradigms
    
    Let's start by understanding variables and data types...
  `;

  const notes = [
    { title: "Variables", content: "Variables are containers for storing data values" },
    { title: "Data Types", content: "Python supports int, float, str, bool, list, dict, tuple, set" },
    { title: "Operators", content: "Arithmetic, comparison, logical, assignment operators" },
    { title: "Control Flow", content: "if/else statements, loops (for, while)" },
  ];

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="audio" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audio" className="gap-2">
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="transcript" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Transcript</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
        </TabsList>

        {/* Audio Tab */}
        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audio Lesson</CardTitle>
              <CardDescription>Listen to the lesson with adjustable playback speed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Audio Player */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Volume2 className="w-8 h-8" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">
                      {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}
                    </span>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600">
                      {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentTime(Math.max(0, currentTime - 15))}
                  >
                    -15s
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20"
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentTime(Math.min(duration, currentTime + 15))}
                  >
                    +15s
                  </Button>
                </div>

                {/* Playback Speed */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-slate-600">Speed:</span>
                  {[0.75, 1, 1.25, 1.5].map((speed) => (
                    <Button
                      key={speed}
                      variant="outline"
                      size="sm"
                      className="w-12"
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Download Option */}
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Download className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Download Audio</p>
                  <p className="text-xs text-blue-700">Listen offline on your device</p>
                </div>
                <Button variant="ghost" size="sm">
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Transcript</CardTitle>
              <CardDescription>Full text of the audio lesson with timestamps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-6 space-y-4 max-h-96 overflow-y-auto">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{transcript}</p>
              </div>

              {/* Search in Transcript */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Search in transcript..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <Button variant="outline" size="sm">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Notes</CardTitle>
              <CardDescription>Key concepts and important points from this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{note.title}</h4>
                        <p className="text-sm text-slate-600">{note.content}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        Key Point
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Add Your Notes</p>
                <textarea
                  placeholder="Write your own notes here..."
                  className="w-full p-3 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <Button className="mt-3" size="sm">
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
