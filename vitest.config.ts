import {defineConfig} from "vitest/config";
export default defineConfig({resolve:{alias:{"@":new URL(".",import.meta.url).pathname}},test:{alias:{"@":new URL(".",import.meta.url).pathname},include:["tests/**/*.test.ts"],watch:false,pool:"forks"}});
