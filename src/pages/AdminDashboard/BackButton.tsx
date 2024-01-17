import { AdminPanelLayoutEnum } from "../../utils/AdminPanelLayoutEnum";

export default function BackButton({
  setCurrentLayout,
}: {
  setCurrentLayout: React.Dispatch<React.SetStateAction<AdminPanelLayoutEnum>>;
}) {
  return (
    <button className="back-button" onClick={() => setCurrentLayout(AdminPanelLayoutEnum.DEFAULT)}>
      <img src="src/assets/arrow-left.svg" alt="Go Back" />
    </button>
  );
}
