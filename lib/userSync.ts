import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Checks if the currently authenticated Clerk user exists in the Supabase database.
 * If not, it creates them.
 */
export async function checkAndSyncUser() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    console.warn(`User ${user.id} has no email address. Skipping database sync.`);
    return null;
  }

  try {
    // Check if user already exists by email
    let dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          clerkUserId: user.id,
          email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || null,
          imageUrl: user.imageUrl || null,
        },
      });
      console.log(`Successfully synced new user: ${email} (ID: ${user.id})`);
    } else if (dbUser.id !== user.id || !dbUser.clerkUserId) {
      dbUser = await prisma.user.update({
        where: { email },
        data: { 
          id: user.id,
          clerkUserId: user.id,
          imageUrl: user.imageUrl || null,
        },
      });
      console.log(`Updated database user ID and clerkUserId for ${email} to match Clerk ID ${user.id}`);
    }

    return dbUser;
  } catch (error) {
    console.error("Error syncing user with database:", error);
    return null;
  }
}
