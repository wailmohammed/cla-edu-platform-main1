import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface FlashCard {
  id: number;
  front: string;
  back: string;
  category: string;
  nextReview: Date;
  interval: number;
  easeFactor: number;
}

interface SpacedRepetitionProps {
  cards: FlashCard[];
  onComplete?: (results: Array<{ cardId: number; quality: number }>) => void;
}

export default function SpacedRepetition({ cards, onComplete }: SpacedRepetitionProps) {
  const [currentCard, setCurrentCard] = useState<FlashCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<Array<{ cardId: number; quality: number }>>([]);
  const [queue, setQueue] = useState<FlashCard[]>([]);
  const [stats, setStats] = useState({ reviewed: 0, mastered: 0, learning: 0 });

  useEffect(() => {
    const now = new Date();
    const dueCards = cards
      .filter((card) => new Date(card.nextReview) <= now)
      .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
    setQueue(dueCards);
    if (dueCards.length > 0) {
      setCurrentCard(dueCards[0]);
    }
  }, [cards]);

  const calculateNextReview = (card: FlashCard, quality: number): { nextReview: Date; interval: number; easeFactor: number } => {
    let { interval, easeFactor } = card;

    if (quality >= 3) {
      if (interval === 0) {
        interval = 1;
      } else if (interval === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    } else {
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return { nextReview, interval, easeFactor };
  };

  const handleRating = (quality: number) => {
    if (!currentCard) return;

    const { nextReview, interval, easeFactor } = calculateNextReview(currentCard, quality);
    const updatedCard = { ...currentCard, nextReview, interval, easeFactor };

    setQueue((prev) => prev.filter((card) => card.id !== currentCard.id));

    setResults((prev) => [...prev, { cardId: currentCard.id, quality }]);

    if (quality >= 3) {
      setStats((prev) => ({ ...prev, reviewed: prev.reviewed + 1, mastered: prev.mastered + 1 }));
    } else {
      setStats((prev) => ({ ...prev, reviewed: prev.reviewed + 1, learning: prev.learning + 1 }));
    }

    const nextInQueue = queue[1];
    if (nextInQueue) {
      setCurrentCard(nextInQueue);
    } else {
      setCurrentCard(null);
      onComplete?.([...results, { cardId: currentCard.id, quality }]);
    }

    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const resetSession = () => {
    const now = new Date();
    const dueCards = cards
      .filter((card) => new Date(card.nextReview) <= now)
      .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
    setQueue(dueCards);
    setResults([]);
    setStats({ reviewed: 0, mastered: 0, learning: 0 });
    setIsFlipped(false);
    if (dueCards.length > 0) {
      setCurrentCard(dueCards[0]);
    } else {
      setCurrentCard(null);
    }
  };

  if (!currentCard && queue.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Spaced Repetition
          </CardTitle>
          <CardDescription>Review flashcards using the SM-2 algorithm</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-900 mb-2">All caught up!</p>
          <p className="text-sm text-slate-600 mb-4">
            No cards due for review. Come back later!
          </p>
          <Button onClick={resetSession} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Spaced Repetition
            </CardTitle>
            <CardDescription>
              {currentCard?.category} • {queue.length} cards remaining
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {stats.mastered} mastered
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3 text-yellow-500" />
              {stats.learning} learning
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div
            className="relative h-64 cursor-pointer perspective-1000"
            onClick={handleFlip}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-200 rounded-xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Question</p>
                  <p className="text-xl font-medium text-slate-900">{currentCard?.front}</p>
                </div>
              </div>
              <div className="absolute inset-0 backface-hidden bg-purple-50 border-2 border-purple-200 rounded-xl p-6 flex items-center justify-center rotate-y-180">
                <div className="text-center">
                  <p className="text-xs text-purple-600 uppercase tracking-wider mb-2">Answer</p>
                  <p className="text-xl font-medium text-purple-900">{currentCard?.back}</p>
                </div>
              </div>
            </div>
          </div>

          {isFlipped && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 text-center">
                How well did you remember this?
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRating(1)}
                  className="gap-2 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 text-red-500" />
                  Again
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRating(3)}
                  className="gap-2 border-yellow-200 hover:bg-yellow-50"
                >
                  <Clock className="w-4 h-4 text-yellow-500" />
                  Hard
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRating(4)}
                  className="gap-2 border-blue-200 hover:bg-blue-50"
                >
                  Good
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleRating(5)}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Easy
                </Button>
              </div>
            </div>
          )}

          {!isFlipped && (
            <div className="text-center">
              <Button onClick={handleFlip} className="gap-2">
                Show Answer
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
