# Google CLoud SQL Database.
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database

data "tfe_outputs" "core" {
  organization = var.tfe_organization
  workspace    = "core"
}

resource "google_sql_database" "db" {
  name     = var.db_name
  instance = data.tfe_outputs.core.values.db_instance_name
}
