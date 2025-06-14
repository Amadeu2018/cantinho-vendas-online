
export interface EventFormData {
  nome: string;
  email: string;
  telefone: string;
  tipo_evento: string;
  data_evento: string;
  num_convidados: number;
  localizacao: string;
  mensagem?: string;
}

export default EventFormData;
