# Output Values
# https://developer.hashicorp.com/terraform/language/values/outputs

output "db_instance_name" {
  value     = google_sql_database_instance.db.name
  sensitive = false
}

output "developer_service_account_email" {
  value     = google_service_account.developer.email
  sensitive = false
}
