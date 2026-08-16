export interface CepAddressResult {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  isSingleCityCep: boolean; // True when ViaCEP returns city without specific street
  error?: string | null;
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

export async function fetchAddressByCep(cep: string): Promise<CepAddressResult> {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return {
      cep: cleanCep,
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      isSingleCityCep: false,
      error: 'O CEP deve conter 8 dígitos.',
    };
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) {
      throw new Error('Falha na consulta do CEP');
    }

    const data = await response.json();

    if (data.erro) {
      return {
        cep: cleanCep,
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        isSingleCityCep: false,
        error: 'CEP não encontrado. Preencha o endereço manualmente.',
      };
    }

    const isSingleCityCep = !data.logradouro || data.logradouro.trim() === '';

    return {
      cep: data.cep || cleanCep,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      isSingleCityCep,
      error: null,
    };
  } catch (err: any) {
    return {
      cep: cleanCep,
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      isSingleCityCep: false,
      error: 'Não foi possível consultar o CEP. Preencha o endereço manualmente.',
    };
  }
}
