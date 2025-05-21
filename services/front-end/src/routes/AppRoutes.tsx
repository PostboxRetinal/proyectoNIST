import { useRoutes } from 'react-router-dom'; 
import Login from '../pages/Login';
import Home from '../pages/Home';
import RegisterBussines from '../pages/RegisterBussines';
import RegisterUser from '../pages/RegisterUser';
import NewAuditory from '../pages/NewAuditory';
import AuditoryManagement from '../pages/AuditoryManagement';
import CreateAuditory from '../pages/CreateAuditory';
import ReportDashboard from '../pages/ReportDashboard';
import UserManagement from '../pages/UserManagement';
import AdminRoute from './AdminRoute';
import AuditoryPage from '../components/auditory/AuditoryPage';
import ReportDetailsView from '../pages/ReportDetailsView';

const AppRoutes = () => {
    const routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/newAuditory', element: <NewAuditory /> },
        { path: '/loginUser', element: <Login /> },
        { path: '/registerCompany', element: <RegisterBussines /> },
        { path: '/registerUser', element: <RegisterUser /> },
        { path: '/createauditory', element: <CreateAuditory /> },        
        { path: '/reportdashboard', element: <ReportDashboard /> },
        {path: '/auditory/:formId', element: <AuditoryPage />},
        {path: '/report-details/:id', element: <ReportDetailsView />},
        
        // Rutas protegidas para administradores
        { path: '/userManagement', element: (
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          ) 
        },
        { path: '/auditoryManagement', element: (
            <AdminRoute>
              <AuditoryManagement />
            </AdminRoute>
          ) 
        },
        // Otras rutas protegidas...
      

    ])

    return routes
}

export default AppRoutes;