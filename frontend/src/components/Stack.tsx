import React from "react";
import styled from "styled-components/macro";

type FlexJustification =
  | "center"
  | "flex-start"
  | "flex-end"
  | "space-around"
  | "space-between";

const sizes = {
  none: 0,
  xsmall: 5,
  small: 10,
  medium: 20,
  large: 40,
  xlarge: 80,
};

type Size = keyof typeof sizes;

function Stack({
  className,
  space = "medium",
  horizontal = false,
  fill = false,
  justify = "space-between",
  align = horizontal ? "center" : undefined,
  children,
}: {
  className?: string;
  space?: Size;
  horizontal?: boolean;
  fill?: boolean;
  justify?: FlexJustification;
  align?: FlexJustification;
  children?: React.ReactNode;
}) {
  const selectedSize = sizes[space];

  const flexStyle = {
    flexBasis: 0,
    justifyContent: justify,
    alignItems: align,
  };
  if (horizontal) {
    Object.assign(flexStyle, {
      display: "flex",
      flexDirection: "row",
    });

    if (fill) {
      Object.assign(flexStyle, {
        flex: 1,
        width: "100%",
        minHeight: "0",
      });
    }
  } else if (fill) {
    Object.assign(flexStyle, {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      height: "100%",
      minWidth: "0",
    });
  }

  const flexSpacerProps = fill ? { flexGrow: 0, flexShrink: 0 } : {};

  const spacerProps = horizontal
    ? { style: { width: selectedSize, ...flexSpacerProps } }
    : { style: { height: selectedSize, ...flexSpacerProps } };

  const childrenWithSpacers =
    selectedSize === 0
      ? children
      : React.Children.map(children, (child, index) => {
          return (
            <>
              {index !== 0 && <div {...spacerProps} />}
              {child}
            </>
          );
        });

  let element: React.ReactNode = (
    <div style={flexStyle} className={className}>
      {childrenWithSpacers}
    </div>
  );

  return element as JSX.Element;
}

//@ts-ignore
Stack = styled(Stack)``;

export default Stack;
