import { build, UserConfig } from "vite";
import { join, resolve } from "path";
import { readdirSync } from "fs";

const CONFIG: UserConfig = {
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
};

const main = async () => {
  const entryDir = resolve(import.meta.dirname, "./batch");
  const targets = readdirSync(entryDir).map((name: string) => ({
    path: join(entryDir, name),
    name,
  }));

  await Promise.all(
    targets.map((target) =>
      build({
        ...CONFIG,
        build: {
          outDir: `dist/${target.name}`,
          rollupOptions: {
            input: {
              [target.name]: join(target.path, `${target.name}.ts`),
            },
            output: {
              entryFileNames: "index.js",
            },
          },
        },
      })
    )
  );
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
