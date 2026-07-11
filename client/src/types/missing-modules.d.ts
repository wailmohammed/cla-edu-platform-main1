declare module "nodemailer" {
  export const Transporter: any;
  export const createTransport: any;
  const nodemailer: any;
  export default nodemailer;
}

declare module "html2pdf.js" {
  const html2pdf: any;
  export default html2pdf;
}

declare module "canvas-confetti" {
  const confetti: any;
  export default confetti;
}

declare module "streamdown" {
  const mod: any;
  export const Streamdown: any;
  export const Block: any;
  export const StreamdownContext: any;
  export type { StreamdownProps, ControlsConfig, MermaidErrorComponentProps, MermaidOptions, StreamdownContextType } from "streamdown";
  export default mod;
}

declare module "react-dropzone" {
  export const useDropzone: any;
}
