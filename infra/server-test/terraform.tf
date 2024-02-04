# Terraform Cloud configuration for the core (shared) workspace
# https://developer.hashicorp.com/terraform/cli/cloud/settings

terraform {
  cloud {
    organization = "example"

    workspaces {
      project = "default"
      name    = "server-test"
    }
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.14.0"
    }
  }
}
