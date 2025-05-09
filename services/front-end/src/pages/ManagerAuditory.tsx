import AuditoryMain from "../components/crudAuditory/AuditoryMain";
import Navbar from "../components/reusable/NavBar";

export default function Mainauditory() {
    return(
        <div>
            <Navbar />
            <AuditoryMain />
        </div> 
    )
}

export { Mainauditory };