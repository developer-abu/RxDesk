

export const formatDate = (isoString) => {
  if (!isoString) return "";
  const [year, month, day] = isoString.split("-");
  return `${day}/${month}/${year}`;
};

export const formatAge = (age, unit) => {
  if (!age) return "";
  const num = parseInt(age, 10);
  if (isNaN(num)) return "";
  const label = num === 1 ? unit.replace(/s$/, "") : unit;
  return `${num} ${label}`;
};

export const formatAgeSex = (age, ageUnit, sex) => {
  const ageStr = formatAge(age, ageUnit);
  if (!ageStr && !sex) return "";
  if (!ageStr) return sex;
  if (!sex) return ageStr;
  return `${ageStr} / ${sex}`;
};

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const formatVisitingDays = (days) => {
  if (!days || days.length === 0) return "";
  if (days.length === 7) return "Daily";

  const sorted = [...days].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );

  const groups = [];
  let runStart = 0;

  for (let i = 0; i <= sorted.length; i++) {
    const isEnd =
      i === sorted.length ||
      DAY_ORDER.indexOf(sorted[i]) !== DAY_ORDER.indexOf(sorted[i - 1]) + 1;

    if (isEnd && i > 0) {
      const runLength = i - runStart;
      if (runLength >= 3) {
        groups.push(`${sorted[runStart]}–${sorted[i - 1]}`);
      } else {
        for (let j = runStart; j < i; j++) {
          groups.push(sorted[j]);
        }
      }
      runStart = i;
    }
  }

  return groups.join(", ");
};

export const formatVisitingHours = (sessions) => {
  if (!sessions || sessions.length === 0) return "";
  return sessions
    .filter((s) => s.from && s.to)
    .map((s) => `${s.from} – ${s.to}`)
    .join(", ");
};

export const formatVisitingLine = (days, sessions) => {
  const daysStr = formatVisitingDays(days);
  const hoursStr =
    typeof sessions === "string" ? sessions : formatVisitingHours(sessions);
  if (!daysStr && !hoursStr) return "";
  if (!daysStr) return hoursStr;
  if (!hoursStr) return daysStr;
  return `${daysStr} · ${hoursStr}`;
};

const ROUTE_ABBR = {
  "Oral": "Oral",
  "Sublingual": "SL",
  "Topical": "Topical",
  "Intramuscular (IM)": "IM",
  "Intravenous (IV)": "IV",
  "Subcutaneous (SC)": "SC",
  "Inhalation": "Inh.",
  "Nasal": "Nasal",
  "Ophthalmic": "Eye",
  "Otic": "Ear",
  "Rectal": "PR",
  "Other": "Other",
};

export const abbreviateRoute = (route) => {
  return ROUTE_ABBR[route] || route;
};

export const extractLastName = (fullName) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1];
};

export const sanitizeText = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "");
};
