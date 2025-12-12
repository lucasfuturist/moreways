// File: src/worker/index.ts
// Documentation: File 07-attribution-platform-integrations.md
// Role: BullMQ Worker Entry Point + Scheduler

// [FIX] Force IPv4 first to prevent Supabase ENETUNREACH errors in Docker
import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');

import 'dotenv-safe/config';
import { Worker, Queue } from 'bullmq'; // [FIX] Removed QueueScheduler (removed in BullMQ v5)
import { processEventJob } from '../dispatch/job/dispatch.job.processor';
import { pruneOldData } from './cron/worker.cron.prune'; // [FIX] Removed .ts extension

const REDIS_URL = process.env.REDIS_URL;

console.log('🚀 Worker Starting...');
console.log(`🔌 Connecting to Redis at ${REDIS_URL}`);

// 1. Event Processor
const worker = new Worker('events_queue', processEventJob, {
  connection: { url: REDIS_URL },
  concurrency: 5
});

worker.on('completed', (job) => console.log(`✅ Job ${job.id} completed!`));
worker.on('failed', (job, err) => console.error(`❌ Job ${job?.id} failed: ${err.message}`));

// 2. The Janitor (Cron)
// We use a separate queue for system tasks to avoid clogging the event pipe
const systemQueue = new Queue('system_queue', { connection: { url: REDIS_URL } });

const systemWorker = new Worker('system_queue', async (job) => {
  if (job.name === 'prune_data') {
    await pruneOldData();
  }
}, { connection: { url: REDIS_URL } });

// Schedule it: Run at 3 AM daily
async function initScheduler() {
  await systemQueue.add('prune_data', {}, {
    repeat: { pattern: '0 3 * * *' } // Cron syntax
  });
  console.log('⏰ Janitor scheduled for 03:00 daily.');
}

initScheduler().catch(console.error);