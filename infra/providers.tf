# Terraform Providers
# https://registry.terraform.io/browse/providers

terraform {
  required_providers {
    # Google Cloud Platform Provider
    # https://registry.terraform.io/providers/hashicorp/google/latest/docs
    # https://github.com/hashicorp/terraform-provider-google
    google = {
      source  = "hashicorp/google"
      version = "~> 4.8"
    }

    # Google Cloud Platfrom Provider (beta)
    # https://registry.terraform.io/providers/hashicorp/google/latest/docs
    # https://github.com/hashicorp/terraform-provider-google-beta
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.8"
    }

    # Cloudflare Provider
    # https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs
    # https://github.com/cloudflare/terraform-provider-cloudflare
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.7"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project
  region  = var.region
  zone    = var.zone
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
