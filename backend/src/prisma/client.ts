import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { getEnv } from '../config/env.js'
const env = getEnv()
const connectionString = env.databaseUrl
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })
export default prisma
