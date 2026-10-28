export const formatRentalSearchDate = (selectedDate) => {
  if (selectedDate === undefined || selectedDate === null || selectedDate === "") {
    return "";
  }

  const userDate = new Date(selectedDate);
  if (Number.isNaN(userDate.getTime())) return "";

  return userDate
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/(\d+)\/(\d+)\/(\d+),\s(\d+:\d+\s[AP]M)/, "$3-$1-$2 $4");
};
