import { Children, cloneElement } from "react";

export const StyledTitle = ({ title, subtitle }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3 style={{ marginBottom: "0.25rem" }}>{title}</h3>
      {subtitle && (
        <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>{subtitle}</span>
      )}
    </div>
  );
};

export const StyledTab = ({ children }) => {
  // Note: Starlight uses different tab components than Docusaurus
  // This component wraps children for styled display
  return (
    <div className="styled-tabs">
      {Children.map(children, (child) => {
        return cloneElement(child, {
          children: (
            <div style={{ fontSize: "0.875rem" }}>{child.props.children}</div>
          ),
        });
      })}
    </div>
  );
};

export const ImageSizer = ({ children, width = "350px" }) => {
  return <div style={{ width, margin: "0" }}>{children}</div>;
};
