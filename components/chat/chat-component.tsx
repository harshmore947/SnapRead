"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { getChatMessages } from "@/actions/chat-actions";

interface ChatComponentProps {
  summaryId: string;
  summaryTitle: string;
}

export default function ChatComponent({
  summaryId,
  summaryTitle,
}: ChatComponentProps) {
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageTimestamps, setMessageTimestamps] = useState<Record<string, Date>>({});

  const {
    messages,
    sendMessage,
    setMessages,
    status,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { summaryId },
    }),
    onError: (error) => {
      console.error("Streaming chat error:", error);
      toast.error("Failed to generate response. Please try again.");
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat history from PostgreSQL
  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await getChatMessages(summaryId);
        if (result.success && result.data && result.data.length > 0) {
          const timestamps: Record<string, Date> = {};
          const history: Parameters<typeof setMessages>[0] = [];

          for (const msg of result.data) {
            const userMsgId = `${msg.id}-user`;
            const assistantMsgId = `${msg.id}-assistant`;
            const createdDate = new Date(msg.created_at);

            timestamps[userMsgId] = createdDate;
            timestamps[assistantMsgId] = createdDate;

            (history as UIMessage[]).push({
              id: userMsgId,
              role: "user",
              parts: [{ type: "text", text: msg.message }],
            });

            (history as UIMessage[]).push({
              id: assistantMsgId,
              role: "assistant",
              parts: [{ type: "text", text: msg.response }],
            });
          }

          setMessageTimestamps(timestamps);
          setMessages(history);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadHistory();
  }, [summaryId, setMessages]);

  const handleQuickQuestion = (question: string) => {
    sendMessage({ text: question });
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  if (isLoadingHistory) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-r from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <MessageCircle className="h-5 w-5 text-rose-600" />
            Chat with Document
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
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-gradient-to-r from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-50">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-rose-600" />
            <span>Chat with Document</span>
            <Sparkles className="h-4 w-4 text-rose-400" />
          </div>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ask questions grounded in &ldquo;{summaryTitle}&rdquo;
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Messages Container - Fixed Height with Smooth Scroll */}
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
                Ask anything about the document content. I will read the full document text and answer in real-time.
              </p>

              {/* Quick Question Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => handleQuickQuestion("What are the main key points and takeaways?")}
                >
                  📝 Main points
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => handleQuickQuestion("Can you provide an executive summary of this document?")}
                >
                  📄 Executive Summary
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => handleQuickQuestion("What critical questions or risks should I investigate in this document?")}
                >
                  ❓ Critical Risks & Questions
                </Button>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const textContent = msg.parts
                ?.filter((part) => part.type === "text")
                .map((part) => (part as { type: "text"; text: string }).text)
                .join("") || "";
              const createdAt = messageTimestamps[msg.id] ?? new Date();

              return (
                <div key={msg.id} className="space-y-3">
                  {msg.role === "user" ? (
                    /* User Message */
                    <div className="flex justify-end">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-rose-600 text-white p-3 rounded-2xl rounded-br-md">
                          <p className="text-sm whitespace-pre-wrap">{textContent}</p>
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatTime(createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* AI Assistant Response (Streams in real-time) */
                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-gray-100 text-gray-900 p-3 rounded-2xl rounded-bl-md">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{textContent}</p>
                        </div>
                        <div className="flex items-center justify-start gap-1 mt-1">
                          <Bot className="h-3 w-3 text-rose-600" />
                          <span className="text-xs text-gray-500">
                            {formatTime(createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-600 p-3 rounded-2xl rounded-bl-md flex items-center gap-2 text-sm">
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-rose-600"></div>
                <span>Analyzing document...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading && inputValue.trim() !== "") {
              sendMessage({ text: inputValue });
              setInputValue("");
            }
          }}
          className="flex-shrink-0 space-y-2"
        >
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about the document..."
              disabled={isLoading}
              className="flex-1 rounded-pill border border-rose-200 bg-transparent px-5 py-3 text-base outline-none focus-visible:border-rose-400 focus-visible:ring-rose-400/30 focus-visible:ring-[3px]"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="rounded-pill bg-rose-600 px-6 py-3 text-white hover:bg-rose-700 transition-colors duration-200"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            💡 Real-time streaming answers grounded in full document text
          </p>
        </form>
      </CardContent>
    </Card>
  );
}