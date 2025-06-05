import React, { useState } from "react";
import { login, register, getUsers, getRoutines, getExercises, getLogs } from "./api";
import {
  Container, Box, Typography, TextField, Button, Paper, AppBar, Toolbar, Tabs, Tab, List, ListItem, ListItemText, Divider
} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function App() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("carlos@example.com");
  const [password, setPassword] = useState("pass123");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [logs, setLogs] = useState([]);
  const [registerMode, setRegisterMode] = useState(false);

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
    const result = await register(name, email, password);
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

  const fetchUsers = async () => setUsers(await getUsers(token));
  const fetchRoutines = async () => setRoutines(await getRoutines(token));
  const fetchExercises = async () => setExercises(await getExercises(token));
  const fetchLogs = async () => setLogs(await getLogs(token));

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
            Bienvenido, {user.name} ({user.email})
          </Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Usuarios" />
            <Tab label="Rutinas" />
            <Tab label="Ejercicios" />
            <Tab label="Logs" />
          </Tabs>
          {tab === 0 && (
            <Paper sx={{ p: 2 }}>
              <Button variant="contained" onClick={fetchUsers}>Ver usuarios</Button>
              <List>
                {users.map(u => (
                  <ListItem key={u.id}>
                    <ListItemText primary={u.name} secondary={u.email} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          {tab === 1 && (
            <Paper sx={{ p: 2 }}>
              <Button variant="contained" onClick={fetchRoutines}>Ver rutinas</Button>
              <List>
                {routines.map(r => (
                  <ListItem key={r.id}>
                    <ListItemText primary={r.name} secondary={`ID: ${r.id} | Usuario: ${r.user_id}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          {tab === 2 && (
            <Paper sx={{ p: 2 }}>
              <Button variant="contained" onClick={fetchExercises}>Ver ejercicios</Button>
              <List>
                {exercises.map(e => (
                  <ListItem key={e.id}>
                    <ListItemText primary={e.name} secondary={`Tipo: ${e.type} | Músculo: ${e.muscle}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          {tab === 3 && (
            <Paper sx={{ p: 2 }}>
              <Button variant="contained" onClick={fetchLogs}>Ver logs</Button>
              <List>
                {logs.map(l => (
                  <ListItem key={l.id}>
                    <ListItemText
                      primary={`Ejercicio ID: ${l.exercise_id} | Sets: ${l.sets} | Reps: ${l.reps}`}
                      secondary={`Usuario: ${l.user_id} | Fecha: ${l.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}
    </Container>
  );
}

export default App;