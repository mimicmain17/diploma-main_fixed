import Header from "@/components/teacher/Header";
import CreateProblemForm from "./CreateProblemForm";

const CreateProblem = () => {
    return <main className="flex flex-col gap-y-4 pt-2">
        <Header backUrl="/teacher"/>
        <CreateProblemForm />
    </main>
}

export default CreateProblem;