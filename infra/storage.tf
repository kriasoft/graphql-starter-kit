// Google Cloud Storage
// https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket

resource "google_storage_bucket" "storage" {
  name          = var.storage_bucket
  location      = "US"
  force_destroy = false

  uniform_bucket_level_access = false
}


resource "google_storage_bucket" "upload" {
  name          = var.upload_bucket
  location      = "US-CENTRAL1"
  force_destroy = false

  uniform_bucket_level_access = true

  cors {
    max_age_seconds = 3600
    method          = ["GET", "HEAD", "PUT", "OPTIONS"]
    origin          = ["*"]
    response_header = ["Content-Type", "Access-Control-Allow-Origin"]
  }

  retention_policy {
    is_locked        = false
    retention_period = 86400
  }
}

resource "google_storage_bucket" "cache" {
  name          = var.cache_bucket
  location      = "US-CENTRAL1"
  force_destroy = false

  uniform_bucket_level_access = true

  timeouts {}
}
