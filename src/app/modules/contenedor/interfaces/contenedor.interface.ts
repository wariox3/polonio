export interface Contenedor {
  id: number;
  usuario_id: number;
  contenedor_id: number;
  rol: string;
  subdominio: string;
  nombre: string;
  imagen: string;
  usuarios: number;
  usuarios_base: number;
  plan_id: number;
  plan_nombre: string;
  reddoc: boolean;
  ruteo: boolean;
  acceso_restringido: boolean;
  seleccion: boolean;
}

export interface ContenedorResponse {
  contenedores: Contenedor[];
}

export interface ConsultaContenedorResponse {
  usuarios: Usuario[];
}

export interface Usuario {
  id: number;
  contenedor_id: number;
  usuario_id: number;
  rol: string;
  username: string;
}

export interface InvitarUsuario {
  contenedor_id: number;
  usuario_id: string;
  invitado: string;
  accion: 'invitar';
}

export interface ConectarResponse {
  id: number;
  subdominio: string;
  nombre: string;
  plan_id: number;
  plan_usuarios_base: number;
  plan_limite_usuarios: number;
  plan_nombre: string;
  plan_venta: boolean;
  plan_compra: boolean;
  plan_tesoreria: boolean;
  plan_cartera: boolean;
  plan_inventario: boolean;
  plan_humano: boolean;
  plan_contabilidad: boolean;
  imagen: string;
  reddoc: boolean;
  ruteo: boolean;
  cortesia: boolean;
  usuario_id: number;
  acceso_restringido: boolean;
}
