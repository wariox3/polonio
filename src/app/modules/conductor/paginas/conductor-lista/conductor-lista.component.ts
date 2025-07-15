import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConductorService } from '@app/modules/conductor/servicios/conductor.service';

@Component({
  selector: 'app-conductor-lista',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './conductor-lista.component.html',
  styleUrl: './conductor-lista.component.scss',
})
export default class ConductorListaComponent implements OnInit {
  private _conductorService = inject(ConductorService);

  arrConductores = this._conductorService.arrConductoresSignal;
  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._conductorService.lista().subscribe();
  }
}
