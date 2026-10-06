import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Tarea } from './tarea.model';
import { TareasComponent } from './tareas.component';
import { TareasService } from './tareas.service';

describe('TareasComponent', () => {
  let fixture: ComponentFixture<TareasComponent>;
  let tareasService: jasmine.SpyObj<TareasService>;

  const iniciales: Tarea[] = [
    { id: 1, titulo: 'Leer la guía de la clase 2' },
  ];

  const dosTareas: Tarea[] = [
  { id: 3, titulo: 'Hacer el taller de desarrollo' },
  { id: 4, titulo: 'Estudiar para el examen' },
  ];

  beforeEach(async () => {
    tareasService = jasmine.createSpyObj('TareasService', ['listar', 'crear', 'actualizar', 'eliminar']);
    tareasService.listar.and.returnValue(of(iniciales));

    await TestBed.configureTestingModule({
      imports: [TareasComponent],
      providers: [{ provide: TareasService, useValue: tareasService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TareasComponent);
    fixture.detectChanges();
  });

  function boton(fila: Element, texto: string): HTMLButtonElement | undefined {
  return Array.from(fila.querySelectorAll('button')).find(
    (b) => b.textContent?.trim() === texto,
  );
  }

  it('muestra el id y el título de cada tarea', () => {
    const elemento: HTMLElement = fixture.nativeElement;

    expect(elemento.querySelector('.numero')?.textContent).toContain('1');
    expect(elemento.querySelector('.titulo')?.textContent).toContain(
      'Leer la guía de la clase 2',
    );
    expect(tareasService.listar).toHaveBeenCalled();
  });

  it('agrega la tarea creada al hacer clic en Agregar', () => {
    tareasService.crear.and.returnValue(
      of({ id: 2, titulo: 'Preparar el entorno' }),
    );

    const elemento: HTMLElement = fixture.nativeElement;
    const input = elemento.querySelector('input');
    expect(input).not.toBeNull();
    input!.value = 'Preparar el entorno';
    elemento.querySelector('button')!.click();
    fixture.detectChanges();

    expect(tareasService.crear).toHaveBeenCalledWith('Preparar el entorno');
    const titulos = Array.from(elemento.querySelectorAll('.titulo')).map(
      (nodo) => nodo.textContent,
    );
    expect(titulos).toEqual([
      'Leer la guía de la clase 2',
      'Preparar el entorno',
    ]);
  });

  it('elimina la tarea al hacer clic en Eliminar', () => {
    tareasService.listar.and.returnValue(of(dosTareas));
    tareasService.eliminar.and.returnValue(of({ id: 3, titulo: 'Hacer el taller de desarrollo' }));
    fixture = TestBed.createComponent(TareasComponent);
    fixture.detectChanges();

    const elemento: HTMLElement = fixture.nativeElement;
    const fila = elemento.querySelector('li')!;
    boton(fila, 'Eliminar')!.click();
    fixture.detectChanges();

    expect(tareasService.eliminar).toHaveBeenCalledWith(3);
    const titulos = Array.from(elemento.querySelectorAll('.titulo')).map(
      (nodo) => nodo.textContent);
    expect(titulos).toEqual(['Estudiar para el examen'
    ]);
  });

  it('edita la tarea al hacer clic en Editar y luego en Guardar', () => {
    tareasService.listar.and.returnValue(of(dosTareas));
    tareasService.actualizar.and.returnValue(of({ id: 3, titulo: 'Titulo devuelto por backend' }));
    fixture = TestBed.createComponent(TareasComponent);
    fixture.detectChanges();

    const elemento: HTMLElement = fixture.nativeElement;
    const fila = elemento.querySelector('li')!;
    boton(fila, 'Editar')!.click();
    fixture.detectChanges();
    const input = fila.querySelector('input') as HTMLInputElement;
    input.value = 'Hacer el taller de desarrollo actualizado';
    boton(fila, 'Guardar')!.click();
    fixture.detectChanges();

    expect(tareasService.actualizar).toHaveBeenCalledWith(3, 'Hacer el taller de desarrollo actualizado');
    const titulos = Array.from(elemento.querySelectorAll('.titulo')).map(
      (nodo) => nodo.textContent);
    expect(titulos).toEqual(['Titulo devuelto por backend', 'Estudiar para el examen'
    ]);
  });

  it('quita la tarea de la lista cuando eliminar responde 404', () => {
    tareasService.listar.and.returnValue(of(dosTareas));
    tareasService.eliminar.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    fixture = TestBed.createComponent(TareasComponent);
    fixture.detectChanges();

    const elemento: HTMLElement = fixture.nativeElement;
    const fila = elemento.querySelector('li')!;
    boton(fila, 'Eliminar')!.click();
    fixture.detectChanges();

    expect(tareasService.eliminar).toHaveBeenCalledWith(3);
    const titulos = Array.from(elemento.querySelectorAll('.titulo')).map(
      (nodo) => nodo.textContent);
    expect(titulos).toEqual(['Estudiar para el examen'
    ]);
  });

  it('quita la tarea de la lista cuando guardar responde 404', () => {
    tareasService.listar.and.returnValue(of(dosTareas));
    tareasService.actualizar.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    fixture = TestBed.createComponent(TareasComponent);
    fixture.detectChanges();

    const elemento: HTMLElement = fixture.nativeElement;
    const fila = elemento.querySelector('li')!;
    boton(fila, 'Editar')!.click();
    fixture.detectChanges();
    const input = fila.querySelector('input') as HTMLInputElement;
    input.value = 'Hacer el taller de desarrollo actualizado';
    boton(fila, 'Guardar')!.click();
    fixture.detectChanges();

    expect(tareasService.actualizar).toHaveBeenCalledWith(3, 'Hacer el taller de desarrollo actualizado');
    const titulos = Array.from(elemento.querySelectorAll('.titulo')).map(
      (nodo) => nodo.textContent);
    expect(titulos).toEqual(['Estudiar para el examen'
    ]);
    expect(elemento.querySelector('li input')).toBeNull();
    expect(fixture.componentInstance.estadoEdicion()).toBeNull();
  });

});
