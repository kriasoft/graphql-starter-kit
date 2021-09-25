/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

const path = require("path");
const envars = require("envars");
const spawn = require("cross-spawn");
const { Octokit } = require("@octokit/rest");
const { deleteTestSubdomain } = require("./cloudflare");

envars.config({ env: "test", cwd: path.resolve(__dirname, "../env") });

/**
 * Clean up transient deployments for merged PRs.
 */
async function clean() {
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

  for (const pr of pulls.slice(3)) {
    console.log("[", pr.number, "]", pr.title);
    const [, , res] = await Promise.all([
      deleteTestSubdomain(pr.number),
      new Promise((resolve) => {
        spawn("gcloud", [
          `--project=${env.GOOGLE_CLOUD_PROJECT}`,
          `functions`,
          `delete`,
          `api_${pr.number}`,
          `--region=${env.GOOGLE_CLOUD_REGION}`,
          `--quiet`,
        ]).on("close", resolve);
      }),
      gh.repos.listDeployments({
        owner,
        repo,
        environment: `${pr.number}-test`,
      }),
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
}

clean().catch((err) => {
  console.error(err);
  process.exit(1);
});
