{
  description = "My project using pnpm";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs  }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    shell = pkgs.mkShell;
    drv = pkgs.stdenv.mkDerivation;
    pnpm = pkgs.nodePackages.pnpm;
  in {
    packages.${system}.default = drv {
      name = "stb-engine";
      src = ./.;
      nativeBuildInputs = with pkgs; [
        cacert
         pnpm
      ];
      buildPhase = ''
        export HOME=$NIX_BUILD_TOP
        store=$(pnpm store path)
        pnpm install
        pnpm build
        cp -r _site $out
      '';
    };
    apps.${system}.default = {
      type = "app";
      program = "${pnpm}/bin/pnpm";
    };
  };


}
