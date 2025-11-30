"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, MessageSquare } from "lucide-react";

interface FeedbackItem {
  id: string;
  type: string;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
}

const typeEmoji: Record<string, string> = {
  suggestion: "💡",
  bug: "🐛",
  feature: "✨",
  compliment: "❤️",
  other: "💬",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  reviewed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  resolved: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

export function FeedbackManagement() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchFeedback();
  }, [filter]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching feedback:", error);
        return;
      }

      setFeedbackList(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("feedback")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      // Refresh the list
      fetchFeedback();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feedback Management</h2>
          <p className="text-muted-foreground">
            View and manage user feedback submissions
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Feedback</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : feedbackList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No feedback yet</p>
            <p className="text-sm text-muted-foreground">
              Feedback submissions will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {typeEmoji[feedback.type] || "💬"}
                      </span>
                      <CardTitle className="text-lg capitalize">
                        {feedback.type}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={statusColors[feedback.status]}
                      >
                        {feedback.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {formatDate(feedback.created_at)}
                      {feedback.email && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {feedback.email}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {feedback.status !== "reviewed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(feedback.id, "reviewed")}
                      >
                        Mark Reviewed
                      </Button>
                    )}
                    {feedback.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(feedback.id, "resolved")}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{feedback.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
