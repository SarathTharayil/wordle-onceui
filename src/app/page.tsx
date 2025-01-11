"use client";

import React, { useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import Keyboard from "/Keyboard.jsx"
import {
  Heading,
  Text,
  Button,
  Icon,
  InlineCode,
  Logo,
  Background,
  useToast,
  Fade,
  DateRange,
  IconButton,
  Column,
  Row,
  StyleOverlay,
} from "@/once-ui/components";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";

export default function Home() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");


  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Row position="fixed" top="0" fillWidth justifyContent="center" zIndex={3}>
        <Row
          data-border="rounded"
          justifyContent="space-between"
          maxWidth="l"
          paddingRight="64"
          paddingLeft="32"
          paddingY="20"
        >
          <Logo size="m" icon={false} href="https://www.saraththarayil.com" />
          <Row gap="12" hide="s">
            <Button
              href="https://github.com/once-ui-system/nextjs-starter"
              prefixIcon="github"
              size="s"
              label="GitHub"
              weight="default"
              variant="tertiary"
            />
            <StyleOverlay top="20" right="24" />
          </Row>
          <Row gap="16" show="s" alignItems="center" paddingRight="24">
            <IconButton
              href="https://github.com/once-ui-system/nextjs-starter"
              icon="github"
              variant="tertiary"
            />
            <StyleOverlay top="20" right="24" />
          </Row>
        </Row>
      </Row>
      <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        alignItems="center"
        border="neutral-alpha-weak"
        fillWidth
      >
        <Column
          fillWidth
          alignItems="center"
          gap="48"
          radius="xl"
          paddingTop="80"
          position="relative"
        >
          <Background
            mask={{
              x: 0,
              y: 48,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          />
          <Background
            mask={{
              x: 80,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              tilt: -35,
              height: 50,
              width: 75,
              x: 100,
              y: 40,
              colorStart: "accent-solid-medium",
              colorEnd: "static-transparent",
            }}
          />
          <Background
            mask={{
              x: 100,
              y: 0,
              radius: 100,
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: -35,
              height: 20,
              width: 120,
              x: 120,
              y: 35,
              colorStart: "brand-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
            <InlineCode radius="xl" shadow="m" fit paddingX="16" paddingY="8">
              wordle from
              <Text onBackground="brand-medium" marginLeft="8">
              <a href= "https://www.saraththarayil.com" target="_blank">saraththarayil.com </a>
              </Text>
            </InlineCode>

            <Column alignItems="center" paddingTop="64" fillWidth gap="24">


            
            </Column>
          </Column>

        </Column>

      </Column>

      
    </Column>
  );
}
