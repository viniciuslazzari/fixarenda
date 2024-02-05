import { Container, Text } from '@mantine/core';
import classes from './style.module.css';

export default function Footer() {
  return (
    <div className={classes.footer}>
      <Container size="xl" className={classes.inner}>
        <Text size='xs'> Vinícius Lazzari @ 2024 </Text>
      </Container>
    </div >
  );
}