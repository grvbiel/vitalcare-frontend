import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  People,
  CalendarMonth,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  AdminPanelSettings,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/api';
import { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboard();
        setDashboardData(data);
      } catch (err: any) {
        console.error('Erro ao carregar dashboard:', err);
        setError(err.response?.data?.message || 'Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !dashboardData) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || 'Não foi possível carregar os dados do dashboard.'}
      </Alert>
    );
  }

  // Cores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Dados para gráfico de pizza (status das consultas)
  const statusChartData = Object.entries(dashboardData.appointmentsByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }));

  // Dados para gráfico de barras (usuários por role)
  const roleChartData = Object.entries(dashboardData.usersByRole).map(([role, count]) => ({
    name: role === 'admin' ? 'Administradores' : 'Usuários',
    value: count,
  }));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard Administrativo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bem-vindo(a), {user?.name}! 🏥
          </Typography>
        </Box>
        <Chip
          icon={<AdminPanelSettings />}
          label="Administrador"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Alertas */}
      {dashboardData.alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {dashboardData.alerts.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.type}
              sx={{ mb: 1 }}
              icon={alert.type === 'warning' ? <Warning /> : <CheckCircle />}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardData.totalUsers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de Usuários
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarMonth sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardData.totalAppointments}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de Consultas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardData.appointmentsByStatus.agendadas}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consultas Agendadas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{dashboardData.metrics.appointmentsGrowth}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Crescimento Mensal
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Pizza - Status das Consultas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Status das Consultas
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Barras - Usuários por Role */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Usuários por Tipo
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={roleChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Linhas - Consultas por Mês */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Consultas por Mês
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData.charts.appointmentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Listas de Usuários e Consultas Recentes */}
      <Grid container spacing={3}>
        {/* Usuários Recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Usuários Recentes
            </Typography>
            <List>
              {dashboardData.recentUsers.slice(0, 5).map((user, index) => (
                <React.Fragment key={user.id}>
                  <ListItem>
                    <ListItemText
                      primary={user.name}
                      secondary={user.email}
                    />
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === 'admin' ? 'primary' : 'default'}
                    />
                  </ListItem>
                  {index < dashboardData.recentUsers.slice(0, 5).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Consultas Recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Consultas Recentes
            </Typography>
            <List>
              {dashboardData.recentAppointments.slice(0, 5).map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${appointment.doctorName} - ${appointment.specialty}`}
                      secondary={`Paciente: ${appointment.userName} | ${new Date(appointment.date).toLocaleDateString('pt-BR')}`}
                    />
                    <Chip
                      label={appointment.status}
                      size="small"
                      color={
                        appointment.status === 'realizada' ? 'success' :
                        appointment.status === 'agendada' ? 'warning' : 'default'
                      }
                    />
                  </ListItem>
                  {index < dashboardData.recentAppointments.slice(0, 5).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
