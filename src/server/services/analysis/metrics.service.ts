import type { Message } from "@/lib/supabase/types";

export interface BasicMetrics {
  engagementRate: number;
  avgResponseTimeMinutes: number | null;
  followUpPressureScore: number;
  totalMessagesSent: number;
  totalMessagesReceived: number;
  consecutiveFollowUps: number;
}

/**
 * Compute basic metrics for a conversation (non-LLM)
 */
export function computeBasicMetrics(
  messages: Message[],
  userName: string
): BasicMetrics {
  const normalizedUserName = userName.toLowerCase().trim();

  // Sort messages by date
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
  );

  // Count messages sent vs received
  let totalMessagesSent = 0;
  let totalMessagesReceived = 0;

  sortedMessages.forEach((msg) => {
    if (msg.sender.toLowerCase().trim() === normalizedUserName) {
      totalMessagesSent++;
    } else {
      totalMessagesReceived++;
    }
  });

  // Engagement rate = messages from prospect / total messages
  const totalMessages = totalMessagesSent + totalMessagesReceived;
  const engagementRate =
    totalMessages > 0 ? (totalMessagesReceived / totalMessages) * 100 : 0;

  // Average response time (only when prospect replied)
  const responseTimes: number[] = [];
  for (let i = 1; i < sortedMessages.length; i++) {
    const prevMsg = sortedMessages[i - 1];
    const currMsg = sortedMessages[i];

    const prevIsMe = prevMsg.sender.toLowerCase().trim() === normalizedUserName;
    const currIsMe = currMsg.sender.toLowerCase().trim() === normalizedUserName;

    // If I sent a message and they replied
    if (prevIsMe && !currIsMe) {
      const prevTime = new Date(prevMsg.sent_at).getTime();
      const currTime = new Date(currMsg.sent_at).getTime();
      const diffMinutes = (currTime - prevTime) / (1000 * 60);

      // Only count reasonable response times (less than 30 days)
      if (diffMinutes > 0 && diffMinutes < 30 * 24 * 60) {
        responseTimes.push(diffMinutes);
      }
    }
  }

  const avgResponseTimeMinutes =
    responseTimes.length > 0
      ? Math.round(
          responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        )
      : null;

  // Follow-up pressure score (0-10)
  // Count consecutive messages from me without a reply
  let pressureScore = 0;
  let currentStreak = 0;
  let maxStreak = 0;

  sortedMessages.forEach((msg) => {
    if (msg.sender.toLowerCase().trim() === normalizedUserName) {
      currentStreak++;
      if (currentStreak >= 2) {
        pressureScore += currentStreak - 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  const followUpPressureScore = Math.min(10, pressureScore);

  // Consecutive follow-ups at the end (for status determination)
  let consecutiveFollowUps = 0;
  for (let i = sortedMessages.length - 1; i >= 0; i--) {
    if (
      sortedMessages[i].sender.toLowerCase().trim() === normalizedUserName
    ) {
      consecutiveFollowUps++;
    } else {
      break;
    }
  }

  return {
    engagementRate: Math.round(engagementRate * 100) / 100,
    avgResponseTimeMinutes,
    followUpPressureScore,
    totalMessagesSent,
    totalMessagesReceived,
    consecutiveFollowUps,
  };
}

/**
 * Compute global analytics across all conversations
 */
export function computeGlobalAnalytics(
  conversations: Array<{
    engagementRate: number | null;
    avgResponseTimeMinutes: number | null;
    consecutiveFollowUps: number;
    totalMessagesReceived: number;
    outreachScoreOverall: number | null;
    prospectStatus: string;
  }>
): {
  avgEngagementRate: number;
  responseRate: number;
  avgResponseTimeMinutes: number | null;
  totalFollowUps: number;
  avgOutreachScore: number | null;
  totalConversations: number;
  marketPullScore: number;
} {
  const totalConversations = conversations.length;

  if (totalConversations === 0) {
    return {
      avgEngagementRate: 0,
      responseRate: 0,
      avgResponseTimeMinutes: null,
      totalFollowUps: 0,
      avgOutreachScore: null,
      totalConversations: 0,
      marketPullScore: 0,
    };
  }

  // Average engagement rate
  const engagementRates = conversations
    .map((c) => c.engagementRate)
    .filter((r): r is number => r !== null);
  const avgEngagementRate =
    engagementRates.length > 0
      ? engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length
      : 0;

  // Response rate (% of convos that got at least one reply)
  const conversationsWithResponse = conversations.filter(
    (c) => c.totalMessagesReceived > 0
  ).length;
  const responseRate = (conversationsWithResponse / totalConversations) * 100;

  // Average response time
  const responseTimes = conversations
    .map((c) => c.avgResponseTimeMinutes)
    .filter((t): t is number => t !== null);
  const avgResponseTimeMinutes =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : null;

  // Total follow-ups
  const totalFollowUps = conversations.reduce(
    (sum, c) => sum + c.consecutiveFollowUps,
    0
  );

  // Average outreach score
  const outreachScores = conversations
    .map((c) => c.outreachScoreOverall)
    .filter((s): s is number => s !== null);
  const avgOutreachScore =
    outreachScores.length > 0
      ? Math.round(
          (outreachScores.reduce((a, b) => a + b, 0) / outreachScores.length) * 10
        ) / 10
      : null;

  // Market pull score (% interested + meeting_scheduled)
  const positiveStatuses = ["interested", "meeting_scheduled"];
  const positiveConversations = conversations.filter((c) =>
    positiveStatuses.includes(c.prospectStatus)
  ).length;
  const marketPullScore = (positiveConversations / totalConversations) * 100;

  return {
    avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
    responseRate: Math.round(responseRate * 100) / 100,
    avgResponseTimeMinutes,
    totalFollowUps,
    avgOutreachScore,
    totalConversations,
    marketPullScore: Math.round(marketPullScore * 100) / 100,
  };
}

/**
 * Get hot prospects (sorted by engagement rate)
 */
export function getHotProspects(
  conversations: Array<{
    id: string;
    engagementRate: number | null;
    prospectStatus: string;
    lastMessageDate: string;
  }>,
  limit: number = 5
): string[] {
  const eligibleStatuses = ["interested", "engaged", "meeting_scheduled"];

  return conversations
    .filter((c) => eligibleStatuses.includes(c.prospectStatus))
    .sort((a, b) => {
      // Primary sort: engagement rate (descending)
      const engagementDiff = (b.engagementRate || 0) - (a.engagementRate || 0);
      if (engagementDiff !== 0) return engagementDiff;

      // Secondary sort: recency (descending)
      return (
        new Date(b.lastMessageDate).getTime() -
        new Date(a.lastMessageDate).getTime()
      );
    })
    .slice(0, limit)
    .map((c) => c.id);
}
