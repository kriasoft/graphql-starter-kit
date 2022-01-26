/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Octokit } from "@octokit/rest";
import envars from "envars";
import minimist from "minimist";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env;

/**
 * https://docs.github.com/en/rest/reference/repos#list-deployments
 */
async function listDeployments(options = {}) {
  const [owner, repo] = env.GITHUB_REPOSITORY?.split("/") ?? [];
  const gh = new Octokit({ auth: env.GITHUB_TOKEN });
  const res = await gh.repos.listDeployments({
    owner,
    repo,
    sha: options.sha,
    ref: options.ref,
    task: options.task,
    environment: options.env,
  });
  console.log(res.data);
}

/**
 * https://docs.github.com/en/rest/reference/repos#create-a-deployment
 */
async function createDeployment(options = {}) {
  const [owner, repo] = env.GITHUB_REPOSITORY?.split("/") ?? [];
  const gh = new Octokit({ auth: env.GITHUB_TOKEN });

  console.log("Creating a new deployment...");
  const res = await gh.repos.createDeployment({
    mediaType: { previews: ["ant-man"] },
    owner,
    repo,
    ref: options.ref,
    task: options.task,
    auto_merge: options.auto_merge,
    required_contexts: [],
    payload: options.payload,
    environment: options.env,
    description: options.description,
    transient_environment:
      options.transient === undefined ? true : options.transient,
    production_environment: options.env === "production",
  });
  const id = res.data.id;

  if (id) {
    console.log(`::set-output name=id::${id}`);
    await createDeploymentStatus({
      state: "in_progress",
      ...options,
      id,
    });
  }
}

/**
 * https://docs.github.com/en/rest/reference/repos#delete-a-deployment
 */
async function deleteDeployment(options = {}) {
  const [owner, repo] = env.GITHUB_REPOSITORY?.split("/") ?? [];
  const gh = new Octokit({ auth: env.GITHUB_TOKEN });

  let res = await gh.repos.getDeployment({
    owner,
    repo,
    deployment_id: options.id,
  });

  if (res.status === 200) {
    console.log(`Deleting deployment # ${options.id} ...`);
    res = await gh.repos.deleteDeployment({
      owner,
      repo,
      deployment_id: options.id,
    });
  }
}

/**
 * https://docs.github.com/en/rest/reference/repos#create-a-deployment-status
 * https://octokit.github.io/rest.js/v18#repos-create-deployment-status
 */
async function createDeploymentStatus(options = {}) {
  options.state === "cancelled" ? "inactive" : options.state;
  const [owner, repo] = env.GITHUB_REPOSITORY?.split("/") ?? [];
  const gh = new Octokit({ auth: env.GITHUB_TOKEN });

  let id = options.id;

  if (!options.id && options.ref) {
    const { data: deployments } = await gh.repos.listDeployments({
      owner,
      repo,
      sha: options.sha,
      ref: options.ref,
      task: options.task,
      environment: options.env,
    });
    if (deployments.length === 0) {
      throw new Error(
        `Cannot find a deployment by sha: ${options.sha}, ref: ${options.ref}, task: ${options.task}, environment: ${options.env}`,
      );
    }
    if (deployments.length > 1) {
      throw new Error(
        `More than one deployment found by sha: ${options.sha}, ref: ${options.ref}, task: ${options.task}, environment: ${options.env}`,
      );
    }
    id = deployments[0].id;
  }

  const res = await gh.repos.createDeploymentStatus({
    mediaType: { previews: ["ant-man", "flash"] },
    owner,
    repo,
    deployment_id: id,
    state: options.state,
    target_url: options.target_url || options.env_url,
    log_url: options.log_url,
    description: options.description,
    environment: options.env,
    environment_url: options.env_url || options.target_url,
    auto_inactive: options.auto_inactive,
  });

  console.log(res.data);
}

// Load environment variables (GITHUB_TOKEN, etc.)
const options = {
  default: { env: "test" },
  boolean: ["transient", "auto_inactive", "auto_merge"],
};
const args = minimist(process.argv.slice(2), options);
envars.config({ env: args.env, cwd: path.resolve(__dirname, "../env") });
args.env = args.env === "prod" ? "production" : args.env;
args.payload = args.payload && JSON.parse(args.payload);

let cmd;

switch (args._[0]) {
  case "deployments":
    cmd = listDeployments(args);
    break;
  case "deployment-status":
    cmd = createDeploymentStatus(args);
    break;
  case "create-deployment":
    cmd = createDeployment(args);
    break;
  case "delete-deployment":
    cmd = deleteDeployment(args);
    break;
  default:
    cmd = Promise.reject(`Unknown command: ${args._[0]}`);
}

cmd.catch((err) => {
  console.error(err);
  process.exit(1);
});
