# Terraform Cloud Project

This folder contains the Terraform configurations for our project's infrastructure, managed through [Terraform Cloud](https://developer.hashicorp.com/terraform/cloud-docs). The infrastructure is divided into multiple workspaces to handle different environments and shared resources.

## Directory Structure

The repository is organized into the following directories, each corresponding to a specific Terraform Cloud workspace:

- **[`/core`](./core/)** - This directory contains the Terraform configurations for the global/shared resources used across all environments. These may include VPCs, shared databases, IAM roles, etc.

- **[`/server-prod`](./server-prod/)** - Contains the Terraform configurations for the production web server. This workspace should be configured with production-grade settings, ensuring high availability and security.

- **[`/server-test`](./server-test/)** - Holds the configurations for the testing/QA web server. This environment mirrors production closely and is used for final testing before deploying to production.

- **[`/server-preview`](./server-preview/)** - This directory is for the preview web server, typically used for staging and pre-release reviews. It might contain configurations that are under testing or not yet approved for the testing environment.

## Usage

### Prerequisites

- [Terraform CLI](https://developer.hashicorp.com/terraform/install)
- Access to the [Terraform Cloud](https://app.terraform.io/) workspace

### Setting Up Workspaces in Terraform Cloud

1. Log in to [Terraform Cloud](https://app.terraform.io/).
2. Create a workspace for each directory/environment.
3. Link each workspace to the corresponding directory in this repository.
4. Save Terraform API token to the `../.terraformrc` file.

### Working with Terraform

To work with Terraform configurations:

1. Navigate to the appropriate directory (e.g., `cd server-prod`).
2. Initialize Terraform: `terraform init`.
3. Apply configurations: `terraform apply`.

Ensure that you are working in the correct workspace to avoid misconfigurations.

### Contributions

Please follow our contribution guidelines for making changes or adding new configurations. Ensure you test configurations in the test and preview environments before applying them to production.

### References

- https://learn.hashicorp.com/terraform
- https://cloud.google.com/docs/terraform/best-practices-for-terraform
- https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines
- https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference.html

## Support

For any issues or questions related to this Terraform setup, please contact [@koistya](https://github.com/koistya) on our [Discord server](https://discord.com/invite/bSsv7XM).
