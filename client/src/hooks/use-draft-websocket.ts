import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useDraftWebSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to draft WebSocket');
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Draft update received:', message);
          
          // Handle both draft updates and any message with settings
          if (message.type === 'draft-update' || message.type === 'draft-status' || message.data?.settings) {
            console.log('Invalidating draft queries due to WebSocket update');
            // Invalidate all draft-related queries to refetch latest data
            queryClient.invalidateQueries({ queryKey: ["/api/draft/settings"] });
            queryClient.invalidateQueries({ queryKey: ["/api/draft/picks"] });
            queryClient.invalidateQueries({ queryKey: ["/api/draft/prospects"] });
            queryClient.invalidateQueries({ queryKey: ["/api/draft/prospects/available"] });
            queryClient.invalidateQueries({ queryKey: ["/api/activity"] });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('Disconnected from draft WebSocket, code:', event.code);
        wsRef.current = null;
        
        // Attempt to reconnect after a delay if it wasn't a manual close
        if (event.code !== 1000 && !reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('Draft WebSocket error:', error);
        if (wsRef.current) {
          wsRef.current.close();
        }
      };

    } catch (error) {
      console.error('Failed to connect to draft WebSocket:', error);
    }
  }, [queryClient]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000); // Normal closure
      }
    };
  }, [connect]);

  return wsRef.current;
}