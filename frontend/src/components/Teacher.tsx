import Header from "./teacher/Header";
import Problems from "./teacher/Problems";

const Teacher = () => {
  return (
    <main className="flex flex-col gap-y-4 pt-2">
      <Header />
      <Problems />
    </main>
  );
};

export default Teacher;
