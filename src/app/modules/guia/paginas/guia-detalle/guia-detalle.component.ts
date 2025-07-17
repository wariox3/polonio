import { Guia } from './../../interfaces/guia.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { GuiaRepository } from '../../repository/guia.repository';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guia-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guia-detalle.component.html',
  styleUrl: './guia-detalle.component.scss',
})
export default class GuiaDetalleComponent implements OnInit {
  private _vehiculoRepository = inject(GuiaRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  public guiaSignal = signal<Guia>({
    id: 0,
  });
  ngOnInit(): void {
    this.consultarInformacion();
  }
  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._vehiculoRepository.detalle(param.id);
        }),
        tap(detalle => this.guiaSignal.set(detalle))
      )
      .subscribe();
  }
}
