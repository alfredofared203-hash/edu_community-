function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error('JWT_SECRET must be set to a value of at least 32 characters.');
  }
  return secret;
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || `${getJwtSecret()}_refresh`;
}

function validateAuthConfig() {
  getJwtSecret();
  getRefreshSecret();
}

module.exports = { getJwtSecret, getRefreshSecret, validateAuthConfig };
