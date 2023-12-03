import { FormikErrors, FormikTouched, FormikValues } from "formik";

export default function checkIfFormIsValid(
  touchedFields: FormikTouched<FormikValues>,
  errors: FormikErrors<FormikValues>
): boolean {
  return Object.keys(touchedFields).length > 0 && Object.keys(errors).length === 0;
}
