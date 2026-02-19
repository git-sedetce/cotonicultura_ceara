export interface FAQItem {
  id: number;
  categoria: string;
  pergunta: string;
  resposta: string;
  open?: boolean;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    categoria: 'Contexto e Propósito do Programa',
    pergunta: 'O que é o Programa Estadual de Fortalecimento e Revitalização da Cotonicultura do Ceará?',
    resposta: 'É uma política pública criada para estimular e apoiar a produção de algodão no Ceará, promovendo emprego, renda e fortalecimento da agricultura local.'
  },
  {
    id: 2,
    categoria: 'Contexto e Propósito do Programa',
    pergunta: 'Por que o Governo do Estado está investindo nesse programa?',
    resposta: 'Para revitalizar uma cultura historicamente importante e reinserir o Ceará na produção algodoeira nacional.'
  },
  {
    id: 3,
    categoria: 'Contexto e Propósito do Programa',
    pergunta: 'Qual a relação entre esse Programa e o Projeto “Algodão do Ceará”?',
    resposta: 'O Projeto “Algodão do Ceará”, lançado é uma parceria com FAEC, FIEC, Sebrae, Prefeituras Municipais, Ematerce, Senar, Apaece, BNB e Embrapa, está alinhado com os objetivos do programa de revitalização, buscando cultivares de alta qualidade e integração do campo com a indústria.'
  },
  {
    id: 4,
    categoria: 'Objetivos e Impactos Esperados',
    pergunta: 'Qual é o principal objetivo do Programa?',
    resposta: 'Fortalecer a cotonicultura local, gerar renda no meio rural, favorecer a instalação de indústrias e promover desenvolvimento sustentável.'
  },
  {
    id: 5,
    categoria: 'Objetivos e Impactos Esperados',
    pergunta: 'O programa visa aumentar a produção local para atender a indústria têxtil do Ceará?',
    resposta: 'Sim — há intenção de fortalecer a produção para abastecer indústrias têxteis e beneficiar a cadeia produtiva.'
  },
  {
    id: 6,
    categoria: 'Objetivos e Impactos Esperados',
    pergunta: 'Há intenção de valorizar algodão premium no Ceará?',
    resposta: 'Sim — produtores e lideranças desejam promover algodão de fibras médias e longas, com maior valor de mercado.'
  },
  {
    id: 7,
    categoria: 'Benefícios e Ações Diretas para o Produtor',
    pergunta: 'Como o programa apoia os produtores rurais?',
    resposta: 'Por meio da distribuição de sementes adaptadas e assistência técnica.'
  },
  {
    id: 8,
    categoria: 'Benefícios e Ações Diretas para o Produtor',
    pergunta: 'As sementes serão gratuitas?',
    resposta: 'Podem ser distribuídas gratuitamente ou com ressarcimento total ou parcial, conforme edital do programa.'
  },
  {
    id: 9,
    categoria: 'Benefícios e Ações Diretas para o Produtor',
    pergunta: 'Quantas sementes foram adquiridas?',
    resposta: 'O Governo adquiriu 50 toneladas de sementes de algodão geneticamente modificado para distribuição inicial aos municípios interessados.'
  },
  {
    id: 10,
    categoria: 'Benefícios e Ações Diretas para o Produtor',
    pergunta: 'O programa inclui assistência técnica?',
    resposta: 'Normalmente sim — as Secretarias Municipais, o Senar, a Ematerce e Embrapa participam com ações de assistência técnica e transferência de tecnologia junto aos produtores.'
  },
  {
    id: 11,
    categoria: 'Benefícios e Ações Diretas para o Produtor',
    pergunta: 'Qual a área máxima para o atendimento com assistência técnica?',
    resposta: 'O produtor cadastrado terá que ter área máxima de até 10 hectares (ha).'
  },
  {
    id: 12,
    categoria: 'Benefícios e Ações Diretas para o Produtor',
    pergunta: 'Haverá acompanhamento técnico especializado?',
    resposta: 'Sim — deve aplicar técnicas inovadoras e capacitar técnicos para atender produtores.'
  },
  {
    id: 13,
    categoria: 'Cadastro e Participação',
    pergunta: 'Quem pode participar do programa?',
    resposta: 'Produtores rurais com propriedades no estado do Ceará interessados em cultivar algodão.'
  },
  {
    id: 14,
    categoria: 'Cadastro e Participação',
    pergunta: 'Como o produtor se cadastra?',
    resposta: 'Por meio das Secretarias Municipais, de maneira indireta, ou através do link divulgado pela Secretaria do Desenvolvimento Econômico (SDE).'
  },
  {
    id: 15,
    categoria: 'Cadastro e Participação',
    pergunta: 'É necessário comprovar atividade algodoeira prévia?',
    resposta: 'Normalmente não — o cadastro não exige comprovação de atividade ou potencial para cultivar algodão, mas pergunta quantos hectares o produtor pretende implantar.'
  },
  {
    id: 16,
    categoria: 'Cadastro e Participação',
    pergunta: 'O produtor precisa ter Cadastro na Adagri para realizar o cadastramento do programa?',
    resposta: 'Não, para o cadastramento ao programa não precisa, mas para receber as sementes sim.'
  },
  {
    id: 17,
    categoria: 'Cadastro e Participação',
    pergunta: 'Produtores já beneficiados em outras iniciativas precisam se recadastrar?',
    resposta: 'Sim.'
  },
  {
    id: 18,
    categoria: 'Cadastro e Participação',
    pergunta: 'Após implantar minha área de algodão, tenho que informar a Adagri?',
    resposta: 'Sim. A inscrição das Unidades de Produção de algodão, até 30 (trinta) dias após o plantio, junto à Agência de Defesa Agropecuária do Estado do Ceará – ADAGRI em Ficha de Inscrição da Unidade de Produção – UP de Algodão a ser utilizado pelos proprietários, arrendatários ou detentores, a qualquer título, de áreas cultivadas com algodoeiro no estado do Ceará.'
  },
  {
    id: 19,
    categoria: 'Cadastro e Participação',
    pergunta: 'Por quê tenho que informar a Adagri as minhas novas áreas de Algodão?',
    resposta: 'Para ajudar produtores e o estado do Ceará na prevenção e o controle do bicudo (Anthomonus grandis) em cultivos de algodão.'
  },
  {
    id: 20,
    categoria: 'Distribuição e Uso das Sementes',
    pergunta: 'As sementes podem ser utilizadas para venda?',
    resposta: 'Não — devem ser utilizadas exclusivamente para plantio pelo produtor beneficiado.'
  },
  {
    id: 21,
    categoria: 'Distribuição e Uso das Sementes',
    pergunta: 'As sementes são adaptadas ao clima do Ceará?',
    resposta: 'Sim — o programa busca variedades adaptadas, e estudos estão sendo foram feitos em parceria com a Embrapa.'
  },
  {
    id: 22,
    categoria: 'Distribuição e Uso das Sementes',
    pergunta: 'Qual é o foco técnico das sementes incentivadas?',
    resposta: 'Variedades de algodão com produção de fibra de alta qualidade e resistência a doenças.'
  },
  {
    id: 23,
    categoria: 'Distribuição e Uso das Sementes',
    pergunta: 'Como será fiscalizado o uso das sementes?',
    resposta: 'A fiscalização e monitoramento podem ser definidos nos editais para assegurar o uso correto.'
  },
  {
    id: 24,
    categoria: 'Distribuição e Uso das Sementes',
    pergunta: 'É possível perder o benefício se a semente não for utilizada adequadamente?',
    resposta: 'Sim — uso indevido pode gerar desqualificação em fases futuras, conforme regulamentos.'
  },
  {
    id: 25,
    categoria: 'Dúvidas Frequentes do Produtor',
    pergunta: 'Quando acontecem os plantios?',
    resposta: 'O plantio costuma coincidir com janelas climáticas adequadas para algodão no semiárido cearense. Existe uma janela de plantio para os produtores que desejam no sequeiro, dependendo do tipo de solo e regime de chuvas. Para arenoso o plantio deve ocorrer no máximo até fevereiro e solos mais argilosos até maio.'
  },
  {
    id: 26,
    categoria: 'Dúvidas Frequentes do Produtor',
    pergunta: 'Qual a expectativa de área plantada no em 2026 e 2027?',
    resposta: 'Estimativas recentes apontam para cerca de 5 mil hectares distribuídos em diversos municípios, sendo até 1.200ha em 2026 e até 3.200ha em 2027.'
  },
  {
    id: 27,
    categoria: 'Dúvidas Frequentes do Produtor',
    pergunta: 'Quais municípios foram contemplados inicialmente?',
    resposta: 'Vários municípios do interior e da Região Metropolitana foram incluídos no ciclo inicial de distribuição de sementes, sem exceção.'
  },
  {
    id: 28,
    categoria: 'Dúvidas Frequentes do Produtor',
    pergunta: 'O programa considera irrigação como fator importante?',
    resposta: 'Sim — produtores e técnicos destacam que a irrigação melhora produtividade e qualidade da fibra.'
  },
  {
    id: 29,
    categoria: 'Dúvidas Frequentes do Produtor',
    pergunta: 'Há riscos envolvidos no cultivo de algodão?',
    resposta: 'Sim — como qualquer atividade agrícola, riscos climáticos e de mercado existem e são considerados na assistência técnica.'
  },
  {
    id: 30,
    categoria: 'Dúvidas Frequentes do Produtor',
    pergunta: 'A SDE além das sementes irá também disponibilizar custeio, preparo da área e comercialização??',
    resposta: 'Não — A SDE só irá disponibilizar as sementes. O custeio de implantação, condução e colheita do algodão será de responsabilidade do produtor. A SDE também não se responsabilizar pela comercialização.'
  },
  {
    id: 31,
    categoria: 'Cenário Produtivo e Futuro da Cotonicultura',
    pergunta: 'O Ceará já foi um grande produtor de algodão?',
    resposta: 'Sim — no passado, o estado foi um dos maiores produtores do Brasil antes da década de 1980.'
  },
  {
    id: 32,
    categoria: 'Cenário Produtivo e Futuro da Cotonicultura',
    pergunta: 'Por que houve queda na produção no passado?',
    resposta: 'Fatores como pragas históricas (como o bicudo) e falta de tecnologia contribuíram para a retração.'
  },
  {
    id: 33,
    categoria: 'Cenário Produtivo e Futuro da Cotonicultura',
    pergunta: 'O programa atual considera essas dificuldades anteriores?',
    resposta: 'Sim — parte da estratégia inclui tecnologias, assistência técnica e variedades adaptadas.'
  },
  {
    id: 34,
    categoria: 'Cenário Produtivo e Futuro da Cotonicultura',
    pergunta: 'Há meta de longo prazo para produção??',
    resposta: 'Sim — planos mencionam expansão da área para níveis bem maiores em médio e longo prazo.'
  },
  {
    id: 35,
    categoria: 'Cenário Produtivo e Futuro da Cotonicultura',
    pergunta: 'O programa representa uma oportunidade real para o produtor?',
    resposta: 'Sim — com acesso a sementes, tecnologia, assistência e integração ao mercado, é uma oportunidade concreta de ampliar a produção e a renda agrícola no Ceará.'
  },
  {
    id: 36,
    categoria: 'Integração com Mercado e Indústria',
    pergunta: 'O programa apoia integração com a indústria têxtil?',
    resposta: 'Sim — há incentivo para que a produção atenda empresas têxteis locais.'
  },
  {
    id: 37,
    categoria: 'Integração com Mercado e Indústria',
    pergunta: 'A produção pode ter “selo de qualidade”?',
    resposta: 'Projetos ligados ao algodão cearense já discutem diferenciais de fibra e valor agregado.'
  },
  {
    id: 38,
    categoria: 'Integração com Mercado e Indústria',
    pergunta: 'O programa fomenta parcerias com empresas do agronegócio?',
    resposta: 'Sim — parcerias com Sebrae, FIEC, FAEC e outras instituições são parte das ações.'
  },
  {
    id: 39,
    categoria: 'Integração com Mercado e Indústria',
    pergunta: 'Há perspectiva de atrair novos investimentos?',
    resposta: 'Sim — o incentivo à cadeia visa atrair investimentos privados e industriais.'
  },
  {
    id: 40,
    categoria: 'Integração com Mercado e Indústria',
    pergunta: 'O Ceará planeja expandir a área plantada nos próximos anos?',
    resposta: 'Sim — há planos para crescimento gradual das áreas produtivas, com metas ambiciosas de curto e longo prazo.'
  }
];
