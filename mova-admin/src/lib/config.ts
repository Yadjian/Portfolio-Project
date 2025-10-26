/**
 * @file Centralizes the application's configuration.
 * @description This file exports environment variables and other configuration constants.
 */

/**
 * The base URL for the backend API.
 * Falls back to a local development URL if the environment variable is not set.
 * @type {string}
 */
export const BACKEND_URL: string = process.env.BACKEND_URL || 'http://localhost:3000';
