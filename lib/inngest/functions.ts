import { inngest } from "./client";
import { prisma as db } from "../prisma";
import { generateAIInsights } from "../../actions/dashboard";

/**
 * Scheduled cron job to update all existing industry insights weekly.
 * Runs at midnight every Sunday. Inngest v4 uses a single config object.
 */
export const weeklyIndustryInsightsUpdate = inngest.createFunction(
  {
    id: "weekly-industry-insights-update",
    name: "Weekly Industry Insights Updater",
    triggers: [{ event: "inngest/function.invoked" }, { cron: "0 0 * * 0" }],
  },
  async ({ step }) => {
    // 1. Fetch all industries stored in the database
    const industriesToUpdate = await step.run("fetch-all-industries", async () => {
      return await db.industryInsight.findMany({
        select: { id: true, industry: true },
      });
    });

    // 2. Update each industry with fresh Gemini insights
    for (const record of industriesToUpdate) {
      await step.run(`update-insights-for-${record.id}`, async () => {
        try {
          const freshInsights = await generateAIInsights(record.industry);
          await db.industryInsight.update({
            where: { id: record.id },
            data: {
              ...freshInsights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
          return { success: true, industry: record.industry };
        } catch (e: any) {
          console.error(`Failed to update insights for ${record.industry}:`, e);
          return { success: false, error: e.message };
        }
      });
    }

    return { updatedCount: industriesToUpdate.length };
  }
);
