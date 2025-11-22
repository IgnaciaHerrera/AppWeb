import { Injectable } from '@angular/core';

export interface ResultadoExtraido {
  nombre: string;
  valor: string;
  unidad: string;
  rangoReferencia: string;
  estado: 'normal' | 'alto' | 'bajo' | 'critico';
}

export interface ExamenExtraido {
  nombre: string;
  tipo: string;
  fecha: string;
  medico: string;
  resultados: ResultadoExtraido[];
}

interface TextoConPosicion {
  texto: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LineaAgrupada {
  y: number;
  texto: string;
  items: TextoConPosicion[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamenesPdfService {
  constructor() {}

  private fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  private async cargarPdfJs(): Promise<any> {
    if (!(window as any).pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    return (window as any).pdfjsLib;
  }

  // Extraer texto CON POSICIONES
  private async extraerTextoConPosiciones(file: File): Promise<TextoConPosicion[]> {
    const pdfjs = await this.cargarPdfJs();
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    const items: TextoConPosicion[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      for (const item of content.items) {
        if ('str' in item && item.str.trim()) {
          items.push({
            texto: item.str.trim(),
            x: item.transform[4],
            y: item.transform[5],
            width: item.width,
            height: item.height
          });
        }
      }
    }
    
    return items;
  }

  async extraerTextoPDF(file: File): Promise<string> {
    const pdfjs = await this.cargarPdfJs();
    const arrayBuffer = await this.fileToArrayBuffer(file);
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let texto = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      texto += content.items.map((i: any) => i.str).join(' ') + '\n';
    }
    return texto;
  }

  // Procesar PDF
  async procesarPDF(file: File): Promise<ExamenExtraido> {
    try {
      const itemsConPosicion = await this.extraerTextoConPosiciones(file);
      const textoCompleto = itemsConPosicion.map(i => i.texto).join(' ');
      
      console.log('Datos extraídos del PDF - Texto completo:', textoCompleto);
      console.log('Cantidad de items con posición:', itemsConPosicion.length);
      
      // VALIDACIÓN: Verificar que hay contenido
      if (!textoCompleto || textoCompleto.trim().length < 50) {
        console.error('PDF vacío o con muy poco contenido');
        throw new Error('PDF_VACIO');
      }
      
      const nombre = this.extraerNombreEstructural(itemsConPosicion, textoCompleto);
      const fecha = this.extraerFecha(textoCompleto);
      const medico = this.extraerMedico(textoCompleto);
      const resultados = this.extraerResultadosEstructural(itemsConPosicion, textoCompleto);

      console.log('Examen extraído - Nombre:', nombre);
      console.log('Examen extraído - Fecha:', fecha);
      console.log('Examen extraído - Médico:', medico);
      console.log('Examen extraído - Resultados:', resultados);

      // VALIDACIÓN: Verificar extracción mínima
      if (nombre === 'Examen de Laboratorio' && resultados.length === 0) {
        console.warn('No se pudo extraer el nombre del examen correctamente');
        console.warn('No se encontraron resultados');
        throw new Error('FORMATO_NO_RECONOCIDO');
      }

      if (!fecha || fecha === new Date().toISOString().split("T")[0]) {
        console.warn('No se pudo extraer la fecha del examen');
      }
      
      return {
        nombre,
        tipo: 'Laboratorio',
        fecha,
        medico,
        resultados
      };
    } catch (error) {
      console.error('Error al procesar PDF:', error);
      if (error instanceof Error) {
        if (error.message === 'PDF_VACIO') {
          throw new Error('El PDF está vacío o no se pudo leer el contenido');
        } else if (error.message === 'FORMATO_NO_RECONOCIDO') {
          throw new Error('El PDF no tiene el formato de examen médico esperado');
        }
      }
      throw error;
    }
  }

  // Agrupar items por líneas
  private agruparPorLineas(items: TextoConPosicion[]): LineaAgrupada[] {
    const lineas: LineaAgrupada[] = [];
    const tolerance = 5;
    
    const sortedItems = [...items].sort((a, b) => b.y - a.y);
    
    for (const item of sortedItems) {
      const existingLine = lineas.find(linea => 
        Math.abs(linea.y - item.y) < tolerance
      );
      
      if (existingLine) {
        existingLine.items.push(item);
      } else {
        lineas.push({
          y: item.y,
          items: [item],
          texto: ''
        });
      }
    }
    
    lineas.forEach(linea => {
      linea.items.sort((a, b) => a.x - b.x);
      linea.texto = linea.items.map(i => i.texto).join(' ');
    });
    
    return lineas;
  }

  // Extraer nombre estructural
  private extraerNombreEstructural(items: TextoConPosicion[], textoCompleto: string): string {
    const lineas = this.agruparPorLineas(items);
    
    const indiceSolicitud = lineas.findIndex(linea => 
      /Solicitud|:\s*\d{8}/.test(linea.texto)
    );
    
    const indiceTipoMuestra = lineas.findIndex(linea => 
      /Tipo\s+de\s+Muestra/i.test(linea.texto)
    );
    
    if (indiceSolicitud === -1 || indiceTipoMuestra === -1) {
      return this.extraerNombreFallback(textoCompleto);
    }
    
    const zonaTitulo = lineas.slice(indiceSolicitud + 1, indiceTipoMuestra);
    
    const candidatos = zonaTitulo
      .map(linea => linea.texto.trim())
      .filter(texto => {
        if (!/[A-ZÁÉÍÓÚÑ]{3,}/.test(texto)) return false;
        if (/^\d+$/.test(texto)) return false;
        if (/^\s*[A-Z]+\s*:/.test(texto)) return false;
        if (/\d+-\d+/.test(texto)) return false;
        
        const palabrasExcluidas = ['MARIA', 'ELENA', 'RODRIGUEZ', 'JOEL', 'REDROVAN', 
                                    'IMO', 'TOMA', 'MUESTRA', 'AGENDA', 'DIRECTOR', 
                                    'TECNICO', 'SOLICITUD', 'PROCEDENCIA', 'SOLICITANTE',
                                    'F.EXTRACCION', 'F.RECEPCION', 'RUT', 'NACIMIENTO',
                                    'EDAD', 'SEXO'];
        if (palabrasExcluidas.some(p => texto.includes(p))) return false;
        
        if (texto.length < 4 || texto.length > 60) return false;
        
        return true;
      });
    
    if (candidatos.length > 0) {
      const titulo = candidatos[0];
      return this.normalizarNombreExamen(titulo);
    }
    
    return this.extraerNombreFallback(textoCompleto);
  }

  // Fallback para nombre
  private extraerNombreFallback(texto: string): string {
    const patronNombre = /:\s*\d+\s+([A-ZÁÉÍÓÚÑ\s]{5,}?)\s+\d{2}\/\d{2}\/\d{4}/;
    const match = texto.match(patronNombre);
    
    if (match) {
      return this.normalizarNombreExamen(match[1].trim());
    }
    
    return "Examen de Laboratorio";
  }

  // Extraer resultados estructural
  private extraerResultadosEstructural(items: TextoConPosicion[], textoCompleto: string): ResultadoExtraido[] {
    const encabezados = this.identificarEncabezados(items);
    
    const nombresCol = this.extraerColumnaNombres(items, textoCompleto);
    const valoresCol = this.extraerColumnaValores(items, textoCompleto);
    const unidadesCol = this.extraerColumnaUnidades(items, textoCompleto);
    const rangosCol = this.extraerColumnaRangos(items, textoCompleto);
    
    return this.emparejarResultados(nombresCol, valoresCol, unidadesCol, rangosCol);
  }

  // Identificar encabezados
  private identificarEncabezados(items: TextoConPosicion[]): { [key: string]: number } {
    const encabezados: { [key: string]: number } = {};
    
    const palabrasClave = {
      'Examen': 'nombres',
      'Resultado': 'valores',
      'U.M': 'unidades',
      'U.M.': 'unidades',
      'Valores de Referencia': 'rangos',
      'Referencia': 'rangos'
    };
    
    for (const item of items) {
      for (const [palabra, columna] of Object.entries(palabrasClave)) {
        if (item.texto.includes(palabra)) {
          encabezados[columna] = item.y;
          break;
        }
      }
    }
    
    return encabezados;
  }

  // Extraer columna nombres
  private extraerColumnaNombres(items: TextoConPosicion[], textoCompleto: string): string[] {
    const lineas = this.agruparPorLineas(items);
    
    const indiceEncabezado = lineas.findIndex(linea => 
      /Examen|Resultado|U\.M\.|Valores\s+de\s+Referencia/i.test(linea.texto)
    );
    
    if (indiceEncabezado === -1) {
      return this.extraerNombresFallback(textoCompleto);
    }
    
    const nombres: string[] = [];
    const palabrasExcluidas = ['TIPO', 'MUESTRA', 'SUERO', 'METODO', 'FECHA', 'HORA', 
                               'EXTRACCION', 'RECEPCION', 'HEXOQUINASA', 'QUIMIOLUMINISCENCIA',
                               'VALIDADO', 'DIRECTOR', 'TECNICO'];
    
    for (let i = indiceEncabezado + 1; i < lineas.length; i++) {
      const linea = lineas[i];
      
      if (/Validado\s+por|Director\s+T[eé]cnico/i.test(linea.texto)) {
        break;
      }
      
      const palabrasMayusculas = linea.texto.match(/^([A-ZÁÉÍÓÚÑ]{3,}(?:\s+[A-ZÁÉÍÓÚÑ]{3,})*)/);
      
      if (palabrasMayusculas) {
        const candidato = palabrasMayusculas[1].trim();
        const esValido = !palabrasExcluidas.some(excluida => candidato.includes(excluida));
        const tieneNumeros = /\d+\.?\d*/.test(linea.texto);
        
        if (esValido && tieneNumeros) {
          nombres.push(this.normalizarNombreExamen(candidato));
        }
      }
    }
    
    return nombres;
  }

  // Fallback nombres
  private extraerNombresFallback(textoCompleto: string): string[] {
    const nombres: string[] = [];
    const patronZona = /\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+(.*?)\s+Tipo de Muestra/is;
    const match = textoCompleto.match(patronZona);
    
    if (match) {
      const palabras = match[1].match(/\b[A-ZÁÉÍÓÚÑ]{4,}\b/g) || [];
      const palabrasExcluidas = ['TIPO', 'MUESTRA', 'SUERO', 'METODO', 'FECHA', 'HORA'];
      
      for (const palabra of palabras) {
        if (!palabrasExcluidas.includes(palabra)) {
          nombres.push(this.normalizarNombreExamen(palabra));
        }
      }
    }
    
    return nombres;
  }

  // Extraer valores
  private extraerColumnaValores(items: TextoConPosicion[], textoCompleto: string): string[] {
    const valores: string[] = [];
    
    const patronValores = /Tipo de Muestra:\s*Suero\s+([\d\s\.]+?)\s+F\./is;
    const match = textoCompleto.match(patronValores);
    
    if (!match) return valores;
    
    const zonaValores = match[1].trim();
    const nums = zonaValores.split(/\s+/).filter(n => /^\d+(\.\d+)?$/.test(n));
    
    for (const num of nums) {
      const val = parseFloat(num);
      if (val >= 0.01 && val < 10000 && num.length <= 8) {
        valores.push(num);
      }
    }
    
    return valores;
  }

  // Extraer unidades
  private extraerColumnaUnidades(items: TextoConPosicion[], textoCompleto: string): string[] {
    const unidades: string[] = [];
    
    const patronUnidades = /U\.M\.?\s+(.*?)\s+\|?\s*Resultados\s+Anteriores/is;
    const match = textoCompleto.match(patronUnidades);
    
    if (!match) return unidades;
    
    const zonaUnidades = match[1].replace(/\s+/g, ' ').trim();
    
    const patronUnidad = /([a-zA-Zµμ]+\/[a-zA-Z]+|%|[a-zA-Z]{1,4}\/[a-zA-Z]{1,4})/g;
    const unidadesEncontradas = zonaUnidades.match(patronUnidad) || [];
    
    for (const unidad of unidadesEncontradas) {
      if (!/^(Resultados|Anteriores|Valores|Referencia|Metodo|Validado|Por)$/i.test(unidad)) {
        unidades.push(unidad);
      }
    }
    
    if (unidades.length === 0) {
      const simbolos = zonaUnidades.match(/%/g);
      if (simbolos) {
        unidades.push(...simbolos);
      }
    }
    
    return unidades;
  }

  // Extraer rangos
  private extraerColumnaRangos(items: TextoConPosicion[], textoCompleto: string): string[] {
    const rangos: string[] = [];
    
    const patronRangos = /Resultados\s+Anteriores\s+(.*?)\s+Valores\s+de\s+Referencia/is;
    const match = textoCompleto.match(patronRangos);
    
    if (!match) return rangos;
    
    const zonaRangos = match[1].replace(/\s+/g, ' ').trim();
    
    const patronRango = /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/g;
    let r;
    
    while ((r = patronRango.exec(zonaRangos)) !== null) {
      const min = parseFloat(r[1]);
      const max = parseFloat(r[2]);
      
      if (min < max && min >= 0 && max < 100000) {
        rangos.push(`${r[1]} - ${r[2]}`);
      }
    }
    
    return rangos;
  }

  // Emparejar resultados
  private emparejarResultados(
    nombres: string[], 
    valores: string[], 
    unidades: string[], 
    rangos: string[]
  ): ResultadoExtraido[] {
    const resultados: ResultadoExtraido[] = [];
    
    const cantidad = valores.length;
    
    if (cantidad === 0) {
      return resultados;
    }
    
    for (let i = 0; i < cantidad; i++) {
      const nombre = nombres[i] || `Examen ${i + 1}`;
      const valor = valores[i];
      const unidad = unidades[i] || '';
      const rango = rangos[i] || '';
      
      if (valor && valor.trim() !== '') {
        const resultado: ResultadoExtraido = {
          nombre,
          valor,
          unidad,
          rangoReferencia: rango,
          estado: this.determinarEstado(valor, rango)
        };
        
        resultados.push(resultado);
      }
    }
    
    return resultados;
  }

  private extraerFecha(texto: string): string {
    const patronFecha = /F\.\s*Extracci[oó]n:\s*(\d{2})\/(\d{2})\/(\d{4})/i;
    const match = texto.match(patronFecha);
    
    if (match) {
      const [_, dia, mes, anio] = match;
      return `${anio}-${mes}-${dia}`;
    }
    return new Date().toISOString().split("T")[0];
  }

  private extraerMedico(texto: string): string {
    const patronMedico = /Director\s+T[eé]cnico\s+DR[A]?\.\s+([A-ZÁÉÍÓÚÑ\s\-\.]+?)(?=\s+\[|\s+\d|$)/i;
    const match = texto.match(patronMedico);
    
    if (match) {
      return match[1].trim();
    }
    return "";
  }

  private normalizarNombreExamen(nombre: string): string {
    return nombre
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  private determinarEstado(valorStr: string, rango: string): 'normal' | 'alto' | 'bajo' | 'critico' {
    try {
      const valor = parseFloat(valorStr);
      const numeros = rango.match(/[\d.]+/g);
      
      if (!numeros || numeros.length < 2) return 'normal';
      
      const min = parseFloat(numeros[0]);
      const max = parseFloat(numeros[1]);
      
      if (valor < min) {
        return valor < (min * 0.5) ? 'critico' : 'bajo';
      } else if (valor > max) {
        return valor > (max * 1.5) ? 'critico' : 'alto';
      }
      
      return 'normal';
    } catch {
      return 'normal';
    }
  }
}