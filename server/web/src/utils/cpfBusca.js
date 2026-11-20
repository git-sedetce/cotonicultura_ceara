function cpfBusca(cpf) {
  const digits = String(cpf).replace(/\D/g, "");
  if (digits.length !== 11) return null;

  return [
    digits,
    digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
  ];
}

module.exports = { cpfBusca };
