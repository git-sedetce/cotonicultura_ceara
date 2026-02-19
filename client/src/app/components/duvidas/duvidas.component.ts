import { Component, OnInit } from '@angular/core';
import { FAQ_DATA, FAQItem } from './faq-data';

@Component({
  selector: 'app-duvidas',
  standalone: false,
  templateUrl: './duvidas.component.html',
  styleUrl: './duvidas.component.css'
})
export class DuvidasComponent implements OnInit {

  lista: FAQItem[] = [];
  filtrada: FAQItem[] = [];
  busca = '';

  categorias: string[] = [];

  ngOnInit() {
    this.lista = FAQ_DATA.map(x => ({ ...x, open: false }));
    this.filtrada = [...this.lista];
    this.categorias = [...new Set(this.lista.map(x => x.categoria))];
  }

  toggle(item: FAQItem) {
    item.open = !item.open;
  }

  abrirTodos() {
    this.filtrada.forEach(x => x.open = true);
  }

  fecharTodos() {
    this.filtrada.forEach(x => x.open = false);
  }

  get abertas() {
    return this.filtrada.filter(x => x.open).length;
  }

  filtrar() {
    const termo = this.busca.toLowerCase();

    this.filtrada = this.lista.filter(x =>
      x.pergunta.toLowerCase().includes(termo) ||
      x.resposta.toLowerCase().includes(termo) ||
      x.categoria.toLowerCase().includes(termo)
    );
  }

  porCategoria(cat: string) {
    return this.filtrada.filter(x => x.categoria === cat);
  }

}
