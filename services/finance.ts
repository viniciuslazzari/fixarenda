// When using CDI 
export function getDailyInterestOverDi(percentage: number, di: number): number {
  const index = percentage / 100;
  return Math.pow((index * di) / 100 + 1, 1 / 365);
}

// When using IPCA
export function getDailyInterestOverIpca(percentage: number, ipca: number): number {
  return Math.pow((percentage + ipca) / 100 + 1, 1 / 365);
}

// When using Pre
export function getDailyInterestOverFixed(percentage: number): number {
  return Math.pow(percentage / 100 + 1, 1 / 365);
}

export function getDailyInterest(type: string, percentage: number, di: number, ipca: number): number {
  if (type == 'cdi') {
    return getDailyInterestOverDi(percentage, di);
  }

  if (type == 'ipca') {
    return getDailyInterestOverIpca(percentage, ipca);
  }

  return getDailyInterestOverFixed(percentage);
}

export function compoundInterest(initial: number, index: number, days: number): number {
  const interest = initial * Math.pow(index, days) - initial;
  return parseFloat(interest.toFixed(2));
}

export function getFiscal(investiment: string, days: number): number {
  if (investiment == "LCI/LCA" || investiment == "CRA/CRI") {
    return 0;
  }

  if (days <= 180) {
    return 22.5;
  } else if (days <= 360) {
    return 20;
  } else if (days <= 720) {
    return 17.5;
  } else {
    return 15;
  }
}

export function returnFormattedTitle(tax: number, type: string) {
  if (type == "cdi") {
    return tax.toString() + '% CDI';
  }

  if (type == 'ipca') {
    return 'IPCA + ' + tax.toString() + '%';
  }

  return tax.toString() + '% a.a';
}