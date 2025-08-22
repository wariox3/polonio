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

export interface ContenedorLista {
  id: number;
  rol: string;
  contenedor: string;
  contenedor_id: number;
  contenedor__nombre: string;
  contenedor__usuarios: number;
  contenedor__imagen: string;
  contenedor__schema_name: string;
  contenedor__reddoc: boolean;
  contenedor__ruteo: boolean;
  contenedor__plan_id: number;
  contenedor__plan__nombre: string;
  contenedor__plan__usuarios_base: number;
  usuario_id: number;
  seleccion?: boolean;
  acceso_restringido: boolean;
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
