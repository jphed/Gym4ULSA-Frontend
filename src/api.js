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

export async function register(name, email, password) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation {
          createUser(name: "${name}", email: "${email}", password: "${password}") {
            id
            name
            email
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.createUser;
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
  return data.data.users || [];
}

export async function getRoutines(token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        query {
          routines {
            id
            name
            user_id
            created_at
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.routines || [];
}

export async function getExercises(token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        query {
          exercises {
            id
            name
            type
            muscle
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.exercises || [];
}

export async function getLogs(token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        query {
          exerciseLogs {
            id
            user_id
            exercise_id
            date
            sets
            reps
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.exerciseLogs || [];
}