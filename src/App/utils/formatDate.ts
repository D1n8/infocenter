export const formatDate = (isoString: string) => {
  if (!isoString) return '';

  //   const secureIsoString =
  //     isoString.endsWith('Z') || isoString.includes('+') ? isoString : `${isoString}Z`;

  const date = new Date(isoString);

  // Выведет: "04.06.2026 18:41"
  return date
    .toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', '');
};
