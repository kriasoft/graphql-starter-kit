# Terraform Cloud configuration for the core (shared) workspace
# https://developer.hashicorp.com/terraform/cli/cloud/settings

terraform {
  cloud {
    organization = "example"

    workspaces {
      project = "default"
      name    = "core"
    }
  }

  required_providers {
    # Google Cloud Platform Provider
    # https://registry.terraform.io/providers/hashicorp/google/latest/docs
    google = {
      source  = "hashicorp/google"
      version = "~> 5.14.0"
    }

    # Cloudflare Provider
    # https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.23"
    }
  }
}
