import { FormikProps } from "formik";
import BookAdderFormStateType from "./BookAdderFormStateType";

interface AdminFormInputParameters {
  inputType?: React.HTMLInputTypeAttribute;
  required?: boolean;
  name: keyof BookAdderFormStateType;
  label: string;
  placeholder?: string;
  formik: FormikProps<BookAdderFormStateType>;
}

export default function AdminFormInput({
  inputType = "text",
  required = true,
  name,
  label,
  placeholder = "",
  formik,
}: AdminFormInputParameters) {
  return (
    <div>
      <label htmlFor={name}>
        {label + " "}
        {formik.touched[name] && formik.errors[name] ? (
          <span className="invalid-field-indicator">{formik.errors[name]}</span>
        ) : (
          formik.touched[name] && <img src="src/assets/checkmark.svg" />
        )}
      </label>
      <input
        {...formik.getFieldProps(name)}
        className={formik.touched[name] && formik.errors[name] ? "input--error" : ""}
        required={required}
        type={inputType}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
}
