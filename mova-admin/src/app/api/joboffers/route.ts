import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

/**
 * @summary Fetches all job offers.
 * @description This API route handler proxies GET requests to the backend service
 * to retrieve a list of all job offers. It forwards the client's `Authorization`
 * header to the backend for authentication.
 * @param {NextRequest} request The incoming request object from the client.
 * @returns {Promise<NextResponse>} A JSON response containing either an array of job offers
 * on success, or an error object on failure.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Read the Authorization header sent by the client (if any).
    const authHeader = request.headers.get('authorization');
    
    // Forward the GET request to the backend, including the Authorization header.
    const res = await fetch(`${BACKEND_URL}/job-offers`, {
      method: 'GET',
      headers: {
        // If authHeader is null, send an empty string to avoid undefined header value.
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    });

    // If backend responds with an error status, forward a JSON error and the same status.
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des offres' },
        { status: res.status }
      );
    }

    // Parse backend JSON response and return it to the client.
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log the server-side error for debugging and return a generic 500 response.
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * @summary Creates a new job offer.
 * @description This API route handler proxies POST requests to the backend service
 * to create a new job offer. It forwards the client's `Authorization` header
 * and the request body containing the new job offer's data.
 * @param {NextRequest} request The incoming request object from the client, expected to have a JSON body with job offer details.
 * @returns {Promise<NextResponse>} A JSON response containing the newly created job offer data
 * on success, or an error object on failure.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Read the JSON body sent by the client (new job offer data).
    const body = await request.json();
    // Read the Authorization header to forward to the backend.
    const authHeader = request.headers.get('authorization');
    
    // Forward the POST request to the backend with JSON body and auth header.
    const res = await fetch(`${BACKEND_URL}/job-offers`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // If backend returns an error, parse and forward the error payload and status.
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    // Parse successful response and return newly created job offer to the client.
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log and return a generic server error to the client.
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
