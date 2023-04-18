declare module "raw-loader!*";

declare module "*.svg" {
    const content: any;
    export default content;
}
