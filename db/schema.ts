import {index,integer,primaryKey,sqliteTable,text,uniqueIndex} from "drizzle-orm/sqlite-core";
export const radarSettings=sqliteTable("radar_settings",{
 userId:text("user_id").primaryKey(),body:text("body").notNull(),revision:integer("revision").notNull().default(0),mutationToken:text("mutation_token").notNull().default(""),updatedAt:text("updated_at").notNull(),
});
export const cvVersions=sqliteTable("cv_versions",{
 id:integer("id").primaryKey({autoIncrement:true}),userId:text("user_id").notNull(),version:integer("version").notNull(),text:text("text").notNull(),contentHash:text("content_hash").notNull(),filename:text("filename"),mimeType:text("mime_type"),size:integer("size"),status:text("status").notNull(),analysis:text("analysis"),createdAt:text("created_at").notNull(),updatedAt:text("updated_at").notNull(),
},t=>[uniqueIndex("idx_cv_versions_user_version").on(t.userId,t.version),index("idx_cv_versions_user_created").on(t.userId,t.createdAt)]);
export const fitAnalysisCache=sqliteTable("fit_analysis_cache",{
 userId:text("user_id").notNull(),cvVersion:integer("cv_version").notNull(),contentHash:text("content_hash").notNull(),body:text("body").notNull(),createdAt:text("created_at").notNull(),
},t=>[primaryKey({columns:[t.userId,t.cvVersion,t.contentHash]})]);
export const radarGuards=sqliteTable("radar_guards",{
 userId:text("user_id").notNull(),kind:text("kind").notNull(),windowStartedAt:text("window_started_at").notNull(),count:integer("count").notNull().default(0),lockedUntil:text("locked_until"),
},t=>[primaryKey({columns:[t.userId,t.kind]})]);
export const radarJobs=sqliteTable("radar_jobs",{
 userId:text("user_id").notNull(),jobId:text("job_id").notNull(),normalizedUrl:text("normalized_url").notNull(),body:text("body").notNull(),seenAt:text("seen_at").notNull(),updatedAt:text("updated_at").notNull(),
},t=>[primaryKey({columns:[t.userId,t.jobId]}),uniqueIndex("idx_radar_jobs_user_url").on(t.userId,t.normalizedUrl)]);
export const radarRuns=sqliteTable("radar_runs",{
 id:integer("id").primaryKey({autoIncrement:true}),userId:text("user_id").notNull(),startedAt:text("started_at").notNull(),finishedAt:text("finished_at"),status:text("status").notNull(),message:text("message").notNull(),resultCount:integer("result_count").notNull().default(0),
},t=>[index("idx_radar_runs_user_started").on(t.userId,t.startedAt)]);
