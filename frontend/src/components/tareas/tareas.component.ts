import { Component, OnInit, inject, signal } from '@angular/core';
import { Tarea } from './tarea.model';
import { TareasService } from './tareas.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css',
})
export class TareasComponent implements OnInit {
  private readonly tareasService = inject(TareasService);
  tareas = signal<Tarea[]>([]);
  estadoEdicion = signal<number | null>(null);

  ngOnInit(): void {
    this.tareasService.listar().subscribe((tareas) => {
      this.tareas.set(tareas);
    });
  }
  crear(titulo: string) {
    this.tareasService.crear(titulo).subscribe((tarea) => {
      this.tareas.update((tareas) => [...tareas, tarea]);
    });
  }
  eliminar(id: number) {
  this.tareasService.eliminar(id).subscribe({
    next: () => {
      this.tareas.update((tareas) => [...tareas].filter((tarea) => tarea.id !== id));
    },
    error: (err) => {
      if (err.status === 404) {
        this.tareas.update((tareas) => [...tareas].filter((tarea) => tarea.id !== id));
      }
    },
  });
  }
  editar(id:number){
    this.estadoEdicion.set(id);
  }
  guardar(id:number, titulo:string){
    this.tareasService.actualizar(id, titulo).subscribe({
      next: (tarea) => {
        this.tareas.update((tareas) => [...tareas].map((t) => (t.id === id ? tarea : t)));
        this.estadoEdicion.set(null);
      },
      error: (err) => {
        if (err.status === 404) {
          this.tareas.update((tareas) => [...tareas].filter((tarea) => tarea.id !== id));
          this.estadoEdicion.set(null);
        }
      },
    });
  }
}
