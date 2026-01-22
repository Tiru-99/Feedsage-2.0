export const formatViews = (views: string | undefined): string => {
  if (!views) {
    throw new Error("No views to format");
  }
  const num = Number(views);

  if (isNaN(num) || num < 0) return views;

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return num.toString();
};

export function formatDateDMY(isoDate?: string | null): string {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    console.warn("Invalid date passed to formatDateDMY:", isoDate);
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
