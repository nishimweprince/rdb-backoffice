import moment from 'moment';

// FORMAT PHONE
export const formatPhone = (phone: string) => {
  if (!phone || phone === 'null') return '';
  return `250${phone?.slice(-9)}`;
};

// FORMAT DATE
export const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  return moment(date).format('YYYY-MM-DD');
};

// CAPITALIZE STRING
export const capitalizeString = (string: string | undefined | null) => {
  if (!string) return '';
  const isCamelCase = /^[a-z]+([A-Z][a-z]*)*$/.test(string);
  if (isCamelCase) return capitalizeCamelCase(string);
  const words = string?.toLowerCase()?.split('_');
  const capitalizedWords =
    words && words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords && capitalizedWords.join(' ');
};

// CAPITALIZE CAMEL CASE
export function capitalizeCamelCase(string: string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}
