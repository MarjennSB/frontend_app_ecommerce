export interface Product {
  id: number;
  usuario_id: number;
  usuario_nombres: string | null;
  usuario_apellido_paterno: string | null;
  usuario_apellido_materno: string | null;

  categoria_id: number;
  categoria_nombre: string | null;

  nombre: string;
  descripcion: string;
  precio: string;
  cantidad: number;

  codigo_barras: string;
  codigo_qr: string | null;

  fecha_vencimiento: string | null;
  estado: number;

  imagenes?: ProductImage[];

  created_at: string;
}

export interface ProductImage {
  id: number;
  ruta_imagen: string;
  estado: number;
  created_at: string;
}
