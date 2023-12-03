import { useState } from "react";
import "../../css/admin.css";
import { AdminPanelLayoutEnum } from "../../utils/AdminPanelLayoutEnum";
import ActionsLayout from "./ActionsLayout";
import BookAdderLayout from "./BookAdderLayout";
import LogInPage from "./LogInPage";

export default function AdminDashboard() {
  const [isAuthorised, setAuthorised] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<AdminPanelLayoutEnum>(AdminPanelLayoutEnum.DEFAULT);

  if (!isAuthorised) return <LogInPage setAuthorised={setAuthorised} />;

  return (
    <>
      <header className="admin-panel-header">
        <img className="nav__libraria-logo" src="src/assets/libraria-logo.svg" alt="Libraria logo" />
        <h3>Admin panel</h3>
      </header>
      <div className="admin-panel">
        {currentLayout === AdminPanelLayoutEnum.DEFAULT ? (
          <ActionsLayout setCurrentLayout={setCurrentLayout} />
        ) : (
          <>
            <button className="back-button" onClick={() => setCurrentLayout(AdminPanelLayoutEnum.DEFAULT)}>
              <img src="src/assets/arrow-left.svg" alt="Go Back" />
            </button>
            {currentLayout === AdminPanelLayoutEnum.ADD_BOOK ? <BookAdderLayout /> : null}
          </>
        )}
      </div>
    </>
  );
}
