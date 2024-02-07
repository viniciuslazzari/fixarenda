import axios from "axios";

export async function getIpca(months: number) {
  const IPCA_API_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json";

  const response: any = await axios.get(IPCA_API_URL)

  const raw: number = response.data
    .slice(-months)
    .map((item: any) => 1 + (item.valor / 100))
    .reduce((a: number, b: number) => a * b, 1)

  return Math.round(((raw - 1) * 100) * 100) / 100;
}

export async function getCdi(months: number) {
  const CDI_API_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json";

  const response: any = await axios.get(CDI_API_URL)

  response.data.pop()

  console.log(response.data)

  const raw = response.data
    .slice(-months + 1)
    .map((item: any) => 1 + (item.VALVALOR / 100))
    .reduce((a: number, b: number) => a * b, 1)

  return Math.round(((raw - 1) * 100) * 100) / 100;
}