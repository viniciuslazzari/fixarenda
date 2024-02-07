import axios from "axios";

export async function getIpca(months: number) {
  const IPCA_API_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.10844/dados?formato=json";

  const response: any = await axios.get(IPCA_API_URL)

  const raw: number = response.data
    .slice(-months)
    .map((item: any) => item.valor)
    .reduce((a: number, b: number) => a + b, 0);

  console.log(response.data.slice(-months).map((item: any) => item.valor))

  return Math.round((raw * 100) * 100) / 100;
}

export async function getCdi(months: number) {
  const CDI_API_URL = "http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='BM12_TJCDI12')";

  const response: any = await axios.get(CDI_API_URL)

  const raw: number = response.data.value
    .slice(-months)
    .map((item: any) => 1 + (item.VALVALOR / 100))
    .reduce((a: number, b: number) => a * b, 1)

  return Math.round(((raw - 1) * 100) * 100) / 100;
}