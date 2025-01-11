const baseURL = "demo.once-ui.com";

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: "dark", // dark | light
  neutral: "gray", // sand | gray | slate
  brand: "cyan", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "cyan", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: "contrast", // color | contrast | inverse
  solidStyle: "flat", // flat | plastic
  border: "playful", // rounded | playful | conservative
  surface: "filled", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

// default metadata
const meta = {
  title: "Wordle",
  description:
    "",
};

// default open graph data
const og = {
  title: "wordle",
  description: "",
  type: "website",
  image: ""
};

// default schema data
const schema = {
  logo: "",
  type: "Organization",
  name: "saraththarayil",
  description: "",
  email: "",
};

// social links
const social = {
  twitter: "https://www.twitter.com/SarathTharayil",
  linkedin: "https://www.linkedin.com/in/SarathTharayil",
  discord: "",
};

export { baseURL, style, meta, og, schema, social };
