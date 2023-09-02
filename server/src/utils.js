/**
 *
 * @param {middleware} fn
 * @returns {middleware}
 */
exports.asyncHandler = fn => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    }
};