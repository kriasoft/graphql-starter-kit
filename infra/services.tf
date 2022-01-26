# Google Cloud Service APIs
# https://registry.terraform.io/modules/terraform-google-modules/project-factory/google/latest/submodules/project_services

module "project-services" {
  source  = "terraform-google-modules/project-factory/google//modules/project_services"
  version = "~> 11.3"

  project_id = var.project

  activate_apis = [
    "artifactregistry.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudbuild.googleapis.com",
    "eventarc.googleapis.com",
    "run.googleapis.com",
    "logging.googleapis.com",
    "pubsub.googleapis.com"
  ]

  enable_apis                 = true
  disable_dependent_services  = false
  disable_services_on_destroy = false
}
