import cp from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

let repo = (argv("repo") || exec("git remote get-url origin"))
  .trim()
  .toLowerCase();

let author = (path.basename(path.dirname(repo)) || "wopjs").toLowerCase();

let repoName = (
  path.basename(repo, ".git") || path.basename(process.cwd())
).toLowerCase();

let isWop = author === "wopjs";

let pkgName = argv("name") || `@${author}/${repoName}`;
let description = argv("description") || repoName;

let pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.name = pkgName;
pkg.description = description;
pkg.keywords = [];
pkg.repository = repo || `${author}/${repoName}`;
if (!isWop) {
  pkg.maintainers = void 0;
}

let readme = fs.readFileSync("README.template.md", "utf8");
readme = readme.replaceAll("{{pkgName}}", pkgName);
readme = readme.replaceAll("{{author}}", author);
readme = readme.replaceAll("{{repoName}}", repoName);
readme = readme.replaceAll("{{description}}", description);

if (isWop) {
  readme += "\n## License\n\nMIT @ [wopjs](https://github.com/wopjs)\n";
}

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
fs.writeFileSync("README.md", readme);
fs.rmSync("README.template.md");
fs.rmSync("scripts/setup.mjs");

const win = bin => (process.platform === "win32" ? `${bin}.cmd` : bin);
cp.spawnSync(win("npm"), ["install"], { stdio: "inherit" });

function exec(command) {
  try {
    return String(cp.execSync(command));
  } catch {
    return "";
  }
}

function argv(key) {
  let index = args.indexOf(`--${key}`);
  if (index > -1) {
    return args[index + 1] || "";
  }

  const matchedArg = args.find(arg => arg.startsWith(`--${key}=`));
  if (matchedArg) {
    return matchedArg.split("=")[1] || "";
  }

  return "";
}
