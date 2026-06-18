import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

export interface Pokemon {
  id: number;
  nome: string;
  imagem: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';

  constructor(private http: HttpClient) {}

  listar(): Observable<Pokemon[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      switchMap((resposta: any) => {
        const requisicoes = resposta.results.map((pokemon: any) => {
          return this.http.get<any>(pokemon.url);
        });

        return forkJoin<any[]>(requisicoes);
      }),

      map((detalhes: any[]) => {
        return detalhes.map((pokemon: any) => {
          return {
            id: pokemon.id,
            nome: pokemon.name,
            imagem: pokemon.sprites.other['official-artwork'].front_default,
            tipo: pokemon.types[0].type.name
          };
        });
      })
    );
  }
}