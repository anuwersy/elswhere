import {existsSync,renameSync,writeFileSync} from "node:fs";

// Sites validates the worker entrypoint by looking for an explicit default
// export with a fetch method. Vinext's generated entrypoint already exposes
// that method, but its minified export can be missed by the validator, so keep
// the generated app intact and add a small explicit adapter around it.
const entry="dist/server/index.js";
const implementation="dist/server/_vinext-entry.js";
if(existsSync(entry)&&!existsSync(implementation)){
  renameSync(entry,implementation);
  writeFileSync(entry,'import app from "./_vinext-entry.js";\n\nexport default {\n  fetch(request, env, ctx) {\n    return app.fetch(request, env, ctx);\n  },\n};\n');
}
