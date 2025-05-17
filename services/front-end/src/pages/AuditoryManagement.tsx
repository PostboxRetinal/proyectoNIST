import AuditoryManagementComponent from "../components/crudAuditory/AuditoryManagementComponent";
import Navbar from "../components/shared/NavBar";

export default function AuditoryManagement() {
    return(
        <div>
            <Navbar />
            <AuditoryManagementComponent />
        </div> 
    )
}

export { AuditoryManagement };