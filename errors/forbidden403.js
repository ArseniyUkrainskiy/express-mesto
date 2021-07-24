class Forbidden403 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
module.exports = Forbidden403;
