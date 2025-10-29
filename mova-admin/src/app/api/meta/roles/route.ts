import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

/**
 * Fetch all roles from the backend metadata API.
 * This handler proxies GET requests and forwards the Authorization header.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Forward Authorization header if provided by the client
    const authHeader = request.headers.get('authorization');
    
    // Proxy the request to the backend metadata endpoint
    const response = await fetch(`${BACKEND_URL}/meta/roles`, {
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    // If backend returned a non-2xx status, forward an error
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des rôles' },
        { status: response.status }
      );
    }

    // Parse and return the backend JSON response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log server-side error and return a generic 500 response
    console.error('Erreur API roles:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
