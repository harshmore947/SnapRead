"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MessageCircle, Send, Trash2, Bot, User, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { getChatMessages, sendChatMessage } from "@/actions/chat-actions";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  created_at: Date;
}

interface ChatComponentProps {
  summaryId: string;
  summaryTitle: string;
}

export default function ChatComponent({
  summaryId,
  summaryTitle,
}: ChatComponentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatMessages();
  }, [summaryId]);

  const loadChatMessages = async () => {
    try {
      const result = await getChatMessages(summaryId);
      if (result.success) {
        setMessages(result.data || []);
      } else {
        console.error("Failed to load messages:", result.error);
        // Don't show error toast for initial load, just keep empty state
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      // Don't show error toast for initial load, just keep empty state
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = newMessage.trim();
    setNewMessage("");
    setIsLoading(true);

    try {
      const result = await sendChatMessage(summaryId, userMessage);
      if (result.success && result.data) {
        setMessages((prev) => [...prev, result.data]);
        toast.success("🤖 Response generated!");
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  if (isLoadingMessages) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-r from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <MessageCircle className="h-5 w-5 text-rose-600" />
            Chat with PDF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-gradient-to-r from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-rose-600" />
            <span>Chat with PDF</span>
            <Sparkles className="h-4 w-4 text-rose-400" />
          </div>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ask questions about "{summaryTitle}"
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Messages Container - Fixed Height with Scroll */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto space-y-4 p-4 bg-white/50 rounded-2xl border border-rose-100 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 bg-rose-50 rounded-full mb-4">
                <Bot className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-600 text-sm max-w-sm mb-4">
                Ask me anything about the PDF content. I'll help you understand
                and explore the document.
              </p>

              {/* Quick Question Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => setNewMessage("What are the main points?")}
                >
                  📝 Main points
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() =>
                    setNewMessage("Can you summarize this document?")
                  }
                >
                  📄 Summarize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() =>
                    setNewMessage(
                      "What questions should I ask about this document?"
                    )
                  }
                >
                  ❓ Suggest questions
                </Button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="bg-rose-600 text-white p-3 rounded-2xl rounded-br-md">
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-2xl rounded-bl-md">
                      <p className="text-sm leading-relaxed">{msg.response}</p>
                    </div>
                    <div className="flex items-center justify-start gap-1 mt-1">
                      <Bot className="h-3 w-3 text-rose-600" />
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 space-y-2">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the PDF..."
              disabled={isLoading}
              className="flex-1 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim()}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center">
            💡 Try asking: "What are the main points?", "Summarize section 2",
            or "What does this document conclude?"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
