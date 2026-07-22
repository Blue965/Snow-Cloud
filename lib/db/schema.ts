import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core"

// --- App tables ------------------------------------------------------------

export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("offline"), // online | offline | starting | provisioning | error
  runtime: text("runtime").notNull().default("Node.js"), // Node.js | Python
  plan: text("plan").notNull().default("Free"),
  cpuUsage: integer("cpuUsage").notNull().default(0), // percent
  ramUsage: integer("ramUsage").notNull().default(0), // percent
  ramLimit: integer("ramLimit").notNull().default(512), // MB
  networkUsage: integer("networkUsage").notNull().default(0), // KB/s
  uptimeSeconds: integer("uptimeSeconds").notNull().default(0),
  gcpInstanceName: text("gcpInstanceName"), // Compute Engine instance name
  gcpExternalIp: text("gcpExternalIp"), // External IP of the VM
  gcpMachineType: text("gcpMachineType"), // e2-micro, e2-small, etc.
  gcpZone: text("gcpZone"), // europe-west1-b
  botCode: text("botCode"), // The bot source code stored in DB
  lastDeployedAt: timestamp("lastDeployedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})
