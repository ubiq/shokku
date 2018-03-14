resource "vultr_startup_script" "boot_script" {
  type = "boot"
  name = "boot-script"
  content = "${file("${path.module}/scripts/boot-script.sh")}"
}