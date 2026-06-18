import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput
} from '@ionic/angular/standalone';

import { Favorito, FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TitleCasePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonItem,
    IonLabel,
    IonInput
  ],
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss']
})
export class FavoritosPage implements OnInit {
  favoritos: Favorito[] = [];

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit() {
    this.favoritosService.listar().subscribe(lista => {
      this.favoritos = lista;
    });
  }

  atualizar(favorito: Favorito) {
    if (!favorito.id) return;

    this.favoritosService.atualizar(
      favorito.id,
      favorito.observacao
    );
  }

  remover(favorito: Favorito) {
    if (!favorito.id) return;

    this.favoritosService.remover(favorito.id);
  }
}