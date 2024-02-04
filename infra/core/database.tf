# Google Cloud SQL
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database

resource "random_id" "db_name_suffix" {
  byte_length = 4
}

resource "google_project_service" "compute" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "sqladmin" {
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

resource "google_sql_database_instance" "db" {
  name                = "db-${random_id.db_name_suffix.hex}"
  database_version    = "POSTGRES_15"
  deletion_protection = false

  settings {
    tier = "db-f1-micro"

    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "on"
    }
  }

  depends_on = [google_project_service.sqladmin]
}

resource "google_sql_user" "developer" {
  name       = trimsuffix(google_service_account.developer.email, ".gserviceaccount.com")
  instance   = google_sql_database_instance.db.name
  type       = "CLOUD_IAM_SERVICE_ACCOUNT"
  depends_on = [google_service_account.developer]
}
