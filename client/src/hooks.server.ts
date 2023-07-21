import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
  handleCors(event);

  const response = await resolve(event);
  return response;
}) satisfies Handle;

function handleCors(request: any) {
  const headers = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  if (request.method === "OPTIONS") {
    return {
      status: 200,
      headers,
    };
  }

  return {
    headers,
  };
}
