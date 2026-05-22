import { AfterViewInit, Component } from '@angular/core';
import { Query } from '../services/query';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-ide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ide.html',
  styleUrl: './ide.css',
})
export class Ide {

  //implements AfterViewInit
  //sql: string = '';

  get sql() {
    return this.tabActiva?.sql || '';
  }

  set sql(value: string) {
    if (this.tabActiva) {
      this.tabActiva.sql = value;
    }
  }

  resultados: any[] = [];
  columnas: string[] = [];

  errorMsg: string = '';

  // Mostrar bases de datos
  databases: string[] = [];
  tablas: string[] = [];

  columnasTabla: string[] = [];
  sugerencias: string[] = [];

  editor: any;

  historial: any[] = [];
  contadorHistorial: number = 1;

  constructor(
    private queryService: Query,
    private router: Router
  ) { }

  ejecutar() {
    this.errorMsg = '';


    if (!this.sql.trim()) return;

    const inicio = performance.now();
    const query = this.sql;
    const hora = new Date().toLocaleTimeString();

    this.queryService.ejecutarSQL(query).subscribe({
      next: (res: any) => {

        const fin = performance.now();
        const tiempo = ((fin - inicio) / 1000).toFixed(3);
        //const hora = new Date().toLocaleTimeString();

        if (res.type === 'select') {
          this.resultados = res.data;

          if (res.data.length > 0) {
            this.columnas = Object.keys(res.data[0]);
          } else {
            //this.columnas = this.columnasTabla;
            const tabla = this.obtenerTablaDesdeSQL(query);

            if (tabla) {
              this.resultados = [];
              this.columnas = [];

              this.queryService.getColumns(tabla).subscribe(cols => {
                this.columnas = cols;
              });
            }
          }
        } else if (res.type === 'update') {
          this.resultados = [];
          this.columnas = [];

          this.errorMsg = '';

        } else if (res.type === 'error') {
          this.errorMsg = res.message;
        }

        this.historial.unshift({
          id: this.contadorHistorial++,
          time: tiempo + ' sec',
          action: query,
          message: res.message || (res.rows + ' rows'),
          //message: res.length + ' rows',
          horaseg: hora,

        });
      },
      error: () => {
        this.errorMsg = 'Error en la consulta';
      }
    });

  }

  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      this.ejecutar();
    }
  }

  ngOnInit() {

    // Consulta Base de datos
    this.queryService.getDatabases().subscribe(res => {
      this.databases = res;
    })

    // Consulta columnas de tablas
    this.queryService.getTables().subscribe((res) => {
      this.tablas = res;
    });
  }

  toggleTabla(db: string, tabla: string) {
    if (this.tablaExpandida === tabla) {
      this.tablaExpandida = null;
      return;
    }

    this.tablaExpandida = tabla;

    this.queryService.getColumns(tabla).subscribe(cols => {
      this.columnasPorTabla[tabla] = cols;

      // Mantener tu funcionalidad actual 👇
      this.sql = `SELECT ${cols.join(', ')} FROM ${tabla};`;
    });
  }

  onInputChange() {
    const texto = this.sql.toLowerCase();

    if (texto.endsWith('from ')) {
      this.sugerencias = this.tablas;
    } else {
      this.sugerencias = [];
    }
  }

  insertarSugerencias(s: string) {
    this.sql += s;
    this.sugerencias = [];
  }

  toggleDB(db: string) {
    if (this.dbExpandida === db) {
      this.dbExpandida = null;
      return;
    }

    this.dbExpandida = db;
    this.tablaExpandida = null;

    const query = `USE ${db};`;

    this.queryService.ejecutarSQL(query).subscribe(() => {
      this.queryService.getTables().subscribe(res => {
        this.tablasPorDB[db] = res;
      });
    });
  }

  cargarTablas() {
    this.queryService.getTables().subscribe(res => {
      this.tablas = res;
    });
  }

  obtenerTablaDesdeSQL(sql: string): string | null {
    const match = sql.match(/from\s+(\w+)/i);
    return match ? match[1] : null;
  }

  dbExpandida: string | null = null;
  tablaExpandida: string | null = null;

  // Nuevo: estructuras tipo mapa
  tablasPorDB: { [key: string]: string[] } = {};
  columnasPorTabla: { [key: string]: string[] } = {};

  // nueva pesataña
  tabs: any[] = [
    { id: 1, nombre: 'SQL File 1', sql: '' }
  ];

  tabActivaId: number = 1;
  contadorTabs: number = 2;

  agregarTab() {
    const nueva = {
      id: this.contadorTabs++,
      nombre: `SQL File ${this.contadorTabs - 1}`,
      sql: ''
    };

    this.tabs.push(nueva);
    this.tabActivaId = nueva.id;

  }

  cambiarTab(id: number) {
    this.tabActivaId = id;
  }

  get tabActiva() {
    return this.tabs.find(t => t.id === this.tabActivaId);
  }

  guardarScript() {
    const contenido = this.sql;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = this.tabActiva.nombre = '.txt';
    a.click();

    window.URL.revokeObjectURL(url);

  }

  //Cerrar pesta;a
  cerrarTab(id: number, event: MouseEvent) {
    event.stopPropagation(); // 🔥 evita cambiar de pestaña

    const index = this.tabs.findIndex(t => t.id === id);

    if (index === -1) return;

    this.tabs.splice(index, 1);

    // 👉 Si cerraste la pestaña activa
    if (this.tabActivaId === id) {

      if (this.tabs.length > 0) {
        // selecciona la anterior o la primera
        const nuevaIndex = index > 0 ? index - 1 : 0;
        this.tabActivaId = this.tabs[nuevaIndex].id;
      } else {
        // si no queda ninguna, crea una nueva
        this.agregarTab();
      }
    }
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/']);
  }

}
