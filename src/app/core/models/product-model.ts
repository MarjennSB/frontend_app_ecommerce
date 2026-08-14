export interface Product {
  id: number;
  usuario_id: number;
  usuario_correo: string | null;

  categoria_id: number;
  categoria_nombre: string | null;

  marca_id: number;
  marca_nombre: string | null;

  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  
  precio_venta: string;
  precio_oferta: string | null;
  precio_compra_referencial: string | null;
  
  es_destacado: boolean;
  stock_actual: number;

  codigo_barras: string | null;
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
