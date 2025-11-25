import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Viaje } from '../../interfaces/viaje.interface';

@Component({
  selector: 'app-viaje-card',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule],
  templateUrl: './viaje-card.component.html',
  styleUrl: './viaje-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViajeCardComponent {
  @Input() viaje!: Viaje;
  @Output() nuevaPropuesta = new EventEmitter<{ viajeId: number; precio: number }>();
  precio: number = null;

  agregarPropuesta(): void {
    if (this.precio > 0 && this.viaje.datos.id) {
      this.nuevaPropuesta.emit({
        viajeId: this.viaje.datos.id,
        precio: this.precio,
      });
      this.precio = 0; // Reset the price after submission
    }
  }
}
