import type { PageLoad } from "./$types";

export const load = (() => {
  async function getCurrentUser() {
    const url = "http://localhost:8080/user";
    const res = await fetch(url, {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return {
        username: data.username,
      };
    }
  }

  return getCurrentUser();
}) satisfies PageLoad;
