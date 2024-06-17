import Answers from "./Answers"
import Header from "./Header"

const CheckAnswers = ({ id }: { id: number }) => {
    return <main className="flex flex-col gap-y-4 pt-2">
        <Header backUrl="/teacher"/>
        <Answers id={id}/>
    </main>
}

export default CheckAnswers