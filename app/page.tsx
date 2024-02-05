"use client";

import Header from '@/components/header';
import { Container, Text, Grid, Space, SimpleGrid, Image, rem, Box, Title, Group, ActionIcon } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import classes from './style.module.css';
import Footer from '@/components/footer';

export default function Demo() {
  return (
    <div className={classes.teste}>
      <Header />

      <Container size="xl" style={{ marginTop: 50 }}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">

          <Box>
            <Title order={1} fw={900} className={classes.title}>O projeto</Title>
            <Space h="xl" />
            <Text size='xl'>
              O Fixa Renda é uma ferramenta que tem como objetivo ajudar os investidores a tomar
              melhores decisões em relação aos seus investimentos, sejam eles em renda fixa ou variável.
            </Text>
            <Space h="xl" />
            <Text size='xl'>
              A meta é oferecer simuladores e calculadoras, além de outras ferramentas, cobrindo os mais
              diversos tipos de investimentos, como bolsa de valores, cdbs, financiamentos e ações.
            </Text>
            <Space h="xl" />
            <Text size='xl'>
              A ideia foi criada em fevereiro de 2024 e atualmente não possui financiamento de nenhuma empresa,
              por isso, caso tenho gostado da proposta e queira auxiliar na manutenção e desenvolvimento do projeto,
              sinta-se livre para fazer uma contribuição, qualquer valor é bem vindo.
            </Text>
          </Box>

          <Grid gutter="md">

            <Grid.Col>
              <Title order={1} fw={900} className={classes.title}>Entre em contato</Title>
              <Space h="xl" />
              <Text size='xl'>
                Sugestões de funcionalidades e correção de problemas são sempre bem vindas.
              </Text>
              <Space h="xl" />
              <Group>
                <ActionIcon
                  variant="default"
                  size="lg"
                  aria-label="Toggle color scheme"
                >
                  <IconAt style={{ width: rem(24), height: rem(24) }} />
                </ActionIcon>
                <Text>vinilazzari028@gmail.com</Text>
              </Group>
            </Grid.Col>

            <Grid.Col>
              <Title order={1} fw={900} className={classes.title}>Apoie essa ideia</Title>
              <Space h="xl" />
              <Group>
                <Image
                  alt="qrcodepix"
                  radius="md"
                  h={200}
                  src="pix.png"
                />
              </Group>
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      </Container>

      <Footer />
    </div >
  );
}