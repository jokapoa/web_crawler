const mongoose = require("mongoose");
const moment = require("moment");

// Models
const { BoiGordo } = require("./models/BoiGordo");
const { VacaGorda } = require("./models/VacaGorda");
const { CouroSebo } = require("./models/CouroSebo");
const { MercadoFuturo } = require("./models/MercadoFuturo");
const { BoiNoMundo } = require("./models/BoiNoMundo");
const { Atacado } = require("./models/Atacado");
const { IndicadoresScot } = require("./models/IndicadoresScot");
const { Leite } = require("./models/Leite");
const { Soja } = require("./models/Soja");
const { Milho } = require("./models/Milho");

const parsePage = require("./utils/parsePage");
const ParseMercadoFuturo = require("./utils/MercadoFuturoParser");
const {
  reposicaoParser,
  reposicaoGetData
} = require("./utils/reposicaoParser");

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://dbadmin:1qazse4r5@ds151279.mlab.com:51279/cotacoes_crawler"
);

const save = (items, model, dateInfo) => {
  today_data = model
    .find({ data: dateInfo })
    .remove()
    .exec((err, data) => {
      if (err) console.log(err);
    });

  model.insertMany(items, function(err, result) {
    if (err) console.log(err);
    return result;
  });
};

const pages = [
  {
    item: "boi",
    url: "https://www.scotconsultoria.com.br/cotacoes/boi-gordo/?ref=smn",
    title: "Cotações Boi Gordo",
    header: [
      "cidade",
      "a_vista",
      "real_30_d",
      "dollar_30d",
      "base1",
      "us_7_d",
      "us_30_d",
      "ano",
      "data"
    ],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: false,
    model: BoiGordo,
    parser: parsePage
  },
  {
    item: "vaca",
    url: "https://www.scotconsultoria.com.br/cotacoes/vaca-gorda/?ref=smn",
    title: "Cotações Vaca Gorda",
    header: [
      "cidade",
      "a_vista",
      "real_30_d",
      "dolar30_d",
      "mf_2",
      "us_7d",
      "us_30d",
      "ano"
    ],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: false,
    model: VacaGorda,
    parser: parsePage
  },
  {
    item: "couro_sebo",
    url: "https://www.scotconsultoria.com.br/cotacoes/couro-e-sebo/?ref=smn",
    title: "Cotações - Couro e Sebo",
    header: ["preco", "brasil_central", "rs", "data"],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: false,
    model: CouroSebo,
    parser: parsePage
  },
  {
    item: "mercado_futuro",
    url: "https://www.scotconsultoria.com.br/cotacoes/mercado-futuro/?ref=smn",
    title: "Cotações - Mercado futuro",
    header: [
      "futuros",
      "data_inicio",
      "data_fim",
      "c_abertos",
      "variacao_cambio",
      "cambio",
      "us_a_vista",
      "data"
    ],
    selector: "tr td",
    filter_null: true,
    state_parser: false,
    model: MercadoFuturo,
    parser: ParseMercadoFuturo
  },
  {
    item: "boi_no_mundo",
    url: "https://www.scotconsultoria.com.br/cotacoes/boi-no-mundo/?ref=smn",
    title: "Cotações - Boi no mundo",
    header: ["pais", "dolar", "ha_1_ano", "data"],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: false,
    model: BoiNoMundo,
    parser: parsePage
  },
  {
    item: "atacado",
    url: "https://www.scotconsultoria.com.br/cotacoes/atacado/?ref=smn",
    title: "Cotações - Atacado",
    header: ["preco", "boi", "vaca", "ha_1_ano_boi", "data"],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: false,
    model: Atacado,
    parser: parsePage
  },
  {
    item: "indicadores",
    url: "https://www.scotconsultoria.com.br/cotacoes/indicadores/?ref=smn",
    title: "Cotações - Indicadores",
    header: ["indicador", "boi", "margem_boi", "vaca", "margem_vaca"],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: false,
    model: IndicadoresScot,
    parser: parsePage
  },
  {
    item: "leite",
    url: "https://www.scotconsultoria.com.br/cotacoes/leite-cotacoes/?ref=smn",
    title: "Cotações - Leite",
    header: [
      "uf",
      "regiao",
      "qualidade_minimo",
      "qualidade_maximo",
      "padrao_minimo",
      "padrao_maximo",
      "media_qualidade_reais_litro",
      "media_qualidade_us_litro",
      "media_padrao_reais_litro",
      "media_padrao_us_litro"
    ],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: true,
    model: Leite,
    parser: parsePage
  },
  {
    item: "soja",
    url: "https://www.scotconsultoria.com.br/cotacoes/soja/?ref=smn",
    title: "Cotações - Soja",
    header: ["uf", "cidade", "compra", "venda"],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: true,
    model: Soja,
    parser: parsePage
  },
  {
    item: "milho",
    url: "https://www.scotconsultoria.com.br/cotacoes/milho/?ref=smn",
    title: "Cotações - Milho",
    header: ["uf", "cidade", "compra", "venda"],
    selector: ".fonte-subtitulo-cinza",
    filter_null: false,
    state_parser: true,
    model: Milho,
    parser: parsePage
  },
  {
    item: "reposicao",
    url: "https://www.scotconsultoria.com.br/cotacoes/reposicao/?ref=smn",
    title: "Tabela de reposição",
    getData: reposicaoGetData
  }
];

module.exports = { pages, save };
