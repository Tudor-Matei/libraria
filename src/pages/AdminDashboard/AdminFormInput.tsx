import { FormikProps } from "formik";
import { ReactNode } from "react";

interface AdminFormInputParameters<T> {
  inputType?: React.HTMLInputTypeAttribute;
  required?: boolean;
  name: keyof T;
  label: string;
  placeholder?: string;
  formik: FormikProps<T>;
}

export default function AdminFormInput<T>({
  inputType = "text",
  required = true,
  name,
  label,
  placeholder = "",
  formik,
}: AdminFormInputParameters<T>) {
  return (
    <div>
      <label htmlFor={name as string}>
        {label + " "}
        {formik.touched[name] && formik.errors[name] ? (
          <span className="invalid-field-indicator">{formik.errors[name] as ReactNode}</span>
        ) : (
          formik.touched[name] && <img src="src/assets/checkmark.svg" />
        )}
      </label>
      <input
        {...formik.getFieldProps(name as string)}
        className={formik.touched[name] && formik.errors[name] ? "input--error" : ""}
        required={required}
        type={inputType}
        name={name as string}
        placeholder={placeholder}
      />
    </div>
  );
}
