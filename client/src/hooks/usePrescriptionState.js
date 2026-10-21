

import { useCallback, useState } from "react";

const createEmptyMedicine = (id) => ({
  id,
  name: "",
  formulation: "",
  dose: "",
  route: "Oral",
  frequency: "",
  duration: "",
  additionalInstructions: "",
});

const getInitialState = () => ({

  selectedChamberId: "",

  patientName: "",
  age: "",
  ageUnit: "Years",
  sex: "",
  consultationDate: new Date().toISOString().split("T")[0],

  chiefComplaints: "",
  clinicalNotes: "",
  diagnosis: "",
  investigations: "",

  medicines: [createEmptyMedicine(1)],
  _nextMedicineId: 2,

  advice: "",
  followUp: "",
});

export const usePrescriptionState = () => {
  const [state, setState] = useState(getInitialState);

  const setField = useCallback((field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setSelectedChamberId = useCallback((id) => {
    setState((prev) => ({ ...prev, selectedChamberId: id }));
  }, []);

  const addMedicine = useCallback(() => {
    setState((prev) => {
      if (prev.medicines.length >= 20) return prev;
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
      if (prev.medicines.length <= 1) return prev;
      return {
        ...prev,
        medicines: prev.medicines.filter((m) => m.id !== id),
      };
    });
  }, []);

  const restoreMedicine = useCallback((medicine, index) => {

    setState((prev) => {
      const newMedicines = [...prev.medicines];
      newMedicines.splice(index, 0, medicine);
      return { ...prev, medicines: newMedicines };
    });
  }, []);

  const clearForm = useCallback(() => {
    setState(getInitialState());
  }, []);

  const hasContent = useCallback(() => {
    const s = state;
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

