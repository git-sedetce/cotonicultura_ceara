const palavrasMinusculas = [
  'da', 'de', 'do', 'das', 'dos', 'e', 'a', 'ao'
];

function formatarTextoPtBr(texto) {
  if (!texto || typeof texto !== 'string') return texto;

  return texto
    .toLowerCase()
    .split(' ')
    .map((palavra, index) => {
      if (palavrasMinusculas.includes(palavra) && index !== 0) {
        return palavra;
      }
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(' ');
}

module.exports = formatarTextoPtBr;
