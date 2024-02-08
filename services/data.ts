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

  const raw = response.data
    .slice(-months)
    .map((item: any) => 1 + (Number(item.valor) / 100))
    .reduce((a: number, b: number) => a * b, 1)

  return Math.round(((raw - 1) * 100) * 100) / 100;
}

export async function getSelic(months: number) {
  const SELIC_API_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados?formato=json";

  const response: any = await axios.get(SELIC_API_URL)

  response.data.pop()

  const raw = response.data
    .slice(-months)
    .map((item: any) => 1 + (Number(item.valor) / 100))
    .reduce((a: number, b: number) => a * b, 1)

  return Math.round(((raw - 1) * 100) * 100) / 100;
}

export async function getReferentialTax(months: number) {
  const TR_API_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.226/dados?formato=json";

  const response: any = await axios.get(TR_API_URL)

  const reversed = response.data.reverse();

  var usefulMonths: any = [];
  var count = 0;

  for (let i = 0; i < reversed.length; i++) {
    if (reversed[i].data.substring(0, 2) == "01" && reversed[i].datafim.substring(0, 2) == "01") {
      usefulMonths.push(reversed[i])
      count++;

      if (count == months) break
    }

  }

  const raw = usefulMonths
    .map((item: any) => 1 + (Number(item.valor) / 100))
    .reduce((a: number, b: number) => a * b, 1)

  return Math.round(((raw - 1) * 100) * 100) / 100;
}

export async function getPoupancaAnuallized() {
  const referentialTax: number = await getReferentialTax(12);
  const selic: number = await getSelic(12);

  const limit = 8.5;
  return selic <= limit ? 0.7 * selic + referentialTax : 0.5 * selic + referentialTax;
}
