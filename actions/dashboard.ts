import { prisma } from "@/lib/prisma";

export async function generateAIInsights(industry: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze the industry "${industry}" and generate market insights.
You must respond with ONLY a valid JSON object matching this TypeScript schema:
{
  salaryRanges: Array<{ role: string, min: number, max: number, median: number }>,
  growthRate: number, // percentage, e.g. 8.5
  demandLevel: "High" | "Medium" | "Low",
  topSkills: string[],
  marketOutlook: string,
  keyTrends: string[],
  recommendedSkills: string[]
}
Do not include any markdown formatting (like \`\`\`json) or extra text. Just return the raw JSON object.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            salaryRanges: parsed.salaryRanges || [],
            growthRate: parseFloat(parsed.growthRate) || 0,
            demandLevel: parsed.demandLevel || "Medium",
            topSkills: parsed.topSkills || [],
            marketOutlook: parsed.marketOutlook || "",
            keyTrends: parsed.keyTrends || [],
            recommendedSkills: parsed.recommendedSkills || [],
          };
        }
      }
    } catch (e) {
      console.error("Gemini API error during insights generation:", e);
    }
  }

  // Fallback to high-quality mock data based on the selected industry
  const cleanIndustry = industry.toLowerCase();
  if (
    cleanIndustry.includes("tech") ||
    cleanIndustry.includes("software") ||
    cleanIndustry.includes("developer") ||
    cleanIndustry.includes("computer")
  ) {
    return {
      salaryRanges: [
        { role: "Software Engineer", min: 70000, max: 150000, median: 105000 },
        { role: "Senior Software Engineer", min: 110000, max: 210000, median: 150000 },
        { role: "Tech Lead / Architect", min: 130000, max: 250000, median: 185000 },
      ],
      growthRate: 14.8,
      demandLevel: "High",
      topSkills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "Cloud Computing"],
      marketOutlook: "The software engineering market remains highly dynamic and expanding, heavily driven by AI automation, full-stack framework modernization, and cloud architecture scaling.",
      keyTrends: [
        "Integration of AI copilots and coding assistants",
        "Serverless architectures and server-side optimization",
        "Edge computing and optimized web runtimes",
      ],
      recommendedSkills: ["GraphQL", "Docker / Containers", "AWS or GCP", "Generative AI APIs"],
    };
  }

  // Default fallback for other industries
  return {
    salaryRanges: [
      { role: "Junior Specialist", min: 45000, max: 70000, median: 55000 },
      { role: "Mid-level Specialist", min: 65000, max: 105000, median: 80000 },
      { role: "Senior Specialist", min: 95000, max: 160000, median: 120000 },
    ],
    growthRate: 6.5,
    demandLevel: "Medium",
    topSkills: ["Communication", "Problem Solving", "Project Management", "Data Analysis"],
    marketOutlook: "Steady development and digital transformation are driving stable demand for versatile professionals across operations and product planning roles.",
    keyTrends: [
      "Hybrid and remote operations models",
      "AI-assisted business workflow automation",
      "Heavy reliance on cross-functional soft skills",
    ],
    recommendedSkills: ["Agile Methodologies", "Critical Thinking", "Technical Literacy"],
  };
}
