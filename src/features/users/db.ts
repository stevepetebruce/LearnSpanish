import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";


// Function to update a user in the database if they exist, or create them if they don't
export async function upsertUser(user: typeof UserTable.$inferInsert) {
    await db.insert(UserTable).values(user).onConflictDoUpdate({
        target: [UserTable.id],
        set: user,
    })
}

export async function deleteUser(userId: string) {
    await db.delete(UserTable).where(eq(UserTable.id, userId));
}
