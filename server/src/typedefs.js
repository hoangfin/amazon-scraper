/**
 * Express middleware function
 * @callback middleware
 * @param {import ("express").Request} req
 * @param {import ("express").Response} res
 * @param {import ("express").NextFunction} next
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} Product
 * @property {String} id
 * @property {String} uuid
 * @property {String} title
 * @property {Number} price
 * @property {Array<String>} images
 * @property {Object} overview
 * @property {Array<String>} features
 */