export default class Helpers {
  constructor() {
    this.generateDate = this.generateDate.bind(this);
  }

  public generateDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const date = mm + "/" + dd + "/" + yyyy;

    return date;
  }
}
