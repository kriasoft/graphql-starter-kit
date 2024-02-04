# Input Variables
# https://developer.hashicorp.com/terraform/language/values/variables

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

variable "root_level_domain" {
  type        = string
  description = "The root-level domain for the app"
  default     = "example.com"
}
