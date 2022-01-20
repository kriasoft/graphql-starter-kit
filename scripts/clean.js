/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { Octokit } from "@octokit/rest";
import envars from "envars";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { $, nothrow } from "zx";
import { deleteTestKVNamespace, deleteTestSubdomain } from "./cloudflare.js";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
envars.config({ env: "test", cwd: path.resolve(__dirname, "../env") });

// Initialize GitHub client
const env = process.env;
const [owner, repo] = env.GITHUB_REPOSITORY.split("/");
const gh = new Octokit({ auth: env.GITHUB_TOKEN });

// Get the list of merged PRs
const { data: pulls } = await gh.pulls.list({
  owner,
  repo,
  state: "closed",
  sort: "updated",
  direction: "desc",
  base: "main",
  per_page: 30,
});

// Cleans up transient deployments for merged PRs
for (const pr of pulls.slice(3)) {
  console.log("[", pr.number, "]", pr.title);
  const [res] = await Promise.all([
    gh.repos.listDeployments({
      owner,
      repo,
      environment: `${pr.number}-test`,
    }),
    deleteTestSubdomain(pr.number),
    deleteTestKVNamespace(pr.number),
    nothrow(
      $`gcloud functions delete api_${pr.number} --project=${env.GOOGLE_CLOUD_PROJECT} --region=${env.GOOGLE_CLOUD_REGION} --verbosity=none --quiet`,
    ),
  ]);

  for (const deployment of res.data) {
    await gh.repos.createDeploymentStatus({
      mediaType: { previews: ["ant-man", "flash"] },
      owner,
      repo,
      deployment_id: deployment.id,
      state: "inactive",
    });

    await gh.repos.deleteDeployment({
      owner,
      repo,
      deployment_id: deployment.id,
    });
  }
}
