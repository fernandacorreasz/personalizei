declare module "three" {
  const THREE: any;
  export = THREE;
}

declare module "three/examples/jsm/loaders/FBXLoader.js" {
  export class FBXLoader {
    load(
      url: string,
      onLoad: (object: any) => void,
      onProgress?: (event: any) => void,
      onError?: (error: any) => void,
    ): void;
  }
}
