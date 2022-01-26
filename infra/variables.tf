# Input Variables
# https://www.terraform.io/language/values/variables

variable "project" {
  description = "The GCP project name"
}

variable "region" {
  description = "The GCP region"
}

variable "zone" {
  description = "The GCP zone"
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  sensitive   = true
}

variable "database" {
  description = "The database name"
}

variable "database_password" {
  description = "The root user password"
}
