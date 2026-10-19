/**
 * usePrescriptionState.js
 *
 * ALL temporary prescription data lives here — in React state only.
 *
 * Privacy guarantee enforced by this hook:
 *  - Data is NEVER written to localStorage, sessionStorage, IndexedDB,
 *    URL params, or sent to any API endpoint.
 *  - Refreshing or closing the tab clears everything — by design.
 *  - The interceptor in apiClient.js blocks any accidental transmission.
 *
 * This hook is the single source of truth for the prescription form.
 * The preview component reads from it; the print function reads from it.
 */

import { useCallback, useState } from "react";

/* ---- Default / empty prescription state ---- */
const createEmptyMedicine = (id) => ({
  id,               // local key only — never sent to server
  name: "",
  formulation: "",
  dose: "",
  route: "Oral",
  frequency: "",
  duration: "",
  additionalInstructions: "",
});

const getInitialState = () => ({
  /* Chamber selection — only the ID is stored; details fetched from cached chamber list */
  selectedChamberId: "",

  /* Patient information */
  patientName: "",
  age: "",
  ageUnit: "Years",       // "Years" | "Months" | "Days"
  sex: "",                // "Male" | "Female" | "Other"
  consultationDate: new Date().toISOString().split("T")[0], // today YYYY-MM-DD

  /* Clinical information */
  chiefComplaints: "",
  clinicalNotes: "",
  diagnosis: "",
  investigations: "",

  /* Medicines — array of medicine entry objects */
  medicines: [createEmptyMedicine(1)],
  _nextMedicineId: 2,     // internal counter for stable keys

  /* Advice and follow-up */
  advice: "",
  followUp: "",
});

/* ---------------------------------------------------------------- */

export const usePrescriptionState = () => {
  const [state, setState] = useState(getInitialState);

  /* ------ Field updaters ------ */

  const setField = useCallback((field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setSelectedChamberId = useCallback((id) => {
    setState((prev) => ({ ...prev, selectedChamberId: id }));
  }, []);

  /* ------ Medicine entry management ------ */

  const addMedicine = useCallback(() => {
    setState((prev) => {
      if (prev.medicines.length >= 20) return prev; // cap per spec
      const newEntry = createEmptyMedicine(prev._nextMedicineId);
      return {
        ...prev,
        medicines: [...prev.medicines, newEntry],
        _nextMedicineId: prev._nextMedicineId + 1,
      };
    });
  }, []);

  const updateMedicine = useCallback((id, field, value) => {
    setState((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  }, []);

  const removeMedicine = useCallback((id) => {
    setState((prev) => {
      if (prev.medicines.length <= 1) return prev; // keep at least one entry
      return {
        ...prev,
        medicines: prev.medicines.filter((m) => m.id !== id),
      };
    });
  }, []);

  const restoreMedicine = useCallback((medicine, index) => {
    // Undo: re-insert the removed entry at its original position
    setState((prev) => {
      const newMedicines = [...prev.medicines];
      newMedicines.splice(index, 0, medicine);
      return { ...prev, medicines: newMedicines };
    });
  }, []);

  /* ------ Clear form ------ */

  const clearForm = useCallback(() => {
    setState(getInitialState());
  }, []);

  /* ------ Derived helpers ------ */

  /**
   * Returns true if the form has content beyond default values.
   * Used by the leave guard and Clear Form button enabled state.
   */
  const hasContent = useCallback(() => {
    const s = state; // captured snapshot — not reactive inside callback
    return (
      s.patientName.trim() !== "" ||
      s.age.trim() !== "" ||
      s.sex !== "" ||
      s.chiefComplaints.trim() !== "" ||
      s.clinicalNotes.trim() !== "" ||
      s.diagnosis.trim() !== "" ||
      s.investigations.trim() !== "" ||
      s.advice.trim() !== "" ||
      s.followUp.trim() !== "" ||
      s.medicines.some(
        (m) =>
          m.name.trim() !== "" ||
          m.formulation.trim() !== "" ||
          m.dose.trim() !== "" ||
          m.frequency.trim() !== "" ||
          m.duration.trim() !== "" ||
          m.additionalInstructions.trim() !== ""
      )
    );
  }, [state]);

  /**
   * Validate before printing.
   * Returns an array of error messages; empty array = valid.
   * Spec §12.8: required to print = chamber + patient name + age + sex + date + ≥1 named medicine
   */
  const validate = useCallback(() => {
    const errors = [];
    if (!state.selectedChamberId) errors.push("chamber");
    if (!state.patientName.trim()) errors.push("patientName");
    if (!state.age.trim()) errors.push("age");
    if (!state.sex) errors.push("sex");
    if (!state.consultationDate) errors.push("consultationDate");

    const hasNamedMedicine = state.medicines.some((m) => m.name.trim() !== "");
    if (!hasNamedMedicine) errors.push("medicines");

    return errors;
  }, [state]);

  return {
    state,
    setField,
    setSelectedChamberId,
    addMedicine,
    updateMedicine,
    removeMedicine,
    restoreMedicine,
    clearForm,
    hasContent,
    validate,
    createEmptyMedicine,
  };
}

