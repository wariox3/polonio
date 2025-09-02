import { Component } from '@angular/core';
import { RndcTabGuiaComponent } from '../../components/rndc-tab-guia/rndc-tab-guia.component';
import { RndcTabDespachoComponent } from '../../components/rndc-tab-despacho/rndc-tab-despacho.component';

@Component({
  selector: 'app-rndc-lista',
  standalone: true,
  imports: [RndcTabGuiaComponent, RndcTabDespachoComponent],
  templateUrl: './rndc-lista.component.html',
})
export default class RndcListaComponent {
  public activeTab: string = 'guia';
}
