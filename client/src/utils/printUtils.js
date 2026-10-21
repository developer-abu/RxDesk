

const PAGE_HEIGHT = 1123;
const TOP_MARGIN = 45;
const BOTTOM_MARGIN = 57;
const PRINTABLE_HEIGHT = PAGE_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;

const PAGE1_HEADER_HEIGHT = 160;
const CONT_HEADER_HEIGHT = 45;
const MEDICINE_HEADER_HEIGHT = 40;
const STAMP_SIG_HEIGHT = 160;

const estimateTextHeight = (text) => {
  if (!text) return 20;
  const lineCount = text.split("\n").length;
  const approxWrapLines = Math.ceil(text.length / 85);
  const totalLines = Math.max(lineCount, approxWrapLines);
  return Math.max(24, totalLines * 20);
};

export const paginatePrescription = (prescriptionState) => {
  const {
    chiefComplaints,
    clinicalNotes,
    diagnosis,
    investigations,
    medicines = [],
    advice,
    followUp,
  } = prescriptionState;

  const validMedicines = medicines.filter((m) => m.name && m.name.trim() !== "");

  const contentItems = [];

  if (chiefComplaints?.trim()) {
    contentItems.push({
      type: "clinical",
      label: "CHIEF COMPLAINTS",
      text: chiefComplaints.trim(),
      estHeight: estimateTextHeight(chiefComplaints.trim()) + 16,
    });
  }
  if (clinicalNotes?.trim()) {
    contentItems.push({
      type: "clinical",
      label: "CLINICAL NOTES",
      text: clinicalNotes.trim(),
      estHeight: estimateTextHeight(clinicalNotes.trim()) + 16,
    });
  }
  if (diagnosis?.trim()) {
    contentItems.push({
      type: "clinical",
      label: "DIAGNOSIS",
      text: diagnosis.trim(),
      estHeight: estimateTextHeight(diagnosis.trim()) + 16,
    });
  }
  if (investigations?.trim()) {
    contentItems.push({
      type: "clinical",
      label: "INVESTIGATIONS",
      text: investigations.trim(),
      estHeight: estimateTextHeight(investigations.trim()) + 16,
    });
  }

  validMedicines.forEach((med, idx) => {
    const hasInstructions = Boolean(med.additionalInstructions?.trim());
    contentItems.push({
      type: "medicine",
      index: idx + 1,
      medicine: med,
      estHeight: hasInstructions ? 54 : 38,
    });
  });

  if (advice?.trim()) {
    contentItems.push({
      type: "advice",
      label: "ADVICE",
      text: advice.trim(),
      estHeight: estimateTextHeight(advice.trim()) + 16,
    });
  }
  if (followUp?.trim()) {
    contentItems.push({
      type: "followup",
      label: "FOLLOW-UP",
      text: followUp.trim(),
      estHeight: estimateTextHeight(followUp.trim()) + 16,
    });
  }

  const pages = [];
  let currentPageItems = [];
  let currentHeight = PAGE1_HEADER_HEIGHT;
  let isFirstPage = true;

  for (let i = 0; i < contentItems.length; i++) {
    const item = contentItems[i];
    const isMedicineItem = item.type === "medicine";
    const extraForMedicineHeader =
      isMedicineItem && !currentPageItems.some((x) => x.type === "medicine")
        ? MEDICINE_HEADER_HEIGHT
        : 0;

    const neededHeight = item.estHeight + extraForMedicineHeader;
    const isLastItem = i === contentItems.length - 1;
    const requiredEndSpace = isLastItem ? STAMP_SIG_HEIGHT : 0;

    if (currentHeight + neededHeight + requiredEndSpace > PRINTABLE_HEIGHT && currentPageItems.length > 0) {
      pages.push({
        pageNumber: pages.length + 1,
        isFirstPage,
        items: currentPageItems,
        hasStampSig: false,
      });

      currentPageItems = [item];
      currentHeight = CONT_HEADER_HEIGHT + neededHeight;
      isFirstPage = false;
    } else {
      currentPageItems.push(item);
      currentHeight += neededHeight;
    }
  }

  pages.push({
    pageNumber: pages.length + 1,
    isFirstPage,
    items: currentPageItems,
    hasStampSig: true,
  });

  return pages;
};
