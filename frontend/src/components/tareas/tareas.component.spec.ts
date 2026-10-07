import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Tarea } from './tarea.model';
import { TareasComponent } from './tareas.component';
import { TareasService } from './tareas.service';

describe('TareasComponent', () => {
  let fixture: ComponentFixture<TareasComponent>;
  let tareasService: jasmine.SpyObj<TareasService>;

  const iniciales: Tarea[] = [
    { id: 1, titulo: 'Leer la guía de la clase 2' },
  ];

  beforeEach(async () => {
    tareasService = jasmine.createSpyObj('TareasService', ['listar', 'crear']);
    tareasService.listar.and.returnValue(of(iniciales));

    await TestBed.configureTestingModule({
      imports: [TareasComponent],
      providers: [{ provide: TareasService, useValue: tareasService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TareasComponent);
    fixture.detectChanges();
  });

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
});
describe('TareasComponent editar y eliminar', () => {
  let fixture: ComponentFixture<TareasComponent>;
  let tareasService: jasmine.SpyObj<TareasService>;
  let elemento: HTMLElement;

  const iniciales: Tarea[] = [
    { id: 1, titulo: 'Primera tarea' },
    { id: 2, titulo: 'Segunda tarea' },
  ];

  const boton = (texto: string): HTMLButtonElement =>
    Array.from(elemento.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === texto,
    )!;

  const titulos = (): (string | null)[] =>
    Array.from(elemento.querySelectorAll('.titulo')).map(
      (nodo) => nodo.textContent,
    );

  beforeEach(async () => {
    tareasService = jasmine.createSpyObj('TareasService', [
      'listar',
      'crear',
      'actualizar',
      'eliminar',
    ]);
    tareasService.listar.and.returnValue(of(iniciales));

    await TestBed.configureTestingModule({
      imports: [TareasComponent],
      providers: [{ provide: TareasService, useValue: tareasService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TareasComponent);
    elemento = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('edita el título de una tarea con Editar y Guardar', () => {
    tareasService.actualizar.and.returnValue(
      of({ id: 1, titulo: 'Título editado' }),
    );

    boton('Editar').click();
    fixture.detectChanges();

    const campo = elemento.querySelector<HTMLInputElement>('input.edicion');
    expect(campo).not.toBeNull();
    campo!.value = 'Título editado';
    boton('Guardar').click();
    fixture.detectChanges();

    expect(tareasService.actualizar).toHaveBeenCalledWith(1, 'Título editado');
    expect(titulos()).toEqual(['Título editado', 'Segunda tarea']);
  });

  it('elimina una tarea con Eliminar y deja las demás', () => {
    tareasService.eliminar.and.returnValue(
      of({ id: 1, titulo: 'Primera tarea' }),
    );

    boton('Eliminar').click();
    fixture.detectChanges();

    expect(tareasService.eliminar).toHaveBeenCalledWith(1);
    expect(titulos()).toEqual(['Segunda tarea']);
  });
});
