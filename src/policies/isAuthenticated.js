module.exports = async (ctx, next) => {
    if (ctx.state.user) {
      // Người dùng đã đăng nhập
      return await next();
    } else {
      // Người dùng chưa đăng nhập
      return ctx.unauthorized('Bạn cần đăng nhập để truy cập tài nguyên này.');
    }
  };
  