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
  areaParaCultivoFormatada = '';

  municipios: any[] = [];
  regioes: any[] = [];
  cultivo: any[] = [];

  private map!: L.Map;
  mapaFullscreen = false;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.carregarIndicadores();
    this.carregarGraficos();
  }

  // ================= INDICADORES =================
  carregarIndicadores() {
    forkJoin({
      agricultores: this.statisticsService.contarAgricultores(),
      atendidos: this.statisticsService.contarAtendidos(),
      sementes: this.statisticsService.sementesDistribuidas(),
      area: this.statisticsService.areaParaCultivar(),
    }).subscribe((res) => {
      this.totalAgricultores = Number(res.agricultores.total) || 0;
      this.agricultoresAtendidos =
        Number(res.atendidos.agricultores_atendidos) || 0;
      this.totalSementes =
        Number(res.sementes.total_sementes_distribuidas) || 0;
      this.areaParaCultivo = Number(res.area.total_area_cultivo) || 0;
      this.areaParaCultivoFormatada = (Number(res.area.total_area_cultivo) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

    // Agricultores por Município (Donut)
    this.statisticsService.somaAreaCultivoMunicipio({}).subscribe((res) => {
      this.cultivoMunicipioChart.series = res.map((c: any) =>
        Number(c.area_algodao),
      );
      this.cultivoMunicipioChart.labels = res.map((c: any) => c.nome_municipio);
    });

    // Agricultores por Município (Donut)
    this.statisticsService.somaAreaCultivoRegiao({}).subscribe((res) => {
      this.cultivoRegiaoChart.series = res.map((c: any) =>
        Number(c.total_area_cultivo),
      );
      this.cultivoRegiaoChart.labels = res.map((c: any) => c.nome_regiao);
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
    this.statisticsService.dadosMapa().subscribe((res) => {
      this.municipios = res;
      this.initMapa();
    });
  }

  //PONTOS DE DISTRIBUIÇÃO

  pontosDistribuicao = [
    {
      nome: 'Tauá',
      lat: -6.0029,
      lng: -40.2928,
    },
    {
      nome: 'Morada Nova',
      lat: -5.1077,
      lng: -38.3721,
    },
    {
      nome: 'Quixeramobim',
      lat: -5.1989,
      lng: -39.2951,
    },
  ];

  iconeDistribuicao = L.icon({
    iconUrl: 'assets/icons/pin-distribuicao.png', // pode ser o pin padrão também
    iconSize: [36, 40],
    iconAnchor: [15, 35],
    popupAnchor: [0, -40],
  });

  adicionarPontosDistribuicao() {
    this.pontosDistribuicao.forEach((ponto) => {
      L.marker([ponto.lat, ponto.lng], {
        icon: this.iconeDistribuicao,
      }).addTo(this.map).bindPopup(`
        <strong>${ponto.nome}</strong><br>
        📍 Ponto de distribuição de sementes
      `);
    });
  }

  toggleFullscreen() {
    this.mapaFullscreen = !this.mapaFullscreen;

    // Aguarda o DOM atualizar antes de recalcular o mapa
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
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
        // 🔹 Municípios (polígonos)
        L.geoJSON(geoJson, {
          style: (feature) => this.estiloMunicipio(feature),
          onEachFeature: (feature, layer) => {
            const nome = feature.properties.name;
            const dados = this.getDadosMunicipio(nome);

            layer.bindPopup(`
            <strong>${nome}</strong><br>
            🌱 Sementes distribuídas: <strong>${dados.sementes}</strong><br>
            👩‍🌾 Agricultores cadastrados: <strong>${dados.agricultores}</strong><br>
            🌾 Área de algodão: <strong>${dados.area.toFixed(2)} ha</strong>
          `);
          },
        }).addTo(this.map);

        // 🔴 Pins dos pontos de distribuição
        this.adicionarPontosDistribuicao();
      });
  }

  normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  getDadosMunicipio(nomeMunicipio: string) {
    const municipio = this.municipios.find(
      (m) => this.normalize(m.nome_municipio) === this.normalize(nomeMunicipio),
    );

    if (!municipio) {
      return {
        sementes: 0,
        agricultores: 0,
        area: 0,
      };
    }

    return {
      sementes: Number(municipio.total_sementes) || 0,
      agricultores: Number(municipio.total_agricultores) || 0,
      area: Number(municipio.total_area_algodao) || 0,
    };
  }

  estiloMunicipio(feature: any) {
    const dados = this.getDadosMunicipio(feature.properties.name);
    return {
      fillColor: this.getCor(dados.agricultores),
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

  cultivoMunicipioChart: ApexOptions = {
    series: [],
    chart: { type: 'donut', height: 240 },
    title: {
      text: 'Area de Cultivo por Município (ha)',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: '600',
      },
    },
    labels: [],
  };

  cultivoRegiaoChart: ApexOptions = {
    series: [],
    chart: { type: 'donut', height: 240 },
    title: {
      text: 'Area de Cultivo por Região (ha)',
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

  // cultivoMunicipioChart: ApexOptions = {
  //   series: [],
  //   chart: { type: 'bar', height: 260 },
  //   title: {
  //     text: 'Area de Cultivo por Município (ha)',
  //     align: 'center',
  //     margin: 50,
  //     style: {
  //       fontSize: '18px',
  //       fontWeight: '600',
  //     },
  //   },
  //   xaxis: { categories: [] },
  // };

  // cultivoRegiaoChart: ApexOptions = {
  //   series: [],
  //   chart: { type: 'bar', height: 260 },
  //   title: {
  //     text: 'Area de Cultivo por Região (ha)',
  //     align: 'center',
  //     margin: 50,
  //     style: {
  //       fontSize: '18px',
  //       fontWeight: '600',
  //     },
  //   },
  //   xaxis: { categories: [] },
  // };
}
