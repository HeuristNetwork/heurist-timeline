/**
 * @file deploy-heurist-timeline.mjs
 * @brief Deploys the built Heurist Timeline bundle.
 * @project     Heurist academic knowledge management system
 * @package     heurist-timeline
 * @link        https://HeuristNetwork.org
 * @copyright   (C) 2024 onwards Heurist Network
 * @author      Artem Osmakov   <osmakov@gmail.com>
 * @author      Ian Johnson <ian.johnson.heurist@gmail.com>
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt GNU License 3.0
 * @since       8.0
 */

/**
 * deploy-heurist-timeline.mjs - Publish the built heurist-timeline distribution.
 *
 * The destination root is supplied by HEURIST_CLIENT_DIST_ROOT and defaults to
 * the local Heurist bundles directory. Deployment is staged before replacing
 * the previous module directory, so a failed copy cannot leave it empty.
 *
 * @project     Heurist academic knowledge management system
 * @package     heurist-timeline.scripts
 * @license     https://www.gnu.org/licenses/gpl-3.0.txt GNU License 3.0
 */

import { cp, mkdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleName = "heurist-timeline";
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const sourceDirectory = path.join(projectDirectory, "dist");
const distributionRoot =
  process.env.HEURIST_CLIENT_DIST_ROOT ||
  "C:/xampp/htdocs/heurist/hclient/bundles/";
const destinationDirectory = path.join(distributionRoot, moduleName);
const stagingDirectory = `${destinationDirectory}.new-${process.pid}`;
const previousDirectory = `${destinationDirectory}.old-${process.pid}`;
const requiredFiles = [
  "heurist-timeline.js",
  "heurist-timeline-main.css",
  "assets/localization/localization_eng.txt",
  "assets/localization/localization_fre.txt",
];

async function verifyDistribution(directory, label) {
  const info = await stat(directory).catch(() => null);
  if (!info?.isDirectory()) {
    throw new Error(`${label} directory does not exist: ${directory}`);
  }
  for (const relativePath of requiredFiles) {
    const file = path.join(directory, ...relativePath.split("/"));
    const fileInfo = await stat(file).catch(() => null);
    if (!fileInfo?.isFile()) {
      throw new Error(
        `${label} does not contain ${relativePath}: ${directory}`,
      );
    }
  }
}

async function deploy() {
  await verifyDistribution(sourceDirectory, "Build output");
  await mkdir(distributionRoot, { recursive: true });
  await rm(stagingDirectory, { recursive: true, force: true });
  await rm(previousDirectory, { recursive: true, force: true });
  // Copy the complete Vite distribution. This includes dist/assets and keeps
  // localization at bundles/heurist-timeline/assets/localization.
  await cp(sourceDirectory, stagingDirectory, { recursive: true, force: true });
  await verifyDistribution(stagingDirectory, "Staged deployment");

  let hadPrevious = false;
  try {
    await rename(destinationDirectory, previousDirectory);
    hadPrevious = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  try {
    await rename(stagingDirectory, destinationDirectory);
  } catch (error) {
    if (hadPrevious)
      await rename(previousDirectory, destinationDirectory).catch(() => {});
    throw error;
  }
  await rm(previousDirectory, { recursive: true, force: true });
  await verifyDistribution(destinationDirectory, "Deployed module");
  console.log(`Heurist Timeline deployed to ${destinationDirectory}`);
}

deploy().catch(async (error) => {
  await rm(stagingDirectory, { recursive: true, force: true }).catch(() => {});
  console.error(error);
  process.exitCode = 1;
});
