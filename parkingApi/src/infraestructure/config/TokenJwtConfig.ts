export const TokenJwtConfig = {
  SECRET_KEY: process.env.JWT_SECRET || 'secret_key_placeholder',
  PREFIX_TOKEN: 'Bearer ',
  HEADER_AUTHORIZATION: 'Authorization',
};
