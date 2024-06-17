const faculties = [
  { key: "AIandML", label: "ИИ и машинное обучение" },
  { key: "cybersecurity", label: "Кибербезопасность" },
  { key: "networks", label: "Сетевые технологии и коммуникации" },
  { key: "bioInformatics", label: "Биоинформатика и медицинские IT" },
  { key: "VRandAR", label: "Виртуальная и дополненная реальность" },
  { key: "quantInformatics", label: "Квантовая информатика" },
  { key: "digitalArt", label: "Цифровое искусство" },
];

export default faculties;

export const getKeyValue = (key: string) => {
  return faculties.find((faculty) => faculty.key === key);
};
