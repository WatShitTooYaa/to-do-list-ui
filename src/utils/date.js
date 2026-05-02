export const formatToday = () =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
  }).format(new Date())
