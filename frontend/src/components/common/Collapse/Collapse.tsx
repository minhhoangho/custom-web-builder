

export function Collapse({ children, ...props }) {
  return (
    <MuiCollapse {...props}>
      {children}
    </MuiCollapse>
  );
}