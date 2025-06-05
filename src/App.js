import React, { useState } from "react";
import {
  login, register, getUsers, deleteUser,
  getExercises, createExercise, deleteExercise,
  getRoutines, createRoutine, deleteRoutine,
  getLogs, createLog, deleteLog
} from "./api";
import {
  Container, Box, Typography, TextField, Button, Paper, AppBar, Toolbar, Tabs, Tab, List, ListItem, ListItemText
} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function App() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [logs, setLogs] = useState([]);
  const [registerMode, setRegisterMode] = useState(false);

  // Formularios para crear entidades
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "cliente" });
  const [newExercise, setNewExercise] = useState({ name: "", type: "", muscle: "", equipment: "", difficulty: "", instructions: "" });
  const [newRoutine, setNewRoutine] = useState({ name: "", user_id: "" });
  const [newLog, setNewLog] = useState({ user_id: "", exercise_id: "", date: "", sets: "", reps: "", weight: "" });

  // Login y registro
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result && result.token) {
      setToken(result.token);
      setUser(result.user);
    } else {
      alert("Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // Solo admin puede elegir rol, clientes siempre serán 'cliente'
    const role = user && user.role === "admin" ? newUser.role : "cliente";
    const result = await register(name, email, password, role);
    if (result && result.id) {
      alert("Usuario registrado, ahora puedes iniciar sesión");
      setRegisterMode(false);
    } else {
      alert("Error al registrar usuario");
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    setUsers([]);
    setRoutines([]);
    setExercises([]);
    setLogs([]);
  };

  // CRUD Usuarios (solo admin)
  const fetchUsers = async () => setUsers(await getUsers(token));
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const role = user && user.role === "admin" ? newUser.role : "cliente";
    const created = await register(newUser.name, newUser.email, newUser.password, role);
    if (created) {
      alert("Usuario creado");
      setNewUser({ name: "", email: "", password: "", role: "cliente" });
      fetchUsers();
    }
  };
  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Eliminar usuario?")) {
      await deleteUser(id, token);
      fetchUsers();
    }
  };

  // CRUD Ejercicios
  const fetchExercises = async () => setExercises(await getExercises(token));
  const handleCreateExercise = async (e) => {
    e.preventDefault();
    const created = await createExercise(newExercise, token);
    if (created) {
      alert("Ejercicio creado");
      setNewExercise({ name: "", type: "", muscle: "", equipment: "", difficulty: "", instructions: "" });
      fetchExercises();
    }
  };
  const handleDeleteExercise = async (id) => {
    if (window.confirm("¿Eliminar ejercicio?")) {
      await deleteExercise(id, token);
      fetchExercises();
    }
  };

  // CRUD Rutinas
  const fetchRoutines = async () => {
    const allRoutines = await getRoutines(token);
    // Si es cliente, solo ve sus rutinas
    if (user && user.role !== "admin") {
      setRoutines(allRoutines.filter(r => String(r.user_id) === String(user.id)));
    } else {
      setRoutines(allRoutines);
    }
  };
  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    // Si es cliente, solo puede crear rutinas para sí mismo
    const routineData = user && user.role !== "admin"
      ? { ...newRoutine, user_id: user.id }
      : newRoutine;
    const created = await createRoutine(routineData, token);
    if (created) {
      alert("Rutina creada");
      setNewRoutine({ name: "", user_id: "" });
      fetchRoutines();
    }
  };
  const handleDeleteRoutine = async (id) => {
    if (window.confirm("¿Eliminar rutina?")) {
      await deleteRoutine(id, token);
      fetchRoutines();
    }
  };

  // CRUD Logs
  const fetchLogs = async () => {
    const allLogs = await getLogs(token);
    // Si es cliente, solo ve sus logs
    if (user && user.role !== "admin") {
      setLogs(allLogs.filter(l => String(l.user_id) === String(user.id)));
    } else {
      setLogs(allLogs);
    }
  };
  const handleCreateLog = async (e) => {
    e.preventDefault();
    // Si es cliente, solo puede crear logs para sí mismo
    const logData = user && user.role !== "admin"
      ? { ...newLog, user_id: user.id }
      : newLog;
    const created = await createLog(logData, token);
    if (created) {
      alert("Log creado");
      setNewLog({ user_id: "", exercise_id: "", date: "", sets: "", reps: "", weight: "" });
      fetchLogs();
    }
  };
  const handleDeleteLog = async (id) => {
    if (window.confirm("¿Eliminar log?")) {
      await deleteLog(id, token);
      fetchLogs();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <FitnessCenterIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Gym4ULSA</Typography>
          {user && (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>

      {!token ? (
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {registerMode ? "Registro" : "Iniciar sesión"}
          </Typography>
          <form onSubmit={registerMode ? handleRegister : handleLogin}>
            {registerMode && (
              <TextField
                label="Nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
            )}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {/* Solo admin puede elegir rol en el registro */}
            {user && user.role === "admin" && registerMode && (
              <TextField
                select
                label="Rol"
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                SelectProps={{ native: true }}
                fullWidth
                margin="normal"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </TextField>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {registerMode ? "Registrarse" : "Iniciar sesión"}
            </Button>
          </form>
          <Button
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => setRegisterMode(!registerMode)}
          >
            {registerMode ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </Button>
        </Paper>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Bienvenido, {user.name} ({user.email}) - Rol: {user.role}
          </Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            {/* Solo admin puede ver la pestaña de usuarios */}
            {user.role === "admin" && <Tab label="Usuarios" />}
            <Tab label="Rutinas" />
            <Tab label="Ejercicios" />
            <Tab label="Logs" />
          </Tabs>
          {/* Usuarios (solo admin) */}
          {tab === 0 && user.role === "admin" && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Crear usuario</Typography>
              <form onSubmit={handleCreateUser} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <TextField label="Nombre" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                <TextField label="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                <TextField label="Contraseña" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                <TextField
                  select
                  label="Rol"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  SelectProps={{ native: true }}
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                </TextField>
                <Button type="submit" variant="contained">Crear</Button>
              </form>
              <Button variant="contained" onClick={fetchUsers}>Ver usuarios</Button>
              <List>
                {users.map(u => (
                  <ListItem key={u.id} secondaryAction={
                    <Button color="error" onClick={() => handleDeleteUser(u.id)}>Eliminar</Button>
                  }>
                    <ListItemText primary={`${u.name} (${u.role})`} secondary={u.email} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          {/* Rutinas */}
          {(tab === 0 && user.role !== "admin") || (tab === 1 && user.role === "admin") ? (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Crear rutina</Typography>
              <form onSubmit={handleCreateRoutine} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <TextField label="Nombre" value={newRoutine.name} onChange={e => setNewRoutine({ ...newRoutine, name: e.target.value })} required />
                {/* Solo admin puede elegir user_id */}
                {user.role === "admin" && (
                  <TextField label="ID Usuario" value={newRoutine.user_id} onChange={e => setNewRoutine({ ...newRoutine, user_id: e.target.value })} required />
                )}
                <Button type="submit" variant="contained">Crear</Button>
              </form>
              <Button variant="contained" onClick={fetchRoutines}>Ver rutinas</Button>
              <List>
                {routines.map(r => (
                  <ListItem key={r.id} secondaryAction={
                    <Button color="error" onClick={() => handleDeleteRoutine(r.id)}>Eliminar</Button>
                  }>
                    <ListItemText primary={r.name} secondary={`ID: ${r.id} | Usuario: ${r.user_id}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : null}
          {/* Ejercicios */}
          {(tab === 1 && user.role !== "admin") || (tab === 2 && user.role === "admin") ? (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Crear ejercicio</Typography>
              <form onSubmit={handleCreateExercise} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                <TextField label="Nombre" value={newExercise.name} onChange={e => setNewExercise({ ...newExercise, name: e.target.value })} required />
                <TextField label="Tipo" value={newExercise.type} onChange={e => setNewExercise({ ...newExercise, type: e.target.value })} />
                <TextField label="Músculo" value={newExercise.muscle} onChange={e => setNewExercise({ ...newExercise, muscle: e.target.value })} />
                <TextField label="Equipo" value={newExercise.equipment} onChange={e => setNewExercise({ ...newExercise, equipment: e.target.value })} />
                <TextField label="Dificultad" value={newExercise.difficulty} onChange={e => setNewExercise({ ...newExercise, difficulty: e.target.value })} />
                <TextField label="Instrucciones" value={newExercise.instructions} onChange={e => setNewExercise({ ...newExercise, instructions: e.target.value })} />
                <Button type="submit" variant="contained">Crear</Button>
              </form>
              <Button variant="contained" onClick={fetchExercises}>Ver ejercicios</Button>
              <List>
                {exercises.map(e => (
                  <ListItem key={e.id} secondaryAction={
                    <Button color="error" onClick={() => handleDeleteExercise(e.id)}>Eliminar</Button>
                  }>
                    <ListItemText primary={e.name} secondary={`Tipo: ${e.type} | Músculo: ${e.muscle}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : null}
          {/* Logs */}
          {(tab === 2 && user.role !== "admin") || (tab === 3 && user.role === "admin") ? (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Crear log</Typography>
              <form onSubmit={handleCreateLog} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {/* Solo admin puede elegir user_id */}
                {user.role === "admin" && (
                  <TextField label="ID Usuario" value={newLog.user_id} onChange={e => setNewLog({ ...newLog, user_id: e.target.value })} required />
                )}
                <TextField label="ID Ejercicio" value={newLog.exercise_id} onChange={e => setNewLog({ ...newLog, exercise_id: e.target.value })} required />
                <TextField label="Fecha" value={newLog.date} onChange={e => setNewLog({ ...newLog, date: e.target.value })} required />
                <TextField label="Sets" value={newLog.sets} onChange={e => setNewLog({ ...newLog, sets: e.target.value })} />
                <TextField label="Reps" value={newLog.reps} onChange={e => setNewLog({ ...newLog, reps: e.target.value })} />
                <TextField label="Peso" value={newLog.weight} onChange={e => setNewLog({ ...newLog, weight: e.target.value })} />
                <Button type="submit" variant="contained">Crear</Button>
              </form>
              <Button variant="contained" onClick={fetchLogs}>Ver logs</Button>
              <List>
                {logs.map(l => (
                  <ListItem key={l.id} secondaryAction={
                    <Button color="error" onClick={() => handleDeleteLog(l.id)}>Eliminar</Button>
                  }>
                    <ListItemText
                      primary={`Ejercicio ID: ${l.exercise_id} | Sets: ${l.sets} | Reps: ${l.reps} | Peso: ${l.weight}`}
                      secondary={`Usuario: ${l.user_id} | Fecha: ${l.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : null}
        </Box>
      )}
    </Container>
  );
}

export default App;