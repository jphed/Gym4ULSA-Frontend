const API_URL = process.env.REACT_APP_API_URL || "https://gym4ulsa-api-production.up.railway.app/graphql";

export async function login(email, password) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation {
          login(email: "${email}", password: "${password}") {
            token
            user { id name email }
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.login;
}

export async function getUsers(token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        query {
          users {
            id
            name
            email
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.users;
}