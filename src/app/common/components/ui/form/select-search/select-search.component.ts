import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralRepository } from '@app/core';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule], // ✅ Aquí se importa
})
export class SelectSearchComponent implements OnChanges {
  private _generalRepository = inject(GeneralRepository);
  public loading = signal<boolean>(false);
  public options = signal<any[]>([]);
  @Input() selectedOptions: any[] = [];
  @Input() label: string = 'nombre';
  @Input() value: string = 'id';
  @Input() campoBusqueda: string = '';
  @Input() multiSelect: boolean = false;
  @Input() notFoundText = 'Sin elementos';
  @Input() placeholder = 'Selecciona un elemento';
  @Input() endpoint: string = '';
  @Input() parametrosEndpoint: QueryParams;
  @Input({ required: true }) control!: FormControl;
  @Input() errors: { [key: string]: string } = {};

  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() valorBusqueda = new EventEmitter<string>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['parametrosEndpoint'].firstChange) {
      this._consultarData(this.parametrosEndpoint);
    }
  }

  emitirSeleccion(data: any) {
    this.selectionChange.emit(data);
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) {
      return null;
    }

    for (const key of Object.keys(this.control.errors)) {
      if (this.errors[key]) {
        return this.errors[key]; // Mensaje personalizado
      }
    }

    // Fallback genérico si no hay mensaje definido para la clave
    return 'Este campo no es válido.';
  }

  buscarPorValor(event?: any) {
    const excludedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (excludedKeys.includes(event?.key)) {
      return;
    }

    const valor = event?.target.value || '';
    this._consultarDataPorCampoBusqueda(valor);
  }

  busquedaInicial() {
    this._consultarDataPorCampoBusqueda('');
  }

  private _consultarData(valor: QueryParams) {
    return this._generalRepository
      .get(this.endpoint, valor)
      .pipe(
        tap(() => this.loading.set(true)),
        finalize(() => this.loading.set(false))
      )
      .subscribe((respuesta: any) => {
        if (respuesta.results) {
          this.options.set(respuesta.results);
        } else {
          this.options.set(respuesta);
        }
      });
  }

  private _consultarDataPorCampoBusqueda(valor: string) {
    return this._generalRepository
      .get(this.endpoint, {
        ...this.parametrosEndpoint,
        [this.campoBusqueda]: valor,
      })
      .pipe(
        tap(() => this.loading.set(true)),
        finalize(() => this.loading.set(false))
      )
      .subscribe((respuesta: any) => {
        if (respuesta.results) {
          this.options.set(respuesta.results);
        } else {
          this.options.set(respuesta);
        }
      });
  }
}
