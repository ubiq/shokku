data "vultr_region" "region" {
  filter {
    name   = "name"
    values = ["Los Angeles"]
  }
}

data "vultr_plan" "plan_manager" {
  filter {
    name   = "price_per_month"
    values = ["5.00"]
  }
}

data "vultr_plan" "plan_worker" {
  filter {
    name   = "price_per_month"
    values = ["20.00"]
  }
}

data "vultr_ssh_key" "ssh_key" {
  filter {
    name   = "name"
    values = ["shokku"]
  }
}
