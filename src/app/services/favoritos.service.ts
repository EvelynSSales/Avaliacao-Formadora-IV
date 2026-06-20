import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Favorito {
  id?: string;
  nome: string;
  imagem: string;
  tipo: string;
  hp: number;
  ataque: number;
  defesa: number;
  velocidade: number;
  poder: number;
  observacao: string;
  destaque?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private favoritosRef = collection(this.firestore, 'favoritos');

  constructor(private firestore: Firestore) {}

  listar(): Observable<Favorito[]> {
    return collectionData(this.favoritosRef, {
      idField: 'id'
    }) as Observable<Favorito[]>;
  }

  adicionar(favorito: Favorito) {
    return addDoc(this.favoritosRef, favorito);
  }

  atualizar(id: string, observacao: string) {
    const favoritoDoc = doc(this.firestore, `favoritos/${id}`);
    return updateDoc(favoritoDoc, { observacao });
  }

  remover(id: string) {
    const favoritoDoc = doc(this.firestore, `favoritos/${id}`);
    return deleteDoc(favoritoDoc);
  }

  destacar(id: string, destaque: boolean) {
    const favoritoDoc = doc(this.firestore, `favoritos/${id}`);
    return updateDoc(favoritoDoc, { destaque });
  }

}