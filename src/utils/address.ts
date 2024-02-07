import { useIntl } from "react-intl";

export const formatAddress = (info: {
  address?: string;
  zip?: string;
  city?: string;
  country?: string;
}) => {
  const { address, zip, city, country } = info;

  if (!address || !zip || !city || !country) return "Aucune adresse renseignée";
  return `${address}, ${zip} ${city}, ${country}`;
};
