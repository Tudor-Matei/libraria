import { useState } from "react";
import "../../css/admin.css";
import { AdminPanelLayoutEnum } from "../../utils/AdminPanelLayoutEnum";
import LogInPage from "./LogInPage";
import ActionsLayout from "./layouts/ActionsLayout";
import BookAdderLayout from "./layouts/BookAdderLayout";
import BookEditorLayout from "./layouts/BookEditorLayout";
import BookRemoverLayout from "./layouts/BookRemoverLayout";

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
        ) : currentLayout === AdminPanelLayoutEnum.ADD_BOOK ? (
          <BookAdderLayout setCurrentLayout={setCurrentLayout} />
        ) : currentLayout === AdminPanelLayoutEnum.EDIT_BOOK ? (
          <BookEditorLayout setCurrentLayout={setCurrentLayout} />
        ) : (
          <BookRemoverLayout setCurrentLayout={setCurrentLayout} />
        )}
      </div>
    </>
  );
}
