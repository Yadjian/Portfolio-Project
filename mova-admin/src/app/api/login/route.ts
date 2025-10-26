import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

/**
 * @summary Handles user login.
 * @description This function handles POST requests to `/api/login`. It acts as a proxy,
 * forwarding the login credentials (email and password) to the backend service for authentication.
 * @param {NextRequest} request The incoming request object from the client, expected to have a JSON body with `email` and `password`.
 * @returns {Promise<NextResponse>} A JSON response containing authentication tokens (`accessToken`, `refreshToken`)
 * on success, or an error object on failure.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse JSON body from the incoming request (expected: { email, password }).
    const body = await request.json();
        
    // Proxy the credentials to the backend authentication endpoint.
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // If backend responds with a non-2xx status, return a generic authentication error.
    // This avoids exposing backend-specific error details to the client.
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: res.status }
      );
    }

    // Parse the successful backend response (expected tokens) and forward it to the client.
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log the error server-side for debugging and return a generic 500 response.
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
