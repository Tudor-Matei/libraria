import { AdminPanelLayoutEnum } from "../../../utils/AdminPanelLayoutEnum";

export default function ActionsLayout({
  setCurrentLayout,
}: {
  setCurrentLayout: React.Dispatch<React.SetStateAction<AdminPanelLayoutEnum>>;
}) {
  return (
    <>
      <h1>Actions</h1>
      <section className="actions">
        <button
          className="actions__action primary-button"
          onClick={() => setCurrentLayout(AdminPanelLayoutEnum.ADD_BOOK)}
        >
          Add a new book
        </button>
        <button
          className="actions__action primary-button"
          onClick={() => setCurrentLayout(AdminPanelLayoutEnum.EDIT_BOOK)}
        >
          Edit a book's details
        </button>
        <button
          className="actions__action primary-button"
          onClick={() => setCurrentLayout(AdminPanelLayoutEnum.DELETE_BOOK)}
        >
          Delete a book
        </button>
      </section>
    </>
  );
}
