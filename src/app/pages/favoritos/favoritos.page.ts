import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons
} from '@ionic/angular/standalone';

import { Favorito, FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TitleCasePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons
  ],
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss']
})
export class FavoritosPage implements OnInit {
  favoritos: Favorito[] = [];

  indiceAtual = 0;
  toqueInicioX = 0;
  toqueFimX = 0;

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit() {
    this.favoritosService.listar().subscribe(lista => {
      this.favoritos = lista;

      if (this.indiceAtual >= this.favoritos.length) {
        this.indiceAtual = Math.max(this.favoritos.length - 1, 0);
      }
    });
  }

  get favoritoAtual() {
    return this.favoritos[this.indiceAtual];
  }

  proximaCarta() {
    if (this.indiceAtual < this.favoritos.length - 1) {
      this.indiceAtual++;
    }
  }

  cartaAnterior() {
    if (this.indiceAtual > 0) {
      this.indiceAtual--;
    }
  }

  iniciarArraste(event: TouchEvent) {
    this.toqueInicioX = event.changedTouches[0].clientX;
  }

  finalizarArraste(event: TouchEvent) {
    this.toqueFimX = event.changedTouches[0].clientX;

    const distancia = this.toqueFimX - this.toqueInicioX;

    if (Math.abs(distancia) < 60) return;

    if (distancia < 0) {
      this.proximaCarta();
    } else {
      this.cartaAnterior();
    }
  }

  remover(favorito: Favorito) {
    if (!favorito.id) return;

    this.favoritosService.remover(favorito.id);
  }
}