

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatAgeSex, formatDate, abbreviateRoute, formatVisitingLine } from "./formatUtils";

export const generatePrescriptionPDF = (prescriptionState, chamber) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const {
    patientName,
    age,
    ageUnit,
    sex,
    consultationDate,
    chiefComplaints,
    clinicalNotes,
    diagnosis,
    investigations,
    medicines = [],
    advice,
    followUp,
  } = prescriptionState;

  const doctorName = chamber?.doctorName || "Doctor Name";
  const qualifications = chamber?.qualifications || "";
  const regNo = chamber?.registrationNo || "";
  const chamberName = chamber?.chamberName || "";
  const address = chamber?.address || "";
  const contactNumber = chamber?.contactNumber || "";
  const visitingLine = formatVisitingLine(
    chamber?.visitingDays,
    chamber?.visitingSessions || chamber?.visitingHours
  );

  const formattedDate = formatDate(consultationDate);
  const formattedAgeSex = formatAgeSex(age, ageUnit, sex);

  const leftMargin = 15;
  const contentWidth = 180;
  let cursorY = 12;

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text(doctorName, leftMargin, cursorY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (qualifications) {
    doc.text(qualifications, leftMargin, cursorY + 11);
  }
  if (regNo) {
    doc.setFont("helvetica", "bold");
    doc.text(`Reg. No.: ${regNo}`, leftMargin, cursorY + 16);
  }

  if (chamberName) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(chamberName.toUpperCase(), leftMargin + 105, cursorY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    let rightY = cursorY + 11;
    if (address) {
      const splitAddr = doc.splitTextToSize(address, 75);
      doc.text(splitAddr, leftMargin + 105, rightY);
      rightY += splitAddr.length * 4.5;
    }
    if (contactNumber) {
      doc.text(`Phone: ${contactNumber}`, leftMargin + 105, rightY);
      rightY += 4.5;
    }
    if (visitingLine) {
      doc.text(`Visiting: ${visitingLine}`, leftMargin + 105, rightY);
      rightY += 4.5;
    }
    cursorY = Math.max(cursorY + 22, rightY);
  } else {
    cursorY += 22;
  }

  cursorY += 2;
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(leftMargin, cursorY, leftMargin + contentWidth, cursorY);
  cursorY += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PATIENT NAME", leftMargin, cursorY);
  doc.text("AGE / SEX", leftMargin + 90, cursorY);
  doc.text("DATE", leftMargin + 145, cursorY);

  cursorY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(patientName || "—", leftMargin, cursorY);
  doc.text(formattedAgeSex || "—", leftMargin + 90, cursorY);
  doc.text(formattedDate || "—", leftMargin + 145, cursorY);

  cursorY += 2;
  doc.setLineWidth(0.2);
  doc.line(leftMargin, cursorY, leftMargin + contentWidth, cursorY);
  cursorY += 6;

  const addClinicalSection = (label, text) => {
    if (!text?.trim()) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label, leftMargin, cursorY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const split = doc.splitTextToSize(text.trim(), 146);
    doc.text(split, leftMargin + 34, cursorY);
    cursorY += Math.max(split.length * 5, 6) + 3;
  };

  addClinicalSection("CHIEF COMPLAINTS", chiefComplaints);
  addClinicalSection("CLINICAL NOTES", clinicalNotes);
  addClinicalSection("DIAGNOSIS", diagnosis);
  addClinicalSection("INVESTIGATIONS", investigations);

  const validMeds = medicines.filter((m) => m.name && m.name.trim() !== "");
  if (validMeds.length > 0) {
    cursorY += 2;
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("Rx", leftMargin, cursorY);
    cursorY += 2;

    const tableRows = validMeds.map((med, idx) => {
      let medText = med.name;
      if (med.formulation) medText += ` (${med.formulation})`;
      if (med.additionalInstructions) medText += `\nInstructions: ${med.additionalInstructions}`;

      return [
        (idx + 1).toString(),
        medText,
        med.dose || "—",
        abbreviateRoute(med.route || "Oral"),
        med.frequency || "—",
        med.duration || "—",
      ];
    });

    autoTable(doc, {
      startY: cursorY,
      margin: { left: leftMargin, right: leftMargin },
      head: [["No.", "Medicine", "Dose", "Route", "Frequency", "Duration"]],
      body: tableRows,
      theme: "plain",
      styles: {
        font: "helvetica",
        fontSize: 9.5,
        cellPadding: 2,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fontStyle: "bold",
        fontSize: 9,
        lineColor: [0, 0, 0],
        lineWidth: { top: 0.2, bottom: 0.3 },
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 70 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
      },
      didDrawPage: (data) => {
        cursorY = data.cursor.y;
      },
    });

    cursorY += 6;
  }

  addClinicalSection("ADVICE", advice);
  addClinicalSection("FOLLOW-UP", followUp);

  if (cursorY > 240) {
    doc.addPage();
    cursorY = 20;
  }

  const sigBoxY = Math.max(cursorY + 10, 245);
  const stampX = leftMargin + contentWidth - 135;

  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(stampX, sigBoxY, 60, 32);
  doc.setLineDashPattern([], 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text("Doctor's Stamp", stampX + 22, sigBoxY + 36);

  const sigX = stampX + 68;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(sigX, sigBoxY + 28, sigX + 67, sigBoxY + 28);
  doc.text("Doctor's Signature", sigX + 22, sigBoxY + 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(doctorName, sigX + 10, sigBoxY + 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text(
    "Valid only when signed and stamped by the doctor.",
    leftMargin + contentWidth / 2,
    sigBoxY + 44,
    { align: "center" }
  );

  return doc;
}
