import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

export interface Pokemon {
  id: number;
  nome: string;
  imagem: string;
  tipo: string;
  hp: number;
  ataque: number;
  defesa: number;
  velocidade: number;
  poder: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';

  constructor(private http: HttpClient) {}

  listar(): Observable<Pokemon[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      switchMap((resposta: any) => {
        const requisicoes: Observable<any>[] = resposta.results.map((pokemon: any) => {
          return this.http.get<any>(pokemon.url);
        });

        return forkJoin(requisicoes);
      }),

      map((detalhes: any[]) => {
        return detalhes.map((pokemon: any) => {
          const hp = this.buscarStat(pokemon, 'hp');
          const ataque = this.buscarStat(pokemon, 'attack');
          const defesa = this.buscarStat(pokemon, 'defense');
          const especialAtaque = this.buscarStat(pokemon, 'special-attack');
          const especialDefesa = this.buscarStat(pokemon, 'special-defense');
          const velocidade = this.buscarStat(pokemon, 'speed');

          return {
            id: pokemon.id,
            nome: pokemon.name,
            imagem: pokemon.sprites.other['official-artwork'].front_default,
            tipo: pokemon.types[0].type.name,
            hp,
            ataque,
            defesa,
            velocidade,
            poder: hp + ataque + defesa + especialAtaque + especialDefesa + velocidade
          };
        });
      })
    );
  }

  private buscarStat(pokemon: any, nomeStat: string): number {
    const stat = pokemon.stats.find((item: any) => item.stat.name === nomeStat);
    return stat ? stat.base_stat : 0;
  }
}