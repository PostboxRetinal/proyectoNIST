import CreateAuditForm from '../components/crudAuditory/CreateAuditForm';
import Navbar from "../components/reusable/NavBar";

export default function CreateAuditory() {
    return(

    <div>
        <Navbar />
        <div className="w-full max-w-6xl h-[80vh] justify-center p-4 mx-auto items-center">
            <CreateAuditForm />
        </div>
    </div>
    )
}

export { CreateAuditory };