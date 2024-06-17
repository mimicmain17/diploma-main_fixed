"use client";
import Answer from "@/components/student/Answer";

const AnswerPage = ({ params }: { params: { id: string } }) => {
  return <Answer id={params.id} />;
};

export default AnswerPage;
