"use client";
import CheckAnswers from "@/components/teacher/CheckAnswers";

const CheckAnswersPage = ({ params }: { params: { id: number } }) => {
  return <CheckAnswers id={params.id} />;
};

export default CheckAnswersPage;
