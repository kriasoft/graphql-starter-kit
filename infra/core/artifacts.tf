# Cloud Storage for Build Artifacts

# Docker Registry
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/artifact_registry_repository
resource "google_artifact_registry_repository" "cloud_run" {
  location      = var.gcp_region
  repository_id = "cloud-run"
  description   = "Docker repository for Cloud Run services."
  format        = "DOCKER"

  cleanup_policies {
    id     = "cloud-run-cleanup"
    action = "KEEP"

    most_recent_versions {
      keep_count = 2
    }
  }
}

# Cloud Storage Bucket
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket
#
# NOTE: The Google account under which the Terraform Cloud agents run must have
#       the owner role on the target domain name in order to create Google Cloud
#       Storage buckets using that domain name. You can update the list of owner
#       members in the Google Search Console at the following URL:
#       https://search.google.com/search-console/welcome?new_domain_name=example.com
#       https://cloud.google.com/storage/docs/domain-name-verification
resource "google_storage_bucket" "pkg" {
  name          = "pkg.${var.root_level_domain}"
  location      = var.gcp_region
  force_destroy = false

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
}
