# Input Variables
# https://developer.hashicorp.com/terraform/language/values/variables

variable "tfe_organization" {
  type        = string
  description = "Terraform Cloud organization ID"
  default     = "example"
}

variable "gcp_project" {
  type        = string
  description = "Google Cloud Project ID"
  default     = "example"
}

variable "gcp_region" {
  type        = string
  description = "Google Cloud region"
  default     = "us-central1"
}

variable "gcp_zone" {
  type        = string
  description = "Google Cloud zone"
  default     = "us-central1-c"
}

variable "db_name" {
  type        = string
  description = "Database name"
  default     = "example-test"
}
