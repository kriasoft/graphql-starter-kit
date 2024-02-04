# Provider Configuration
# https://developer.hashicorp.com/terraform/language/providers/configuration

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
  zone    = var.gcp_zone
}
