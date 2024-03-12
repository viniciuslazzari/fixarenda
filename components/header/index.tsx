"use client";

import { Menu, Group, Center, Container, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import classes from './style.module.css';
import cx from 'clsx';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

const links = [
  { link: '/', label: 'Início' },
  {
    label: 'Simuladores',
    links: [
      { link: '/titulos', label: 'Títulos de Renda fixa' },
    ],
  },
];

export default function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>
        <a
          href={item.link}
          className={classes.linkNew}
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
      <Container size="xl">
        <div className={classes.inner}>
          <a
            href={"/"}
            className={classes.linkNew}
            style={{ padding: 0 }}
          >
            <Group>
              <Text
                style={{ fontSize: 30 }}>
                🤑
              </Text>
              <Text
                size="xl"
                fw={700}
                className={classes.title}
              >
                Fixa Renda
              </Text>
            </Group>
          </a>

          <Group gap={5} visibleFrom="sm">
            {items}
            <ActionIcon
              style={{ marginLeft: 20 }}
              onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
              <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
            </ActionIcon>
          </Group>

        </div>
      </Container>
    </header >
  );
}