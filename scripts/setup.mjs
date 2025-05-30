import cp from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

let repo = (argv("repo") || exec("git remote get-url origin")).trim().toLowerCase();

let author = (path.basename(path.dirname(repo)) || "wopjs").toLowerCase();

let repoName = (path.basename(repo, ".git") || path.basename(process.cwd())).toLowerCase();

let isWop = author === "wopjs";

let pkgName = argv("name") || `@${author}/${repoName}`;

let description = argv("description") || repoName;

// #region package.json
{
  let pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.name = pkgName;
  pkg.description = description;
  pkg.keywords = [];
  pkg.repository = repo && !repo.includes("github") ? repo : `${author}/${repoName}`;
  if (!isWop) {
    pkg.maintainers = void 0;
  }
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
}
// #endregion

// #region README.md
{
  let readme = fs.readFileSync("README.template.md", "utf8");
  readme = readme.replaceAll("{{pkgName}}", pkgName);
  readme = readme.replaceAll("{{author}}", author);
  readme = readme.replaceAll("{{repoName}}", repoName);
  readme = readme.replaceAll("{{description}}", description);
  fs.writeFileSync("README.md", readme);
  if (isWop) {
    readme += "\n## License\n\nMIT @ [wopjs](https://github.com/wopjs)\n";
  }
  fs.rmSync("README.template.md");
}
// #endregion

// #region LICENSE.txt
{
  const licensePath = "LICENSE.txt";
  let license = fs.readFileSync(licensePath, "utf8");
  license = license.replace(/Copyright \(c\) \d\d\d\d wopjs/, `Copyright (c) ${new Date().getFullYear()} ${author}`);
  fs.writeFileSync(licensePath, license);
}
// #endregion

// #region dependabot
{
  const dependabotPath = ".github/dependabot.yml";
  let dependabot = fs.readFileSync(dependabotPath, "utf8");
  dependabot = dependabot.replaceAll(`interval: "weekly"`, `interval: "monthly"`);
  fs.writeFileSync(dependabotPath, dependabot);
}
// #endregion

// #region Clean up
{
  fs.rmSync("scripts/setup.mjs");
}
// #endregion

// #region Install dependencies
{
  const win = bin => (process.platform === "win32" ? `${bin}.cmd` : bin);
  cp.spawnSync(win("npm"), ["install"], { stdio: "inherit" });
}
// #endregion

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

function exec(command) {
  try {
    return String(cp.execSync(command));
  } catch {
    return "";
  }
}
