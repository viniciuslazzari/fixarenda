"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import React, { useCallback, useEffect, useState } from "react";
import classes from "./style.module.css";
import { LineChart } from '@mantine/charts';
import {
  Button,
  Container,
  Fieldset,
  Group,
  NativeSelect,
  Badge,
  NumberInput,
  Space,
  Flex,
  Table,
  NumberFormatter,
  ActionIcon,
  ColorSwatch,
  Image,
  Title,
  Text
} from "@mantine/core";
import { DateInput, DateInputProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { compoundInterest, getDailyInterest, getFiscal, returnFormattedTitle } from "../../services/finance"
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { getCdi, getIpca } from "@/services/data";

const MAX_TITLES = 5;

const selectValues = [
  { value: 'cdi', label: 'CDI (%)' },
  { value: 'ipca', label: 'IPCA+' },
  { value: 'pre', label: 'PRÉ' }
];

interface Title {
  initial: number,
  initialDate: Date,
  finalDate: Date,
  di: number,
  ipca: number,
  investiment: string,
  tax: number,
  type: string,

  color: string
  daysBetween: number,
  plotTitle: string,
  formatedTax: string,
  dailyInterest: number,
  gross: number,
  fiscal: number,
  fiscalLoss: number,
  liquid: number,
  rendiment: number
}

interface Serie {
  name: string,
  color: string
}

const colorData = [
  { color: 'var(--mantine-color-grape-6)', used: false },
  { color: 'var(--mantine-color-yellow-6)', used: false },
  { color: 'var(--mantine-color-pink-6)', used: false },
  { color: 'var(--mantine-color-teal-6)', used: true },
  { color: 'var(--mantine-color-blue-6)', used: true }
]

const initialTitles: Title[] = [
  {
    initial: 1000,
    initialDate: new Date(),
    finalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
    di: 12,
    ipca: 5,
    investiment: "CDB",
    tax: 120,
    type: "cdi",

    color: 'var(--mantine-color-blue-6)',
    daysBetween: 0,
    plotTitle: '',
    formatedTax: '',
    dailyInterest: 0,
    gross: 0,
    fiscal: 0,
    fiscalLoss: 0,
    liquid: 0,
    rendiment: 0
  },
  {
    initial: 1000,
    initialDate: new Date(),
    finalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
    di: 12,
    ipca: 5,
    investiment: "LCI/LCA",
    tax: 10,
    type: "pre",

    color: 'var(--mantine-color-teal-6)',
    daysBetween: 0,
    plotTitle: '',
    formatedTax: '',
    dailyInterest: 0,
    gross: 0,
    fiscal: 0,
    fiscalLoss: 0,
    liquid: 0,
    rendiment: 0
  }
]

export default function Titulos() {
  const [titles, setTitles] = useState<Title[]>(initialTitles);
  const [rows, setRows] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>(colorData);
  const [series, setSeries] = useState<Serie[]>([]);
  const [ipca, setIpca] = useState<number>(0);
  const [cdi, setCdi] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const ipca: number = await getIpca(12);
      const cdi: number = await getCdi(12);

      setIpca(ipca);
      setCdi(cdi);
    };

    init();
  }, []);

  const form = useForm({
    initialValues: {
      initial: 1000,
      initialDate: new Date(),
      finalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
      di: 12,
      ipca: 5,
      investiment: "CDB",
      tax: 110,
      type: "cdi"
    },
  });

  const getNextColor = useCallback(() => {
    var index = 0;

    colors.forEach((item, i) => {
      if (!item.used) index = i;
    });

    const newColors = colors;
    newColors[index].used = true;

    setColors(newColors);

    return colors[index].color;
  }, [colors])

  useEffect(() => {
    let series: Serie[] = [];

    titles.forEach((item) => {
      series.push({ name: item.plotTitle, color: item.color })
    })

    setSeries(series);
  }, [titles])

  useEffect(() => {
    if (titles.length == 0) return;

    const initial = titles[0].initial;
    const initialDate = titles[0].initialDate;
    const daysBetween = titles[0].daysBetween;

    const data: any[] = [];

    let gross: number = 0;
    let liquid: number = 0;
    let daily: { [k: string]: any } = {};
    let date = new Date(initialDate.getTime())

    const yearsInNYers = 365 * 2;
    const stroke = Math.ceil(daysBetween / yearsInNYers);

    for (let i = 0; i < daysBetween; i += stroke) {
      daily = {};
      daily.date = date.toISOString().substring(0, 10).split("-").reverse().join("-").replaceAll('-', '/');

      for (let j = 0; j < titles.length; j++) {
        gross = (initial * (Math.pow(titles[j].dailyInterest, i))) - initial;
        liquid = gross - gross * (getFiscal(titles[j].investiment, i) / 100);
        daily[titles[j].plotTitle] = Math.round((initial + liquid) * 100) / 100;
      }

      data.push(daily)
      date.setDate(date.getDate() + stroke)
    }

    setData(data);
  }, [titles])

  const dateParser: DateInputProps['dateParser'] = (input) => {
    var parts = input.split("/");

    return new Date(parseInt(parts[2], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[0], 10));
  };

  const addTitle = useCallback((values: any) => {
    if (titles.length == MAX_TITLES) {
      return
    }

    var titleExists = false;

    titles.forEach(item => {
      if (item.type == values.type && item.tax == values.tax && item.investiment == values.investiment) {
        titleExists = true;
      }
    })

    if (titleExists) {
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    const newTitle: Title = {
      ...values,
      daysBetween: Math.round(Math.abs((values.finalDate - values.initialDate) / oneDay)),
      formatedTax: returnFormattedTitle(values.tax, values.type),
      color: getNextColor()
    }

    newTitle.plotTitle = newTitle.investiment + '(' + newTitle.tax + '%)';
    newTitle.dailyInterest = getDailyInterest(newTitle.type, newTitle.tax, newTitle.di, newTitle.ipca);
    newTitle.gross = compoundInterest(newTitle.initial, newTitle.dailyInterest, newTitle.daysBetween);
    newTitle.fiscal = getFiscal(newTitle.investiment, newTitle.daysBetween);
    newTitle.fiscalLoss = (newTitle.fiscal / 100) * newTitle.gross;
    newTitle.liquid = newTitle.initial + (newTitle.gross - newTitle.fiscalLoss);
    newTitle.rendiment = (newTitle.gross - newTitle.fiscalLoss) * 100 / newTitle.initial;

    setTitles(titles.concat(newTitle))
  }, [getNextColor, titles])

  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const newArray = [...titles];

    newArray.forEach((item) => {
      item.initial = form.values.initial;
      item.initialDate = form.values.initialDate;
      item.finalDate = form.values.finalDate;
      item.di = form.values.di;
      item.ipca = form.values.ipca;

      item.formatedTax = returnFormattedTitle(item.tax, item.type);
      item.plotTitle = item.investiment + '(' + item.tax + '%)';
      item.dailyInterest = getDailyInterest(item.type, item.tax, item.di, item.ipca);
      item.daysBetween = Math.round(Math.abs((item.finalDate.valueOf() - item.initialDate.valueOf()) / oneDay));
      item.gross = compoundInterest(item.initial, item.dailyInterest, item.daysBetween)
      item.fiscal = getFiscal(item.investiment, item.daysBetween);
      item.fiscalLoss = (item.fiscal / 100) * item.gross;
      item.liquid = item.initial + (item.gross - item.fiscalLoss);
      item.rendiment = (item.gross - item.fiscalLoss) * 100 / item.initial;
    })

    setTitles(newArray);
  }, [form.values.initial, form.values.initialDate, form.values.finalDate, form.values.di, form.values.ipca])

  const removeTitle = useCallback((i: number) => {
    const newArray = titles.filter((item, index) => {
      return index !== i
    })

    const newColors = colors;

    newColors.forEach(item => {
      if (item.color == titles[i].color) {
        item.used = false;
      }
    })

    setTitles(newArray);
    setColors(newColors)
  }, [colors, titles])

  useEffect(() => {
    const newRows = titles.map((item, i) => (
      <Table.Tr key={i}>
        <Table.Td>
          <ColorSwatch color={item.color} />
        </Table.Td>
        <Table.Td>{item.investiment}</Table.Td>
        <Table.Td>{item.formatedTax}</Table.Td>
        <Table.Td>
          <NumberFormatter prefix="R$ " thousandSeparator="." decimalSeparator="," value={item.gross} decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <Badge variant="outline" color="blue" style={{ width: 70 }}>
            <NumberFormatter suffix="%" thousandSeparator="." decimalSeparator="," value={item.fiscal} decimalScale={2} />
          </Badge>
        </Table.Td>
        <Table.Td>
          <NumberFormatter prefix="R$ " thousandSeparator="." decimalSeparator="," value={item.liquid} decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <NumberFormatter suffix="%" thousandSeparator="." decimalSeparator="," value={item.rendiment} decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <ActionIcon onClick={() => removeTitle(i)} size="lg" variant="subtle">
            <IconTrash color="var(--mantine-color-blue-6)" />
          </ActionIcon>
        </Table.Td>
      </Table.Tr >
    ))

    setRows(newRows);
  }, [removeTitle, titles]);

  const select = (
    <NativeSelect
      data={selectValues}
      rightSectionWidth={20}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: "rem(100)",
          marginRight: "70px",
        },
      }}
      {...form.getInputProps('type')}
    />
  );

  return (
    <div className={classes.teste}>
      <Header />
      <Container size="xl">
        <Group
          grow
          preventGrowOverflow={false}
          wrap="nowrap"
          style={{ width: "100%", alignItems: 'flex-start' }}>
          <form
            style={{ width: "500px" }}
            onSubmit={form.onSubmit((values) => addTitle(values))}
          >
            <Fieldset legend="Dados gerais">
              <NumberInput
                label="Investimento inicial"
                decimalSeparator=","
                decimalScale={2}
                {...form.getInputProps('initial')}
              />

              <Space h="sm" />
              <DateInput
                valueFormat="DD/MM/YYYY"
                label="Data inicial"
                dateParser={dateParser}
                placeholder="Date input"
                {...form.getInputProps('initialDate')}
              />
              <Space h="sm" />
              <DateInput
                valueFormat="DD/MM/YYYY"
                label="Data final"
                dateParser={dateParser}
                placeholder="Date input"
                {...form.getInputProps('finalDate')}
              />

              <NumberInput
                label="Taxa DI (12 meses)"
                placeholder="Percents"
                suffix="%"
                description={'últimos 12 meses: ' + cdi + '%'}
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                defaultValue={100}
                decimalSeparator=","
                decimalScale={2}
                mt="md"
                {...form.getInputProps('di')}
              />

              <NumberInput
                label="IPCA (12 meses)"
                placeholder="Percents"
                suffix="%"
                description={'últimos 12 meses: ' + ipca + '%'}
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                defaultValue={100}
                decimalSeparator=","
                decimalScale={2}
                mt="md"
                {...form.getInputProps('ipca')}
              />
            </Fieldset>

            <Space h="md" />
            <Fieldset legend="Investimento">

              <NativeSelect
                label="Tipo"
                data={['CDB', 'LCI/LCA']}
                {...form.getInputProps('investiment')}
              />

              <NumberInput
                label="Taxa"
                placeholder="Percents"
                suffix="%"
                decimalSeparator=","
                decimalScale={2}
                defaultValue={100}
                mt="md"
                rightSection={select}
                rightSectionWidth={100}
                {...form.getInputProps('tax')}
              />

              <Group justify="center" mt="xl">
                <Button
                  type="submit"
                  fullWidth={true}
                  variant="filled"
                  leftSection={<IconPlus size={14} />}
                >
                  Adicionar
                </Button>
              </Group>
            </Fieldset>

            <Flex
              justify="center"
              align="center"
              direction="column"
              mt={20}
            >
              <Title>Faça uma doação</Title>
              <Text c="dimmed" ta="center" mt={20}>
                Ajude a manter o website funcionando, entre no aplicativo do seu banco e faça um pix para o endereço QR code abaixo.
              </Text>
              <Image
                alt="qrcodepix"
                radius="md"
                src="pix.png"
                mt={30}
                width="80%"
              />
            </Flex>
          </form>

          <Flex
            gap="md"
            align="center"
            direction="column"
            wrap="wrap"
            style={{ width: "100%", height: "100%" }}
          >
            <Fieldset legend="Retornos" style={{ width: "100%" }}>
              <LineChart
                h={400}
                withLegend
                legendProps={{ verticalAlign: 'bottom', height: 50 }}
                data={data}
                dotProps={{ r: 0 }}
                style={{ marginTop: 15, marginLeft: -10 }}
                tooltipAnimationDuration={200}
                dataKey="date"
                series={series}
                curveType="linear"
              />
            </Fieldset>
            <Fieldset legend="Lista" style={{ width: "100%", height: "100%" }}>
              <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm" striped >
                  <Table.Caption>Adicione até 5 ativos</Table.Caption>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th></Table.Th>
                      <Table.Th>Tipo</Table.Th>
                      <Table.Th>Taxa</Table.Th>
                      <Table.Th>Rendimento Bruto</Table.Th>
                      <Table.Th>Imposto de Renda</Table.Th>
                      <Table.Th>Valor líquido</Table.Th>
                      <Table.Th>Rentabilidade</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>

              </Table.ScrollContainer>
            </Fieldset>
          </Flex>

        </Group>
      </Container>

      <Footer />
    </div >
  );
}