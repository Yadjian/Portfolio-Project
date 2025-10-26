import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

/**
 * @summary Fetches a single user by their ID.
 * @description This API route handler proxies GET requests to the backend service
 * to retrieve a specific user's details.
 * @param {NextRequest} request The incoming request object.
 * @param {{ params: { id: string } }} context The context object containing the dynamic route parameter `id`.
 * @returns {Promise<NextResponse>} A JSON response containing the user data on success, or an error object on failure.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Extract the Authorization header from the incoming request (if present).
    const authHeader = request.headers.get('authorization');

    // Resolve the dynamic route params to obtain the user id.
    const { id } = await params;
    
    // Proxy the GET request to the backend service for the specific user.
    const response = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    // If the backend responded with a non-2xx status, forward a JSON error with the same status.
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: response.status }
      );
    }

    // Parse and return the backend JSON response.
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log the error server-side and return a generic 500 response.
    console.error('Erreur API user:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * @summary Updates a user's details.
 * @description This API route handler proxies PUT requests to the backend service
 * to update a specific user's information.
 * @param {NextRequest} request The incoming request object, expected to have a JSON body with the user data to update.
 * @param {{ params: { id: string } }} context The context object containing the dynamic route parameter `id`.
 * @returns {Promise<NextResponse>} A JSON response containing the updated user data on success, or an error object on failure.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Get authorization header to forward to the backend (if present).
    const authHeader = request.headers.get('authorization');

    // Resolve route params to get the user id.
    const { id } = await params;

    // Read and parse the incoming request body (expected JSON).
    const body = await request.json();
    
    // Forward the PUT request with JSON body to the backend.
    const response = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    // If backend returned an error, parse and forward that error and status.
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    // Return the successful updated user data from the backend.
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log server-side error and return a generic 500 response.
    console.error('Erreur mise à jour utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * @summary Deletes a user by their ID.
 * @description This API route handler proxies DELETE requests to the backend service to remove a specific user.
 * @param {NextRequest} request The incoming request object.
 * @param {{ params: { id: string } }} context The context object containing the dynamic route parameter `id`.
 * @returns {Promise<NextResponse>} A JSON response with a success message or an error object.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Forward authorization header if provided.
    const authHeader = request.headers.get('authorization');

    // Resolve the route params to obtain the user id to delete.
    const { id } = await params;
    
    // Send a DELETE request to the backend for the user.
    const response = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    // If deletion failed, forward the error status and message.
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: response.status }
      );
    }

    // Return a success message when deletion succeeds.
    return NextResponse.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    // Log and return a generic server error.
    console.error('Erreur suppression utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
