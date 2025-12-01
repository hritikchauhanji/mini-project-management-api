export default class RequestHandler {
  static pagination(req) {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;
    return { page, limit, offset };
  }

  static filters(req, allowed = []) {
    const filters = {};
    for (const key of allowed) {
      if (req.query[key]) filters[key] = req.query[key];
    }
    return filters;
  }
}
