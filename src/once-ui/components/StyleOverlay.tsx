"use client";

import { forwardRef, useState } from "react";
import { IconButton, StylePanel, Flex } from ".";
import styles from "./StyleOverlay.module.scss";

interface StyleOverlayProps extends React.ComponentProps<typeof Flex> {}

const StyleOverlay = forwardRef<HTMLDivElement, StyleOverlayProps>(({ ...rest }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Flex ref={ref} {...rest} fillHeight position="fixed" zIndex={1}>
      <IconButton
        variant={isOpen ? "secondary" : "primary"}
        icon="openLink"
        href="https://www.saraththarayil.com/work"
      />

    </Flex>
  );
});

StyleOverlay.displayName = "StyleOverlay";
export { StyleOverlay };
