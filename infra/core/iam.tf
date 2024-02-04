# Google Cloud Service Account
# https://cloud.google.com/compute/docs/access/service-accounts
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_service_account

resource "google_service_account" "developer" {
  account_id   = "developer"
  display_name = "Developer"
}
