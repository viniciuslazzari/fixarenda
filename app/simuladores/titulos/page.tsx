"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import React, { useCallback, useEffect, useState } from "react";
import classes from "./style.module.css";
import { LineChart } from '@mantine/charts';
import { Button, Container, Fieldset, Group, NativeSelect, NumberInput, Space, Flex, Table, NumberFormatter, ActionIcon, ColorSwatch } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { compoundInterest, getDailyInterest, getFiscal, returnFormattedTitle } from "../../../services/finance"
import { IconTrash } from "@tabler/icons-react";

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
  { color: 'var(--mantine-color-indigo-6)', used: false },
  { color: 'var(--mantine-color-pink-6)', used: false },
  { color: 'var(--mantine-color-cyan-6)', used: false },
  { color: 'var(--mantine-color-lime-6)', used: false },
  { color: 'var(--mantine-color-yellow-6)', used: false }
]

export default function Titulos() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>(colorData);
  const [series, setSeries] = useState<any[]>([]);

  const form = useForm({
    initialValues: {
      initial: 1000,
      initialDate: new Date(),
      finalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      di: 12,
      ipca: 12.5,
      investiment: "CDB",
      tax: 110,
      type: "cdi"
    },
  });

  const getNextColor = useCallback(() => {
    var index = 0;

    colors.forEach((item, i) => {
      if (!item.used) {
        index = i;
        return;
      }
    });

    const newColors = colors;
    newColors[index].used = true;

    setColors(newColors);

    return colors[index].color;
  }, [colors])

  useEffect(() => {
    if (titles.length == 0) {
      return;
    }

    const initial = titles[0].initial;
    const initialDate = titles[0].initialDate;
    const finalDate = titles[0].finalDate;

    const data: any[] = [];

    let i = 0;

    for (let date = new Date(initialDate.getTime()); date <= finalDate; date.setDate(date.getDate() + 1)) {
      var daily: { [k: string]: any } = {};

      daily.date = date.toISOString().substring(0, 10);

      for (let j = 0; j < titles.length; j++) {
        const gross = (initial * (Math.pow(titles[j].dailyInterest, i))) - initial;
        const liquid = gross - gross * (getFiscal(titles[j].investiment, i) / 100);
        daily[titles[j].plotTitle] = initial + liquid;
      }

      data.push(daily)
      i++;
    }

    var series: Serie[] = [];

    titles.forEach((item) => {
      series.push({ name: item.plotTitle, color: item.color })
    })

    setSeries(series);
    setData(data);
  }, [titles])

  useEffect(() => {
    console.log(data)
  }, [data])

  const addTitle = useCallback((values: any) => {
    if (titles.length == MAX_TITLES) {
      return;
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
  }, [titles])

  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const newArray = [...titles];

    newArray.forEach((item) => {
      item.initial = form.values.initial;
      item.initialDate = form.values.initialDate;
      item.finalDate = form.values.finalDate;
      item.di = form.values.di;
      item.ipca = form.values.ipca;

      item.dailyInterest = getDailyInterest(item.type, item.tax, item.di, item.ipca);
      item.daysBetween = Math.round(Math.abs((item.finalDate.valueOf() - item.initialDate.valueOf()) / oneDay));
      item.gross = compoundInterest(item.initial, item.dailyInterest, item.daysBetween)
      item.fiscal = getFiscal(item.investiment, item.daysBetween);
      item.fiscalLoss = (item.fiscal / 100) * item.gross;
      item.liquid = item.initial + (item.gross - item.fiscalLoss);
      item.rendiment = (item.gross - item.fiscalLoss) * 100 / item.initial;
    })

    setTitles(newArray);
  }, [form.values.initial, , form.values.initialDate, form.values.finalDate, form.values.di, form.values.ipca])

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
          <NumberFormatter suffix="%" thousandSeparator="." decimalSeparator="," value={item.fiscal} decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <NumberFormatter prefix="R$ " thousandSeparator="." decimalSeparator="," value={item.liquid} decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <NumberFormatter suffix="%" thousandSeparator="." decimalSeparator="," value={item.rendiment} decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <ActionIcon onClick={() => removeTitle(i)} size="lg" variant="danger">
            <IconTrash />
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
                placeholder="Date input"
                {...form.getInputProps('initialDate')}
              />
              <Space h="sm" />
              <DateInput
                valueFormat="DD/MM/YYYY"
                label="Data final"
                placeholder="Date input"
                {...form.getInputProps('finalDate')}
              />

              <NumberInput
                label="Taxa DI (12 meses)"
                placeholder="Percents"
                suffix="%"
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
                data={['CDB', 'LCI/LCA', 'CRA/CRI']}
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
                <Button type="submit" fullWidth={true} variant="filled">Adicionar</Button>
              </Group>
            </Fieldset>
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