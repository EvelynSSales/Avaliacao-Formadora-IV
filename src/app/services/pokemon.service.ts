import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

export interface Pokemon {
  id: number;
  nome: string;
  imagem: string;
  tipo: string;
  tipoIcone: string;
  hp: number;
  ataque: number;
  defesa: number;
  velocidade: number;
  poder: number;
  descricao: string;
  fraqueza: string;
  fraquezaIcone: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0';

  constructor(private http: HttpClient) {}

  listar(): Observable<Pokemon[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      switchMap((resposta: any) => {
        const requisicoes: Observable<Pokemon>[] = resposta.results.map((pokemon: any) => {
          return this.http.get<any>(pokemon.url).pipe(
            switchMap((detalhes: any) => {
              return this.http.get<any>(detalhes.species.url).pipe(
                map((especie: any) => this.montarPokemon(detalhes, especie))
              );
            })
          );
        });

        return forkJoin(requisicoes);
      })
    );
  }

  private montarPokemon(pokemon: any, especie: any): Pokemon {
    const hp = this.buscarStat(pokemon, 'hp');
    const ataque = this.buscarStat(pokemon, 'attack');
    const defesa = this.buscarStat(pokemon, 'defense');
    const especialAtaque = this.buscarStat(pokemon, 'special-attack');
    const especialDefesa = this.buscarStat(pokemon, 'special-defense');
    const velocidade = this.buscarStat(pokemon, 'speed');

    const tipo = pokemon.types[0].type.name;
    const fraqueza = this.buscarFraqueza(tipo);

    return {
      id: pokemon.id,
      nome: pokemon.name,
      imagem: pokemon.sprites.other['official-artwork'].front_default,
      tipo,
      tipoIcone: this.buscarIconeTipo(tipo),
      hp,
      ataque,
      defesa,
      velocidade,
      poder: hp + ataque + defesa + especialAtaque + especialDefesa + velocidade,
      descricao: this.buscarDescricao(especie),
      fraqueza: fraqueza.nome,
      fraquezaIcone: fraqueza.icone
    };
  }

  private buscarStat(pokemon: any, nomeStat: string): number {
    const stat = pokemon.stats.find((item: any) => item.stat.name === nomeStat);
    return stat ? stat.base_stat : 0;
  }

  private buscarDescricao(especie: any): string {
    const texto = especie.flavor_text_entries.find(
      (item: any) => item.language.name === 'en'
    );

    if (!texto) {
      return 'Descrição não encontrada para este Pokémon.';
    }

    return texto.flavor_text
      .replace(/\n/g, ' ')
      .replace(/\f/g, ' ')
      .replace(/\r/g, ' ');
  }

  private buscarIconeTipo(tipo: string): string {
    const icones: any = {
      normal: '⭐',
      fire: '🔥',
      water: '💧',
      grass: '🍃',
      electric: '⚡',
      ice: '❄️',
      fighting: '🥊',
      poison: '☠️',
      ground: '⛰️',
      flying: '🪽',
      psychic: '🔮',
      bug: '🐛',
      rock: '🪨',
      ghost: '👻',
      dragon: '🐉',
      dark: '🌑',
      steel: '⚙️',
      fairy: '✨'
    };

    return icones[tipo] || '⭐';
  }

  private buscarFraqueza(tipo: string): { nome: string; icone: string } {
    const fraquezas: any = {
      normal: { nome: 'Fighting', icone: '🥊' },
      fire: { nome: 'Water', icone: '💧' },
      water: { nome: 'Electric', icone: '⚡' },
      grass: { nome: 'Fire', icone: '🔥' },
      electric: { nome: 'Ground', icone: '⛰️' },
      ice: { nome: 'Fire', icone: '🔥' },
      fighting: { nome: 'Psychic', icone: '🔮' },
      poison: { nome: 'Ground', icone: '⛰️' },
      ground: { nome: 'Water', icone: '💧' },
      flying: { nome: 'Electric', icone: '⚡' },
      psychic: { nome: 'Bug', icone: '🐛' },
      bug: { nome: 'Fire', icone: '🔥' },
      rock: { nome: 'Water', icone: '💧' },
      ghost: { nome: 'Ghost', icone: '👻' },
      dragon: { nome: 'Ice', icone: '❄️' },
      dark: { nome: 'Fighting', icone: '🥊' },
      steel: { nome: 'Fire', icone: '🔥' },
      fairy: { nome: 'Steel', icone: '⚙️' }
    };

    return fraquezas[tipo] || { nome: 'Unknown', icone: '⭐' };
  }
}