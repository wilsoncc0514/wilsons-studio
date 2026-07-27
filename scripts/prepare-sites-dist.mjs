import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, ".open-next");
const output = join(root, "dist");
const server = join(output, "server");

await rm(output, { recursive: true, force: true });
await mkdir(server, { recursive: true });

for (const entry of await readdir(source)) {
  if (entry === "assets") continue;
  await cp(join(source, entry), join(server, entry), { recursive: true });
}

await cp(join(source, "worker.js"), join(server, "index.js"));
await cp(join(source, "assets"), join(output, "client"), { recursive: true });
