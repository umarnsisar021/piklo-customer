// ** Auth Endpoints

const api_base_url = 'https://clickinfosys.com/movenpick/api/'
const base_url = 'https://clickinfosys.com/movenpick/'

export default {
  host: api_base_url,
  url: base_url,
  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  host: api_base_url,
  loginEndpoint: `${api_base_url}auth/login`,
  // loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: `${api_base_url}auth/refresh`,
  // refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',

  userEndpoint: `${api_base_url}auth/user`,

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',
  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'

}
