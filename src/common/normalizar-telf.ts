import { BadRequestException } from '@nestjs/common';

export function normalizarTelefono(input: string): string {
  // Eliminar todo lo que no sea número
  const soloNumeros = input.replace(/\D/g, '');

  if (soloNumeros.length < 7) {
    throw new BadRequestException('El número ingresado no es válido');
  }

  return soloNumeros.slice(-7); // últimos 7 dígitos
}
