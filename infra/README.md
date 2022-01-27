# Cloud Infrastructure

The Google Cloud Platform (GCP) and Cloudflare infrastructure resources required
by the app and that can be bootstrapped via [Terraform](https://www.terraform.io/).

## Requirements

- [Node.js](https://nodejs.org/en/) v16+ with [Yarn](https://yarnpkg.com/) package manager
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and [Terraform CLI](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- Access to [Google Cloud Projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects) and [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) workspaces

<details>
  <summary>How to install Terraform CLI on macOS?</summary><br>

```bash
$ brew tap hashicorp/tap
$ brew install hashicorp/tap/terraform
$ brew update
$ brew upgrade hashicorp/tap/terraform
$ yarn tf -version
```

</details>

<details>
  <summary>How to create Google Cloud Platform projects?</summary><br>

Simply navigate to [Google Cloud Resource Manager](https://console.cloud.google.com/cloud-resource-manager)
and create two GCP projects for both `test` (QA) and `prod` (production)
environments, e.g. "example" and "example-test".

Fore more information visit https://cloud.google.com/resource-manager/docs/creating-managing-projects<br>

</details>

<details>
  <summary>How to configure Terraform Cloud workspaces?</summary><br>

1. Sign in to [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) dashboard.
2. Create or join an organization.
3. Create two workspaces — `app-test` and `app-prod` for test/QA and production environments.
4. In each of these workspaces create an environment variable called `GOOGLE_CREDENTIALS` with the value containing JSON key of a GCP [service account](https://cloud.google.com/iam/docs/service-accounts). Note, this GCP service account needs to have `Owner` or `Editor` + `Service Usage Admin` roles.

For more information visit https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference<br>

</details>

<details>
  <summary>How to authenticate Terraform CLI in Terraform Cloud?</summary><br>

1. Create a personal or team [API Token](https://learn.hashicorp.com/tutorials/terraform/cloud-login) via [Terraform Cloud](https://app.terraform.io/app/) dashboard → [Settings](https://app.terraform.io/app/settings/tokens).
2. Save API token to the `.terraformrc` file in root of the project:

```
credentials "app.terraform.io" {
  token = "xxxxxx.atlasv1.zzzzzzzzzzzzz"
}
```

**NOTE**: This would allow to using different Terraform credentials per software project if you want to.<br>

</details>

## Getting Started

- `yarn tf init -upgrade` — Initializes a Terraform workspace
- `yarn tf plan` — creates an execution plan
- `yarn tf apply` — executes the actions proposed by the `yarn tf plan` command

**NOTE**: By default the `app-test` Terraform workspace is used. In order to use
the production workspace, set `TF_WORKSPACE` environment variable to `prod`. For
example:

```bash
$ TF_WORKSPACE=prod tf plan
$ TF_WORKSPACE=prod tf apply
```

**NOTE**: You need to run Terraform commands via `yarn tf <command> [...args]`.

<p align="center">
  <a href="https://www.youtube.com/watch?v=tomUWcQ0P3k"><img src="https://user-images.githubusercontent.com/197134/151321818-d47fe54f-c19e-4d4c-9834-c33e589a33e1.png" alt="" width="640" height="360" /></a>
</p>

Fore more information visit https://learn.hashicorp.com/terraform
