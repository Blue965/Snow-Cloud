import { google } from "googleapis"

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID!
const GCP_REGION = process.env.GCP_REGION || "europe-west1"
const GCP_ZONE = process.env.GCP_ZONE || "europe-west1-b"
const GCP_SERVICE_ACCOUNT_KEY = process.env.GCP_SERVICE_ACCOUNT_KEY // JSON string of the service account key

function getAuth() {
  if (!GCP_SERVICE_ACCOUNT_KEY) {
    throw new Error("GCP_SERVICE_ACCOUNT_KEY environment variable is not set")
  }

  const credentials = JSON.parse(GCP_SERVICE_ACCOUNT_KEY)

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/compute"],
  })
}

function getCompute() {
  const auth = getAuth()
  return google.compute({ version: "v1", auth })
}

// Machine types by plan
const PLAN_MACHINE_TYPES: Record<string, string> = {
  Free: "e2-micro",
  Starter: "e2-small",
  Pro: "e2-medium",
  Enterprise: "e2-standard-2",
}

const PLAN_RAM_MB: Record<string, number> = {
  Free: 512,
  Starter: 1024,
  Pro: 2048,
  Enterprise: 4096,
}

// Startup scripts for Node.js and Python
function getStartupScript(runtime: string, botCode?: string): string {
  if (runtime === "Python") {
    return `#!/bin/bash
apt-get update -y
apt-get install -y python3 python3-pip
pip3 install discord.py python-dotenv
echo '${botCode ?? ""}' > /home/bot/main.py
echo "BOT_READY" > /home/bot/status
`
  }

  // Default: Node.js
  return `#!/bin/bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
mkdir -p /home/bot
echo '${botCode ?? ""}' > /home/bot/index.js
cd /home/bot
npm init -y > /dev/null 2>&1
npm install discord.js dotenv
echo "BOT_READY" > /home/bot/status
`
}

export interface CreateVMOptions {
  instanceName: string
  runtime: string
  plan: string
  botCode?: string
}

export interface VMInstance {
  name: string
  status: string
  externalIp?: string
  machineType: string
  zone: string
}

export async function createVM(options: CreateVMOptions): Promise<VMInstance> {
  const compute = getCompute()
  const machineType = PLAN_MACHINE_TYPES[options.plan] || "e2-micro"

  const instanceName = `snowbot-${options.instanceName.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40)}`

  const startupScript = getStartupScript(options.runtime, options.botCode)

  const res = await compute.instances.insert({
    project: GCP_PROJECT_ID,
    zone: GCP_ZONE,
    requestBody: {
      name: instanceName,
      machineType: `zones/${GCP_ZONE}/machineTypes/${machineType}`,
      disks: [
        {
          boot: true,
          autoDelete: true,
          initializeParams: {
            sourceImage: "projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts",
            diskSizeGb: "10",
          },
        },
      ],
      networkInterfaces: [
        {
          network: "global/networks/default",
          accessConfigs: [
            {
              type: "ONE_TO_ONE_NAT",
              name: "External NAT",
            },
          ],
        },
      ],
      metadata: {
        items: [
          {
            key: "startup-script",
            value: startupScript,
          },
        ],
      },
      labels: {
        "snow-cloud": "true",
        runtime: options.runtime.toLowerCase(),
      },
      scheduling: {
        preemptible: options.plan === "Free",
        automaticRestart: options.plan !== "Free",
      },
    },
  })

  // Wait for the operation to complete
  const operationName = res.data.name
  if (!operationName) throw new Error("Failed to create VM: no operation name returned")

  await waitForOperation(GCP_ZONE, operationName)

  // Get the instance details to find the external IP
  const instance = await compute.instances.get({
    project: GCP_PROJECT_ID,
    zone: GCP_ZONE,
    instance: instanceName,
  })

  const externalIp = instance.data.networkInterfaces?.[0]?.accessConfigs?.[0]?.natIP

  return {
    name: instanceName,
    status: instance.data.status || "RUNNING",
    externalIp: externalIp || undefined,
    machineType,
    zone: GCP_ZONE,
  }
}

export async function startVM(instanceName: string): Promise<void> {
  const compute = getCompute()
  const res = await compute.instances.start({
    project: GCP_PROJECT_ID,
    zone: GCP_ZONE,
    instance: instanceName,
  })
  if (res.data.name) await waitForOperation(GCP_ZONE, res.data.name)
}

export async function stopVM(instanceName: string): Promise<void> {
  const compute = getCompute()
  const res = await compute.instances.stop({
    project: GCP_PROJECT_ID,
    zone: GCP_ZONE,
    instance: instanceName,
  })
  if (res.data.name) await waitForOperation(GCP_ZONE, res.data.name)
}

export async function deleteVM(instanceName: string): Promise<void> {
  const compute = getCompute()
  try {
    const res = await compute.instances.delete({
      project: GCP_PROJECT_ID,
      zone: GCP_ZONE,
      instance: instanceName,
    })
    if (res.data.name) await waitForOperation(GCP_ZONE, res.data.name)
  } catch (err: any) {
    // If instance not found, consider it deleted
    if (err?.code === 404) return
    throw err
  }
}

export async function getVMStatus(instanceName: string): Promise<string> {
  const compute = getCompute()
  try {
    const res = await compute.instances.get({
      project: GCP_PROJECT_ID,
      zone: GCP_ZONE,
      instance: instanceName,
    })
    return res.data.status || "UNKNOWN"
  } catch (err: any) {
    if (err?.code === 404) return "NOT_FOUND"
    throw err
  }
}

export async function getVMExternalIP(instanceName: string): Promise<string | undefined> {
  const compute = getCompute()
  try {
    const res = await compute.instances.get({
      project: GCP_PROJECT_ID,
      zone: GCP_ZONE,
      instance: instanceName,
    })
    return res.data.networkInterfaces?.[0]?.accessConfigs?.[0]?.natIP ?? undefined
  } catch {
    return undefined
  }
}

async function waitForOperation(zone: string, operationName: string, maxWaitMs = 120000): Promise<void> {
  const compute = getCompute()
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitMs) {
    const res = await compute.zoneOperations.get({
      project: GCP_PROJECT_ID,
      zone,
      operation: operationName,
    })

    if (res.data.status === "DONE") {
      if (res.data.error) {
        throw new Error(`GCP operation failed: ${JSON.stringify(res.data.error)}`)
      }
      return
    }

    await new Promise((r) => setTimeout(r, 2000))
  }

  throw new Error(`GCP operation timed out after ${maxWaitMs}ms`)
}
