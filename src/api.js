const API_URL = process.env.REACT_APP_API_URL || "https://gym4ulsa-api-production.up.railway.app/graphql";

// --- AUTH ---
export async function login(email, password) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation {
          login(email: "${email}", password: "${password}") {
            token
            user { id name email role }
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.login;
}

// Permite enviar el rol solo si se especifica (solo admin debe enviarlo)
export async function register(name, email, password, role) {
  const rolePart = role ? `, role: "${role}"` : "";
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation {
          createUser(name: "${name}", email: "${email}", password: "${password}"${rolePart}) {
            id
            name
            email
            role
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.createUser;
}

// --- USERS ---
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
            is_deleted
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.users || [];
}

export async function updateUser(id, fields, token) {
  const setFields = Object.entries(fields)
    .map(([k, v]) => v !== undefined ? `${k}: "${v}"` : "")
    .filter(Boolean)
    .join(", ");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          updateUser(id: ${id}, ${setFields}) {
            id
            name
            email
            is_deleted
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.updateUser;
}

export async function deleteUser(id, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          deleteUser(id: ${id})
        }
      `
    })
  });
  const data = await res.json();
  return data.data.deleteUser;
}

// --- EXERCISES ---
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
            equipment
            difficulty
            instructions
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.exercises || [];
}

export async function createExercise(fields, token) {
  const setFields = Object.entries(fields)
    .map(([k, v]) => v !== undefined ? `${k}: "${v}"` : "")
    .filter(Boolean)
    .join(", ");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          createExercise(${setFields}) {
            id
            name
            type
            muscle
            equipment
            difficulty
            instructions
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.createExercise;
}

export async function updateExercise(id, fields, token) {
  const setFields = Object.entries(fields)
    .map(([k, v]) => v !== undefined ? `${k}: "${v}"` : "")
    .filter(Boolean)
    .join(", ");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          updateExercise(id: ${id}, ${setFields}) {
            id
            name
            type
            muscle
            equipment
            difficulty
            instructions
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.updateExercise;
}

export async function deleteExercise(id, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          deleteExercise(id: ${id})
        }
      `
    })
  });
  const data = await res.json();
  return data.data.deleteExercise;
}

// --- ROUTINES ---
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

export async function createRoutine(fields, token) {
  const setFields = Object.entries(fields)
    .map(([k, v]) => v !== undefined ? `${k}: "${v}"` : "")
    .filter(Boolean)
    .join(", ");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          createRoutine(${setFields}) {
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
  return data.data.createRoutine;
}

export async function updateRoutine(id, fields, token) {
  const setFields = Object.entries(fields)
    .map(([k, v]) => v !== undefined ? `${k}: "${v}"` : "")
    .filter(Boolean)
    .join(", ");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          updateRoutine(id: ${id}, ${setFields}) {
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
  return data.data.updateRoutine;
}

export async function deleteRoutine(id, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          deleteRoutine(id: ${id})
        }
      `
    })
  });
  const data = await res.json();
  return data.data.deleteRoutine;
}

// --- LOGS ---
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
            weight
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.exerciseLogs || [];
}

export async function createLog(fields, token) {
  const setFields = Object.entries(fields)
    .map(([k, v]) => v !== undefined ? `${k}: "${v}"` : "")
    .filter(Boolean)
    .join(", ");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          createExerciseLog(${setFields}) {
            id
            user_id
            exercise_id
            date
            sets
            reps
            weight
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.createExerciseLog;
}

export async function updateLog(id, fields, token) {
  const setFields = Object.entries(fields)
    .map(([k, v]) => v !== undefined ? `${k}: "${v}"` : "")
    .filter(Boolean)
    .join(", ");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          updateExerciseLog(id: ${id}, ${setFields}) {
            id
            user_id
            exercise_id
            date
            sets
            reps
            weight
          }
        }
      `
    })
  });
  const data = await res.json();
  return data.data.updateExerciseLog;
}

export async function deleteLog(id, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      query: `
        mutation {
          deleteExerciseLog(id: ${id})
        }
      `
    })
  });
  const data = await res.json();
  return data.data.deleteExerciseLog;
}