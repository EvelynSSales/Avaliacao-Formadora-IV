import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonSpinner,
  IonSearchbar
} from '@ionic/angular/standalone';

import { Pokemon, PokemonService } from '../../services/pokemon.service';
import { FavoritosService } from '../../services/favoritos.service';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonSpinner,
    PokemonCardComponent,
    FormsModule,
    IonSearchbar
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  pokemons: Pokemon[] = [];
  pokemonsFiltrados: Pokemon[] = [];
  carregando = true;
  mensagem = '';
  termoBusca = '';

  constructor(
    private pokemonService: PokemonService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit() {
    this.buscarPokemons();
  }

  buscarPokemons() {
    this.pokemonService.listar().subscribe({
      next: lista => {
        this.pokemons = lista;
        this.pokemonsFiltrados = lista;
        this.carregando = false;
      },
      error: () => {
        this.mensagem = 'erro ao carregar pokémons';
        this.carregando = false;
      }
    });
  }

  filtrarPokemons() {
    const termo = this.termoBusca.toLowerCase().trim();

    this.pokemonsFiltrados = this.pokemons.filter(pokemon =>
      pokemon.nome.toLowerCase().includes(termo) ||
      pokemon.tipo.toLowerCase().includes(termo) ||
      pokemon.id.toString().includes(termo)
    );
  }  

  async adicionarFavorito(pokemon: Pokemon) {
    await this.favoritosService.adicionar({
      nome: pokemon.nome,
      imagem: pokemon.imagem,
      tipo: pokemon.tipo,
      hp: pokemon.hp,
      ataque: pokemon.ataque,
      defesa: pokemon.defesa,
      velocidade: pokemon.velocidade,
      poder: pokemon.poder,
      observacao: 'meu pokémon favorito'
    });

    this.mensagem = `${pokemon.nome} foi adicionado aos favoritos!`;
  }
}