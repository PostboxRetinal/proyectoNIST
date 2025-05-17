import UserManagementComponent from "../components/crudUsuario/UserManagementComponent";
import Navbar from "../components/shared/NavBar";

export default function UserManagement() {
    return(
        <div>
            <Navbar />
            <UserManagementComponent />
        </div> 
    )
}

export { UserManagement };