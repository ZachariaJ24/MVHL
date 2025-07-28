import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, PlayCircle, PauseCircle } from "lucide-react";

interface CountdownTimerProps {
  timeRemaining: number;
  isActive: boolean;
  currentPick: number;
  currentRound: number;
  onTimeExpired?: () => void;
}

export function CountdownTimer({ 
  timeRemaining: initialTime, 
  isActive, 
  currentPick, 
  currentRound,
  onTimeExpired 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(isActive);

  useEffect(() => {
    setTimeLeft(initialTime);
    setIsRunning(isActive);
  }, [initialTime, isActive]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-red-400 border-red-500/50 bg-red-500/20";
    if (timeLeft <= 30) return "text-yellow-400 border-yellow-500/50 bg-yellow-500/20";
    return "text-green-400 border-green-500/50 bg-green-500/20";
  };

  const getTimerIcon = () => {
    if (!isRunning) return <PauseCircle className="h-6 w-6" />;
    if (timeLeft <= 10) return <AlertCircle className="h-6 w-6" />;
    return <Clock className="h-6 w-6" />;
  };

  return (
    <Card className={`${getTimerColor()} transition-all duration-300 ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Timer Display */}
          <div className="flex items-center justify-center gap-3">
            {getTimerIcon()}
            <div className="text-4xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Draft Status */}
          <div className="space-y-2">
            <div className="text-lg font-semibold">
              Round {currentRound} • Pick #{currentPick}
            </div>
            <Badge 
              variant="outline" 
              className={isRunning ? "border-green-500 text-green-400" : "border-yellow-500 text-yellow-400"}
            >
              {isRunning ? "DRAFT ACTIVE" : "DRAFT PAUSED"}
            </Badge>
          </div>

          {/* Time Warning */}
          {timeLeft <= 30 && timeLeft > 0 && isRunning && (
            <div className="text-sm font-medium">
              {timeLeft <= 10 ? "⚠️ TIME EXPIRING!" : "🕐 30 seconds remaining"}
            </div>
          )}

          {/* Draft Instructions */}
          <div className="text-xs text-muted-foreground">
            {isRunning 
              ? "Teams have limited time to make their selection"
              : "Draft is currently paused"
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}