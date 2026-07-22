"use server"

import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { bots } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  return user.id
}

export async function getBots() {
  const userId = await getUserId()
  return db.select().from(bots).where(eq(bots.userId, userId)).orderBy(desc(bots.createdAt))
}

export async function createBot(formData: FormData) {
  const userId = await getUserId()
  const name = String(formData.get("name") ?? "").trim()
  const runtime = String(formData.get("runtime") ?? "Node.js")
  const botCode = String(formData.get("botCode") ?? "").trim() || null
  if (!name) throw new Error("Le nom du bot est requis")

  await db.insert(bots).values({
    userId,
    name,
    runtime,
    botCode,
    status: "offline",
    plan: "Free",
    cpuUsage: 0,
    ramUsage: 0,
    ramLimit: 512,
    networkUsage: 0,
    uptimeSeconds: 0,
  })
  revalidatePath("/dashboard")
}

export async function updateBotCode(botId: number, code: string) {
  const userId = await getUserId()
  await db
    .update(bots)
    .set({ botCode: code, updatedAt: new Date() })
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  revalidatePath("/dashboard")
}

export async function toggleBotStatus(id: number) {
  const { startBotVM, stopBotVM } = await import("./vms")
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(bots)
    .where(and(eq(bots.id, id), eq(bots.userId, userId)))
  const bot = rows[0]
  if (!bot) throw new Error("Bot introuvable")

  if (bot.status === "online") {
    await stopBotVM(id)
  } else {
    await startBotVM(id)
  }
}

export async function deleteBot(id: number) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(bots)
    .where(and(eq(bots.id, id), eq(bots.userId, userId)))
  const bot = rows[0]
  if (bot?.gcpInstanceName) {
    const { deleteVM } = await import("@/lib/gcp")
    await deleteVM(bot.gcpInstanceName).catch(() => {})
  }
  await db.delete(bots).where(and(eq(bots.id, id), eq(bots.userId, userId)))
  revalidatePath("/dashboard")
}
