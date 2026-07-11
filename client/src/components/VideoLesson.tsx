import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface VideoLessonProps {
  title: string;
  description: string;
  videoUrl?: string;
  transcript?: string;
  interactivePoints?: Array<{
    time: number;
    question: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
  }>;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

export default function VideoLesson({
  title,
  description,
  videoUrl,
  transcript,
  interactivePoints = [],
  onComplete,
  onProgress,
}: VideoLessonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);

      if (video.currentTime >= video.duration - 0.5 && !isCompleted) {
        setIsCompleted(true);
        onComplete?.();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsCompleted(true);
      onComplete?.();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isCompleted, onComplete, onProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleInteraction = () => {
      const upcomingQuiz = interactivePoints.find((point) => {
        const timeSinceQuiz = currentTime - point.time;
        return timeSinceQuiz >= 0 && timeSinceQuiz < 2 && activeQuiz !== point.time;
      });

      if (upcomingQuiz && !quizAnswered) {
        setActiveQuiz(upcomingQuiz.time);
        setIsPlaying(false);
        video.pause();
      }
    };

    const interval = setInterval(handleInteraction, 1000);
    return () => clearInterval(interval);
  }, [currentTime, interactivePoints, activeQuiz, quizAnswered]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!activeQuiz) return;
    const quiz = interactivePoints.find((q) => q.time === activeQuiz);
    if (!quiz) return;

    setSelectedAnswer(answerIndex);
    setQuizAnswered(true);

    if (answerIndex === quiz.correctAnswer) {
      toast?.success?.("Correct! +10 XP");
    }
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setSelectedAnswer(null);
    setQuizAnswered(false);
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={isCompleted ? "default" : "outline"}>
            {isCompleted ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Video Lesson</p>
                <p className="text-sm text-slate-400">Video content would play here</p>
              </div>
            </div>
          )}

          {/* Interactive Quiz Overlay */}
          {activeQuiz && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Check!</CardTitle>
                  <CardDescription>Let's make sure you understand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium">
                    {interactivePoints.find((q) => q.time === activeQuiz)?.question}
                  </p>
                  <div className="space-y-2">
                    {interactivePoints
                      .find((q) => q.time === activeQuiz)
                      ?.options?.map((option, idx) => (
                        <Button
                          key={idx}
                          variant={
                            quizAnswered && idx === interactivePoints.find((q) => q.time === activeQuiz)?.correctAnswer
                              ? "default"
                              : quizAnswered && idx === selectedAnswer
                                ? "destructive"
                                : "outline"
                          }
                          onClick={() => handleQuizAnswer(idx)}
                          disabled={quizAnswered}
                          className="w-full justify-start"
                        >
                          {option}
                        </Button>
                      ))}
                  </div>
                  {quizAnswered && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">
                        {interactivePoints.find((q) => q.time === activeQuiz)?.explanation}
                      </p>
                    </div>
                  )}
                  {quizAnswered && (
                    <Button onClick={closeQuiz} className="w-full">
                      Continue
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => skip(-10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => skip(10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="text-white hover:bg-white/20 text-xs"
                >
                  Transcript
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Panel */}
        {showTranscript && transcript && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-auto text-sm text-slate-600 whitespace-pre-wrap">
                {transcript}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive Points Indicator */}
        {interactivePoints.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {interactivePoints.length} Interactive Checkpoints
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
