import { PageLayout } from "layouts";
import { useNavigate } from "react-router-dom";

export const Quotes = () => {
  const navigate = useNavigate();

  const handleGenerate = () => {
    navigate("/quote/generate/caa395c6-63f2-4a9c-b15d-02afd33d87ea");
  };
  return (
    <PageLayout>
      <h1>Quotes</h1>
      <button onClick={handleGenerate}>Go to Quote Generate</button>
    </PageLayout>
  );
};
