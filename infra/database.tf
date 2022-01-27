# Google Cloud SQL
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database

resource "google_sql_database" "default" {
  name      = var.database
  instance  = google_sql_database_instance.pg14.name
  charset   = "UTF8"
  collation = "en_US.UTF8"
  timeouts {}
}

resource "google_sql_database_instance" "pg14" {
  name                = "pg14"
  region              = "us-central1"
  database_version    = "POSTGRES_14"
  deletion_protection = true

  settings {
    tier = "db-f1-micro"

    disk_size = 100
    disk_type = "PD_SSD"

    ip_configuration {
      require_ssl = true
    }

    backup_configuration {
      enabled    = true
      location   = "us"
      start_time = "21:00"

      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7

      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }

    maintenance_window {
      day  = 7
      hour = 0
    }
  }
}
