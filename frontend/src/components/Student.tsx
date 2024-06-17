import Header from "./student/Header";
import Problems from "./student/Problems";

const Student = () => {
  return (
    <div className="flex flex-col gap-y-4 pt-2">
      <Header />
      <Problems />
    </div>
  );
};

export default Student;
