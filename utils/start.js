const { spawn } = require("child_process");

const day = process.argv[2];

spawn("nodemon", ["-x", "ts-node", `days/${day}/index.ts`], {
  stdio: "inherit",
});
