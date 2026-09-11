import {index,integer,primaryKey,sqliteTable,text,uniqueIndex} from "drizzle-orm/sqlite-core";
export const radarSettings=sqliteTable("radar_settings",{
 userId:text("user_id").primaryKey(),body:text("body").notNull(),updatedAt:text("updated_at").notNull(),
});
export const radarJobs=sqliteTable("radar_jobs",{
 userId:text("user_id").notNull(),jobId:text("job_id").notNull(),normalizedUrl:text("normalized_url").notNull(),body:text("body").notNull(),seenAt:text("seen_at").notNull(),updatedAt:text("updated_at").notNull(),
},t=>[primaryKey({columns:[t.userId,t.jobId]}),uniqueIndex("idx_radar_jobs_user_url").on(t.userId,t.normalizedUrl)]);
export const radarRuns=sqliteTable("radar_runs",{
 id:integer("id").primaryKey({autoIncrement:true}),userId:text("user_id").notNull(),startedAt:text("started_at").notNull(),finishedAt:text("finished_at"),status:text("status").notNull(),message:text("message").notNull(),resultCount:integer("result_count").notNull().default(0),
},t=>[index("idx_radar_runs_user_started").on(t.userId,t.startedAt)]);
