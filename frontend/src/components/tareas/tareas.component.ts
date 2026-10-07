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
  editandoId = signal<number | null>(null);
  error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.tareasService.listar().subscribe((tareas) => {
      this.tareas.set(tareas);
    });
  }

  crear(titulo: string) {
    this.tareasService.crear(titulo).subscribe((tarea) => {
      this.tareas.update((tareas) => [...tareas, tarea]);
    });
  }

  editar(id: number): void {
    this.error.set('');
    this.editandoId.set(id);
  }

  cancelar(): void {
    this.editandoId.set(null);
  }

  guardar(id: number, titulo: string): void {
    this.tareasService.actualizar(id, titulo).subscribe({
      next: (actualizada) => {
        this.tareas.update((tareas) =>
          tareas.map((t) => (t.id === actualizada.id ? actualizada : t)),
        );
        this.editandoId.set(null);
        this.error.set('');
      },
      error: (e) => this.manejarError(e.status, 'guardar'),
    });
  }

  eliminar(id: number): void {
    this.tareasService.eliminar(id).subscribe({
      next: (eliminada) => {
        this.tareas.update((tareas) =>
          tareas.filter((t) => t.id !== eliminada.id),
        );
        this.error.set('');
      },
      error: (e) => this.manejarError(e.status, 'eliminar'),
    });
  }

  private manejarError(status: number, accion: string): void {
    if (status === 404) {
      this.error.set('La tarea ya no existe. Se actualizó la lista.');
      this.editandoId.set(null);
      this.cargar();
    } else {
      this.error.set(`No se pudo ${accion} la tarea. Intenta de nuevo.`);
    }
  }
}