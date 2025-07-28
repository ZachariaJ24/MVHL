import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Crown, Shield } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    role?: 'player' | 'management' | 'admin';
    type?: 'discussion' | 'announcement' | 'urgent';
  };
  isOwn?: boolean;
}

export function ChatMessage({ message, isOwn = false }: ChatMessageProps) {
  const getRoleIcon = () => {
    if (message.role === 'admin') return <Crown className="h-3 w-3 text-yellow-500" />;
    if (message.role === 'management') return <Shield className="h-3 w-3 text-blue-500" />;
    return <User className="h-3 w-3 text-gray-500" />;
  };

  const getTypeColor = () => {
    if (message.type === 'urgent') return 'destructive';
    if (message.type === 'announcement') return 'default';
    return 'secondary';
  };

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isOwn && "flex-row-reverse"
    )}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-xs">
          {message.sender.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isOwn && "items-end"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{message.sender}</span>
          {getRoleIcon()}
          {message.type && message.type !== 'discussion' && (
            <Badge variant={getTypeColor()} className="text-xs">
              {message.type}
            </Badge>
          )}
        </div>
        
        <Card className={cn(
          "max-w-full",
          isOwn ? "bg-blue-600 text-white" : "bg-muted"
        )}>
          <CardContent className="p-3">
            <p className="text-sm">{message.content}</p>
            <p className={cn(
              "text-xs mt-2 opacity-70",
              isOwn ? "text-blue-100" : "text-muted-foreground"
            )}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}