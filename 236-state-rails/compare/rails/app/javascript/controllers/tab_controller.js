import { Controller } from "@hotwired/stimulus"

// This tab: a number kept in the button. data-turbo-permanent keeps the button through Turbo's page visits.
export default class extends Controller {
  static values = { count: Number }
  add() { this.countValue++ }
  countValueChanged() { this.element.textContent = `This tab: ${this.countValue}` }
}
