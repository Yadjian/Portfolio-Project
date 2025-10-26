import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

/**
 * @summary Fetch all users.
 * @description Proxies GET requests to the backend to retrieve the list of admin users.
 * The client's Authorization header (if present) is forwarded to the backend.
 * @param {NextRequest} request Incoming request from the client.
 * @returns {Promise<NextResponse>} JSON response with users or an error.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Read Authorization header from the incoming request (if provided).
    const authHeader = request.headers.get('authorization');
    
    // Proxy the request to the backend users endpoint, forwarding auth when available.
    const response = await fetch(`${BACKEND_URL}/admin/users`, {
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    // If backend returns a non-2xx status, forward an error and the same status code.
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des utilisateurs' },
        { status: response.status }
      );
    }

    // Parse and return the backend JSON payload.
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log server-side error and return a generic 500 response to the client.
    console.error('Erreur API users:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * @summary Create a new user.
 * @description Proxies POST requests to the backend to create a new admin user.
 * The request body is forwarded as JSON and the Authorization header is preserved if present.
 * @param {NextRequest} request Incoming request expected to contain the new user data in JSON.
 * @returns {Promise<NextResponse>} JSON response with created user or an error.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Read Authorization header to forward and parse the incoming JSON body.
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    // Forward POST to backend with JSON body and auth header when present.
    const response = await fetch(`${BACKEND_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    // If backend returns an error status, forward its JSON payload and status code.
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Parse and return the successful backend response.
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log server-side error for debugging and return a generic 500 response.
    console.error('Erreur création utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
