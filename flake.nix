{
  description = "My project using pnpm";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    pnpm2nix.url = "github:nzbr/pnpm2nix-nzbr";
  };

  outputs = { self, nixpkgs,pnpm2nix  }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    nodejs = pkgs.nodejs;
    #pnpm = kgs.nodePackages.pnpm;
    pnpm = pnpm2nix.packages.${system};
    drv = pnpm.mkPnpmPackage; #pkgs.stdenv.mkDerivation;
  in {
  packages.${system}.default = drv rec {
    name = "stb-engine";
    src = ./.;
    packageJSON = "${src}/package.json5";
    distDir = "_site";
    copyPnpmStore = false;
    extraNodeModuleSources = [{
      name = "package.json5";
      value = "${src}/package.json5";
    }];
    installInPlace = true;
    installEnv = {
      PNPM_HOME = "$out/pnpm";
      NODE_TLS_REJECT_UNAUTHORIZED = "0";
    };
    registry = "http://registry.npmjs.org/";
  };
  apps.${system}.default = {
    type = "app";
    program = "${pkgs.nodePackages.pnpm}/bin/pnpm";
  };
  };

}
