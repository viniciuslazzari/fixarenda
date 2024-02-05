"use client";

import { Menu, Group, Center, Burger, Container, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import classes from './style.module.css';

const links = [
  { link: '/', label: 'Início' },
  {
    link: '/simuladores',
    label: 'Simuladores',
    links: [
      { link: '/simuladores/titulos', label: 'Títulos de Renda fixa' },
    ],
  },
  { link: '/uteis', label: 'Úteis' },
  { link: '/sobre', label: 'Sobre' },
];

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>
        <a
          href={item.link}
          className={classes.link}
        >{item.label}</a>
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Group>
            <Text
              style={{ marginRight: 3, fontSize: 30 }}>
              🤑
            </Text>
            <Text
              size="xl"
              fw={700}
            >
              Fixa Renda
            </Text>
          </Group>

          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}