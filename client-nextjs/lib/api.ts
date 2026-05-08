const BASE_URL = process.env.BASE_URL;

// For auto refresh token

export async function api(path: string, options: any = {}) {
  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = await res.json();

  // auto refresh if expired
  if (!data.success && data.message === "Unauthorized") {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    const refreshData = await refreshRes.json();

    if (!refreshData.success) {
      throw new Error("Session expired");
    }

    // retry original request
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: "include",
    });

    data = await res.json();
  }

  return data;
}