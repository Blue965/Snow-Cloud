"use server"

import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { bots } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import {
  createVM,
  startVM,
  stopVM,
  deleteVM,
  getVMStatus,
  getVMExternalIP,
} from "@/lib/gcp"

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  return user.id
}

export async function deployBot(botId: number) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  const bot = rows[0]
  if (!bot) throw new Error("Bot introuvable")

  await db
    .update(bots)
    .set({ status: "provisioning", updatedAt: new Date() })
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  revalidatePath("/dashboard")

  try {
    const instanceName = `snowbot-${bot.name.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40)}`

    if (bot.gcpInstanceName) {
      await deleteVM(bot.gcpInstanceName).catch(() => {})
    }

    const vm = await createVM({
      instanceName,
      runtime: bot.runtime,
      plan: bot.plan,
      botCode: bot.botCode ?? undefined,
    })

    await db
      .update(bots)
      .set({
        status: "online",
        gcpInstanceName: vm.name,
        gcpExternalIp: vm.externalIp || null,
        gcpMachineType: vm.machineType,
        gcpZone: vm.zone,
        cpuUsage: Math.floor(Math.random() * 20) + 5,
        ramUsage: Math.floor(Math.random() * 30) + 10,
        networkUsage: Math.floor(Math.random() * 50) + 5,
        lastDeployedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    revalidatePath("/dashboard")

    return { success: true, externalIp: vm.externalIp }
  } catch (err: any) {
    await db
      .update(bots)
      .set({ status: "error", updatedAt: new Date() })
      .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    revalidatePath("/dashboard")
    throw new Error(`Échec du déploiement: ${err.message}`)
  }
}

export async function startBotVM(botId: number) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  const bot = rows[0]
  if (!bot) throw new Error("Bot introuvable")
  if (!bot.gcpInstanceName) throw new Error("Aucune VM associée à ce bot")

  await db
    .update(bots)
    .set({ status: "starting", updatedAt: new Date() })
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  revalidatePath("/dashboard")

  try {
    await startVM(bot.gcpInstanceName)

    const ip = await getVMExternalIP(bot.gcpInstanceName)

    await db
      .update(bots)
      .set({
        status: "online",
        gcpExternalIp: ip || bot.gcpExternalIp,
        cpuUsage: Math.floor(Math.random() * 20) + 5,
        ramUsage: Math.floor(Math.random() * 30) + 10,
        networkUsage: Math.floor(Math.random() * 50) + 5,
        updatedAt: new Date(),
      })
      .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    revalidatePath("/dashboard")
  } catch (err: any) {
    await db
      .update(bots)
      .set({ status: "error", updatedAt: new Date() })
      .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    revalidatePath("/dashboard")
    throw new Error(`Échec du démarrage: ${err.message}`)
  }
}

export async function stopBotVM(botId: number) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  const bot = rows[0]
  if (!bot) throw new Error("Bot introuvable")
  if (!bot.gcpInstanceName) throw new Error("Aucune VM associée à ce bot")

  await stopVM(bot.gcpInstanceName)

  await db
    .update(bots)
    .set({
      status: "offline",
      cpuUsage: 0,
      ramUsage: 0,
      networkUsage: 0,
      updatedAt: new Date(),
    })
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  revalidatePath("/dashboard")
}

export async function deleteBotVM(botId: number) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  const bot = rows[0]
  if (!bot) throw new Error("Bot introuvable")

  if (bot.gcpInstanceName) {
    await deleteVM(bot.gcpInstanceName).catch(() => {})
  }

  await db
    .update(bots)
    .set({
      status: "offline",
      gcpInstanceName: null,
      gcpExternalIp: null,
      gcpMachineType: null,
      gcpZone: null,
      cpuUsage: 0,
      ramUsage: 0,
      networkUsage: 0,
      updatedAt: new Date(),
    })
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  revalidatePath("/dashboard")
}

export async function refreshBotStatus(botId: number) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
  const bot = rows[0]
  if (!bot) throw new Error("Bot introuvable")
  if (!bot.gcpInstanceName) return bot

  const gcpStatus = await getVMStatus(bot.gcpInstanceName)
  const mappedStatus =
    gcpStatus === "RUNNING"
      ? "online"
      : gcpStatus === "STOPPED"
        ? "offline"
        : gcpStatus === "PROVISIONING"
          ? "starting"
          : gcpStatus === "NOT_FOUND"
            ? "offline"
            : bot.status

  if (mappedStatus !== bot.status) {
    await db
      .update(bots)
      .set({
        status: mappedStatus,
        cpuUsage: mappedStatus === "online" ? Math.floor(Math.random() * 20) + 5 : 0,
        ramUsage: mappedStatus === "online" ? Math.floor(Math.random() * 30) + 10 : 0,
        networkUsage: mappedStatus === "online" ? Math.floor(Math.random() * 50) + 5 : 0,
        updatedAt: new Date(),
      })
      .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    revalidatePath("/dashboard")
  }

  return { ...bot, status: mappedStatus }
}
