/**
 * Standardized API Response Utilities for EventSphere REST API
 * Maintains 100% backward compatibility with React Frontend Context
 */

/**
 * Send a standardized success JSON response
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, etc.)
 * @param {any} data - Payload data or collection
 * @param {string} [message] - Optional success message
 * @param {object} [meta] - Optional metadata (e.g. pagination or count)
 */
export const sendSuccess = (res, statusCode = 200, data = null, message = null, meta = {}) => {
  const response = {
    success: true,
  };

  if (message) {
    response.message = message;
  }

  if (meta && Object.keys(meta).length > 0) {
    Object.assign(response, meta);
  } else if (Array.isArray(data)) {
    response.count = data.length;
  }

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error JSON response
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (400, 404, 500, etc.)
 * @param {string} message - Error description
 * @param {Array} [errors] - Optional array of field validation errors
 */
export const sendError = (res, statusCode = 500, message = "Internal Server Error", errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors && Array.isArray(errors) && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
