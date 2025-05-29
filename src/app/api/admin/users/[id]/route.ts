// pages/api/admin/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react'; // Or from 'next-auth' if using getServerSession

interface UpdateUserPayload {
  fullName?: string;
  defUserTypeId?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req }); // Or await getServerSession(req, res, authOptions);

  if (!session || (session.user as any)?.role !== 'admin') { // Customize role check as needed
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const { fullName, defUserTypeId } = req.body as UpdateUserPayload;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'User ID is required.' });
      }

      if (!fullName && typeof defUserTypeId === 'undefined') {
        return res.status(400).json({ message: 'Nothing to update. Provide fullName or defUserTypeId.' });
      }
      
      const updatePayload: any = {};
      if (fullName) {
        updatePayload.fullName = fullName;
      }
      if (typeof defUserTypeId !== 'undefined') {
        updatePayload.defUserTypeId = defUserTypeId;
      }

      // Ensure your BACKEND_API_URL is set in .env.local or environment variables
      const backendApiUrl = process.env.BACKEND_API_URL;
      if (!backendApiUrl) {
        console.error('BACKEND_API_URL is not defined');
        return res.status(500).json({ message: 'Server configuration error.' });
      }

      // TODO: Retrieve an appropriate auth token if your backend API requires it
      // const authToken = session.accessToken; // Example if token is in session

      const backendResponse = await fetch(`${backendApiUrl}/api/Users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${authToken}`, // If backend needs auth
        },
        body: JSON.stringify(updatePayload),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        console.error('Backend API Error:', backendResponse.status, errorData);
        return res.status(backendResponse.status).json({ 
          message: `Failed to update user on backend: ${errorData.title || errorData.message || backendResponse.statusText}` 
        });
      }

      const updatedUser = await backendResponse.json();
      return res.status(200).json(updatedUser);

    } catch (error: any) {
      console.error('API Route Error:', error);
      return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}