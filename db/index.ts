// @ts-nocheck -- Cloudflare bindings are injected by Sites at runtime.
import {drizzle} from "drizzle-orm/d1";import * as schema from "./schema";
export function getDb(){const database=(globalThis as typeof globalThis&{__RADAR_ENV?:{DB?:D1Database}}).__RADAR_ENV?.DB;if(!database)throw new Error("Cloudflare D1 binding DB is unavailable.");return drizzle(database,{schema})}
