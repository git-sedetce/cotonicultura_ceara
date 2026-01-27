import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../../services/statistics.service';
import * as L from 'leaflet';
import { ApexOptions } from 'ngx-apexcharts';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home-admin',
  standalone: false,
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
})
export class HomeAdminComponent implements OnInit {
  totalAgricultores = 0;
  agricultoresAtendidos = 0;
  totalSementes = 0;
  areaParaCultivo = 0;

  municipios: any[] = [];
  regioes: any[] = [];
  cultivo: any[] = [];

  private map!: L.Map;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.carregarIndicadores();
    this.carregarGraficos();
  }

  // ================= INDICADORES =================
  carregarIndicadores() {
    forkJoin({
      agricultores: this.statisticsService.contarAgricultores({}),
      atendidos: this.statisticsService.contarAtendidos({}),
      sementes: this.statisticsService.sementesDistribuidas({}),
      area: this.statisticsService.areaParaCultivar({}),
    }).subscribe((res) => {
      this.totalAgricultores = Number(res.agricultores.total) || 0;
      this.agricultoresAtendidos =
        Number(res.atendidos.agricultores_atendidos) || 0;
      this.totalSementes =
        Number(res.sementes.total_sementes_distribuidas) || 0;
        this.totalSementes =
        Number(res.sementes.total_sementes_distribuidas) || 0;
      this.areaParaCultivo = Number(res.area.total_area_cultivo) || 0;
    });
  }

  // ================= GRÁFICOS =================
  carregarGraficos() {
    // Cultivo (Donut)
    this.statisticsService.estatiticaCultivo({}).subscribe((res) => {
      this.cultivoChart.series = res.map((c: any) =>
        Number(c.qtd_agricultores),
      );
      this.cultivoChart.labels = res.map((c: any) => c.tipo_cultivo);
    });

    // Agricultores por Município (Donut)
    this.statisticsService.contarMunicipio({}).subscribe((res) => {
      this.farmersMunicipioChart.series = res.map((c: any) =>
        Number(c.qtd_agricultores),
      );
      this.farmersMunicipioChart.labels = res.map((c: any) => c.nome_municipio);
    });

    // Agricultores por Região
    this.statisticsService.contarRegiao({}).subscribe((res) => {
      const categorias = res.map((r: any) => r.nome_regiao);
      const dados = res.map((r: any) => Number(r.qtd_agricultores));

      this.regiaoChart = {
        ...this.regiaoChart,
        series: [
          {
            name: 'Agricultores',
            data: dados,
          },
        ],
        xaxis: {
          categories: categorias,
        },
      };
    });

    // Sementes por Região
    this.statisticsService
      .sementesDistribuidasPorRegiao({})
      .subscribe((res) => {
        const categorias = res.map((r: any) => r.nome_regiao);
        const dados = res.map((r: any) => Number(r.total_sementes));

        this.regiaoSementesChart = {
          ...this.regiaoSementesChart,
          series: [
            {
              name: 'Sementes',
              data: dados,
            },
          ],
          xaxis: {
            categories: categorias,
          },
        };
      });

    // 🔴 IMPORTANTE: sementes por município + mapa
    this.statisticsService
      .sementesDistribuidasPorMunicipio({})
      .subscribe((res) => {
        this.municipios = res;
        this.initMapa();
      });

    // Área por Município
    this.statisticsService.somaAreaCultivoMunicipio({}).subscribe((res) => {

      const categorias = res.map((r: any) => r.nome_municipio);
      const dados = res.map((r: any) => Number(r.area_algodao));

      this.cultivoMunicipioChart = {
        ...this.cultivoMunicipioChart,
        series: [
          {
            name: 'Área (ha)',
            data: dados,
          },
        ],
        xaxis: {
          categories: categorias,
        },
      };
    });

    // Área por Região
    this.statisticsService.somaAreaCultivoRegiao({}).subscribe((res) => {

      const categorias = res.map((r: any) => r.nome_regiao);
      const dados = res.map((r: any) => Number(r.total_area_cultivo));

      this.cultivoRegiaoChart = {
        ...this.cultivoRegiaoChart,
        series: [
          {
            name: 'Área (ha)',
            data: dados,
          },
        ],
        xaxis: {
          categories: categorias,
        },
      };
    });
  }

  // ================= MAPA =================
  initMapa() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('mapa-ceara').setView([-5.2, -39.5], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    fetch('assets/geojson/geojs-mun.json')
      .then((res) => res.json())
      .then((geoJson) => {
        L.geoJSON(geoJson, {
          style: (feature) => this.estiloMunicipio(feature),
          onEachFeature: (feature, layer) => {
            const nome = feature.properties.name;
            const qtd = this.getQtdPorMunicipio(nome);

            layer.bindPopup(`
              <strong>${nome}</strong><br>
              Sementes Distribuídas: ${qtd}
            `);
          },
        }).addTo(this.map);
      });
  }

  normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  getQtdPorMunicipio(nomeMunicipio: string): number {
    const municipio = this.municipios.find(
      (m) => this.normalize(m.nome_municipio) === this.normalize(nomeMunicipio),
    );

    if (!municipio) return 0;

    const qtd = Number(municipio.total_sementes);
    return isNaN(qtd) ? 0 : qtd;
  }

  estiloMunicipio(feature: any) {
    const qtd = this.getQtdPorMunicipio(feature.properties.name);
    return {
      fillColor: this.getCor(qtd),
      weight: 1,
      color: '#555',
      fillOpacity: 0.75,
    };
  }

  getCor(qtd: number): string {
    return qtd > 20
      ? '#800026'
      : qtd > 10
        ? '#BD0026'
        : qtd > 5
          ? '#E31A1C'
          : qtd > 1
            ? '#FD8D3C'
            : '#FFEDA0';
  }

  // ================= CONFIG CHARTS =================
  cultivoChart: ApexOptions = {
    series: [],
    chart: { type: 'donut', height: 240 },
    title: {
      text: 'Tipo de Cultivo',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    labels: [],
  };

  farmersMunicipioChart: ApexOptions = {
    series: [],
    chart: { type: 'donut', height: 240 },
    title: {
      text: 'Agricultores cadastrados',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    labels: [],
  };

  regiaoChart: ApexOptions = {
    series: [],
    chart: { type: 'bar', height: 260 },
    title: {
      text: 'Agricultores por Região',
      align: 'center',
      margin: 50,
      style: {
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    xaxis: { categories: [] },
  };

  regiaoSementesChart: ApexOptions = {
    series: [],
    chart: { type: 'bar', height: 260 },
    title: {
      text: 'Distribuição de sementes por região',
      align: 'center',
      margin: 50,
      style: {
        fontSize: '16px',
        fontWeight: '600',
      },
    },
    xaxis: { categories: [] },
  };

  cultivoMunicipioChart: ApexOptions = {
    series: [],
    chart: { type: 'bar', height: 260 },
    title: {
      text: 'Area de Cultivo por Município (ha)',
      align: 'center',
      margin: 50,
      style: {
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    xaxis: { categories: [] },
  };

  cultivoRegiaoChart: ApexOptions = {
    series: [],
    chart: { type: 'bar', height: 260 },
    title: {
      text: 'Area de Cultivo por Região (ha)',
      align: 'center',
      margin: 50,
      style: {
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    xaxis: { categories: [] },
  };
}
