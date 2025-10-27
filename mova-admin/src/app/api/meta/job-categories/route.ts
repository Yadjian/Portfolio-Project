import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

/**
 * @summary Fetches all job categories.
 * @description This API route handler proxies GET requests to the backend service
 * to retrieve a list of all job categories. It forwards the client's `Authorization`
 * header to the backend for authentication.
 * @param {NextRequest} request The incoming request object from the client.
 * @returns {Promise<NextResponse>} A JSON response containing either an array of job categories
 * on success, or an error object on failure.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Read the Authorization header from the incoming request (if present).
    const authHeader = request.headers.get('authorization');
    
    // Proxy the request to the backend API endpoint for job categories.
    const response = await fetch(`${BACKEND_URL}/meta/job-categories`, {
      headers: {
        // Forward the Authorization header only if it exists.
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    // If the backend responds with a non-2xx status, forward an error with the same status.
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des catégories' },
        { status: response.status }
      );
    }

    // Parse the successful backend JSON response and return it to the client.
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log server-side error for debugging and return a generic 500 response to the client.
    console.error('Erreur API job-categories:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
