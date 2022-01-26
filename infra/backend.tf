# The block below configures Terraform to use the 'remote' backend with Terraform Cloud.
# For more information, see https://www.terraform.io/language/settings/backends/remote

terraform {
  backend "remote" {
    organization = "example"

    workspaces {
      prfix = "app-"
    }
  }
}
