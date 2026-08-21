/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as contracts from "../contracts.js";
import type * as jobs from "../jobs.js";
import type * as messages from "../messages.js";
import type * as portfolio from "../portfolio.js";
import type * as profiles from "../profiles.js";
import type * as proposals from "../proposals.js";
import type * as reviews from "../reviews.js";
import type * as users from "../users.js";
import type * as utils_geo from "../utils/geo.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  contracts: typeof contracts;
  jobs: typeof jobs;
  messages: typeof messages;
  portfolio: typeof portfolio;
  profiles: typeof profiles;
  proposals: typeof proposals;
  reviews: typeof reviews;
  users: typeof users;
  "utils/geo": typeof utils_geo;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
