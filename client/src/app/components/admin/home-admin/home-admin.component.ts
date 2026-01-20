import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../../services/statistics.service';
import * as L from 'leaflet';
import {
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexResponsive,
  ApexOptions
} from 'ngx-apexcharts';

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
  sementesRegiao = 0;
  sementesMunicipio = 0;

  municipios: any[] = [];
  regioes: any[] = [];
  cultivo: any[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.carregarIndicadores();
    this.carregarGraficos();
  }

  carregarIndicadores() {
    this.statisticsService.contarAgricultores({}).subscribe((res) => {
      console.log('totalAgricultores', res);
      this.totalAgricultores = res.total;
    });

    this.statisticsService.contarAtendidos({}).subscribe((res) => {
      console.log('reagricultoresAtendidoss', res);
      this.agricultoresAtendidos = res.agricultores_atendidos;
    });

    this.statisticsService.sementesDistribuidas({}).subscribe((res) => {
      console.log('totalSementes', res);
      this.totalSementes = res.total_sementes_distribuidas;
    });
  }

  carregarGraficos() {
    // REGIÕES (BARRA)
    this.statisticsService.contarRegiao({}).subscribe((res) => {
      this.regiaoChart.series = [
        {
          name: 'Agricultores',
          data: res.map((r: any) => Number(r.qtd_agricultores)),
        },
      ];

      this.regiaoChart.xaxis!.categories = res.map(
    (r: any) => r.nome_regiao,
  );
      this.regioes = res; // mantém para o mapa
    });

    // TIPO DE CULTIVO (DONUT)
    this.statisticsService.estatiticaCultivo({}).subscribe((res) => {
      this.cultivoChart.series = res.map((c: any) =>
        Number(c.qtd_agricultores),
      );
      this.cultivoChart.labels = res.map((c: any) => c.tipo_cultivo);
      this.cultivo = res;
    });

    // REGIÕES (BARRA) Sementes por Região
    this.statisticsService
      .sementesDistribuidasPorRegiao({})
      .subscribe((res) => {
        this.regiaoSementesChart.series = [
          {
            name: 'Agricultores',
            data: res.map((r: any) => Number(r.total_sementes)),
          },
        ];

        this.regiaoSementesChart.xaxis!.categories = res.map(
          (r: any) => r.nome_regiao,
        );

        this.regioes = res; // mantém para o mapa
      });

    // TIPO DE CULTIVO (DONUT) Sementes por Município
    this.statisticsService
      .sementesDistribuidasPorMunicipio({})
      .subscribe((res) => {
        this.sementesMunicipioChart.series = res.map((c: any) =>
          Number(c.total_sementes),
        );
        this.sementesMunicipioChart.labels = res.map(
          (c: any) => c.nome_municipio,
        );
        this.municipios = res;
        this.initMapa();
      });
  }

  // ================= MAPA =================
initMapa() {
  const map = L.map('mapa-ceara').setView([-5.2, -39.5], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map);

  fetch('assets/geojson/geojs-mun.json')
    .then(res => res.json())
    .then(geoJson => {
      L.geoJSON(geoJson, {
        style: feature => this.estiloMunicipio(feature),
        onEachFeature: (feature, layer) => {
          const nome = feature.properties.name;
          const qtd = this.getQtdPorMunicipio(nome);

          layer.bindPopup(`
            <strong>${nome}</strong><br>
            Sementes Distribuidas: ${qtd}
          `);
        },
      }).addTo(map);
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
  const m = this.municipios.find(
    x =>
      this.normalize(x.nome_municipio) ===
      this.normalize(nomeMunicipio)
  );

  if (!m) {
    return 0;
  }

  const qtd = parseInt(m.total_sementes as any, 10);

  console.log({
  geojson: nomeMunicipio,
  api: m?.nome_municipio,
  valor: m?.total_sementes
});

  return isNaN(qtd) ? 0 : qtd;
}


estiloMunicipio(feature: any) {
  const nome = feature.properties.name;
  const qtd = this.getQtdPorMunicipio(nome);

  return {
    fillColor: this.getCor(qtd),
    weight: 1,
    color: '#555',
    fillOpacity: 0.75,
  };
}

getCor(qtd: number): string {
  return qtd > 20 ? '#800026' :
         qtd > 10 ? '#BD0026' :
         qtd > 5  ? '#E31A1C' :
         qtd > 1  ? '#FD8D3C' :
                    '#FFEDA0';
}
  // ================= FIM MAPA =================

  cultivoChart: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    responsive: ApexResponsive[];
  } = {
    series: [],
    chart: {
      type: 'donut',
      height: 280,
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  sementesMunicipioChart: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    responsive: ApexResponsive[];
  } = {
    series: [],
    chart: {
      type: 'donut',
      height: 280,
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  regiaoChart: ApexOptions = {
    series: [],
    chart: {
      type: 'bar',
      height: 280,
    },
    title: {
    text: 'Agricultores por Região',
    align: 'center',
    style: {
      fontSize: '18px',
      fontWeight: '600',
    },
  },
    xaxis: {
      categories: [],
    },
  };

  regiaoSementesChart: ApexOptions = {
    series: [],
    chart: {
      type: 'bar',
      height: 280,
    },
    title: {
    text: 'Distribuição de sementes por região',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: '600',
    },
  },
    xaxis: {
      categories: [],
    },
  };
}
