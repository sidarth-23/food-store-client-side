// PostgreSQL Backend
import { environment } from '../../../environments/environment';

const BASE_URL = environment.production ? '' : 'http://localhost:3000/api/v1';
// Users route
const USER_URL = `${BASE_URL}/users`;
export const POST_LOGIN_USER = `${USER_URL}/login`;
export const POST_REGISTER_USER = `${USER_URL}/register`;
export const GET_AND_PATCH_LOGGED_IN_USER_DATA = `${USER_URL}/user`;
export const PATCH_PASSWORD = `${USER_URL}/password`
export const GET_USER_ADDRESS = `${USER_URL}/address`;
export const GET_AND_PATCH_USER_FAVOURITES = `${USER_URL}/favourites`;
export const GET_AND_PATCH_USER_CART = `${USER_URL}/cart`; // requires query foodId

// Orders routes
const ORDER_URL = `${BASE_URL}/orders`;
export const POST_USER_ORDER = `${ORDER_URL}/create-order`;
export const GET_USER_ORDERS = `${ORDER_URL}/order-summary`;

// food routes
const FOOD_URL = `${BASE_URL}/foods`;
export const GET_ALL_FOODS = `${FOOD_URL}/all`;
export const GET_FOOD_BY_SEARCH_TERM = `${FOOD_URL}/search`; //requires query searchTerm
export const GET_AND_SEARCH_FOOD_BY_TAG_NAME = `${FOOD_URL}/tags`; // ignoring the query tagName will give result of all tags
export const GET_FOOD_BY_ID = `${FOOD_URL}/id` // requires query foodId

// location routes
const LOCATION_URL = `${BASE_URL}/location`
export const GET_COUNTRY_LIST = `${LOCATION_URL}/country`
export const GET_STATE_LIST = `${LOCATION_URL}/state` // requires params of country
export const GET_CITY_NAMES_IN_STATE = `${LOCATION_URL}/city` // requires params of country and state
export const GET_ADDRESS_FROM_COORDINATES = `${LOCATION_URL}/address` // require params lat and lng separately
export const GET_LOCATION_FROM_COORDINATES = `${LOCATION_URL}/coordinates` // requires params of address
