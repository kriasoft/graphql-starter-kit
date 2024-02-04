# Google Cloud Storage
#
# NOTE: The Google account under which the Terraform Cloud agents run must have
#       the owner role on the target domain name in order to create Google Cloud
#       Storage buckets using that domain name. You can update the list of owner
#       members in the Google Search Console at the following URL:
#       https://search.google.com/search-console/welcome?new_domain_name=example.com
#       https://cloud.google.com/storage/docs/domain-name-verification

resource "google_storage_bucket" "pkg" {
  name          = "pkg.${var.root_level_domain}"
  location      = "US"
  force_destroy = false

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
}
